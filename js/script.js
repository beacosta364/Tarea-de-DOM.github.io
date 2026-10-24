const STORAGE_KEY = 'weeklyTodoApp';
const OLD_STORAGE_KEY = 'todos';

const DAYS = [
    { id: 'lunes', name: 'Lunes', short: 'Lun' },
    { id: 'martes', name: 'Martes', short: 'Mar' },
    { id: 'miercoles', name: 'Miércoles', short: 'Mié' },
    { id: 'jueves', name: 'Jueves', short: 'Jue' },
    { id: 'viernes', name: 'Viernes', short: 'Vie' },
    { id: 'sabado', name: 'Sábado', short: 'Sáb' },
    { id: 'domingo', name: 'Domingo', short: 'Dom' }
];

let appData = loadData();
let currentListId = null;
let currentDay = 'lunes';

// Elementos del HTML
const listsSection = document.getElementById('lists-section');
const tasksSection = document.getElementById('tasks-section');
const listsContainer = document.getElementById('lists-container');
const listNameInput = document.getElementById('list-name');
const todoTitleInput = document.getElementById('todo-title');
const todoList = document.getElementById('todo-list');
const weekDays = document.getElementById('week-days');

// Eventos principales
document.getElementById('add-list').addEventListener('click', addList);
document.getElementById('add-todo').addEventListener('click', addTodo);

document.getElementById('back-to-lists').addEventListener('click', () => {
    currentListId = null;
    renderLists();
    showListsSection();
});

listNameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addList();
});

todoTitleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTodo();
});

// Fecha del lunes de la semana actual.
// Se usa la fecha local del navegador, sin depender de la hora.
function getWeekKey(date = new Date()) {
    const monday = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const day = monday.getDay();
    const daysSinceMonday = (day + 6) % 7;

    monday.setDate(monday.getDate() - daysSinceMonday);

    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(monday.getDate()).padStart(2, '0');

    return `${year}-${month}-${dayOfMonth}`;
}

// Carga datos y comprueba si comenzó una nueva semana.
function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let data;

    if (savedData) {
        try {
            data = JSON.parse(savedData);
        } catch (error) {
            console.error('No se pudieron leer los datos guardados:', error);
        }
    }

    // Migración de la versión anterior.
    if (!data || !Array.isArray(data.lists)) {
        let oldTodos = [];

        try {
            oldTodos = JSON.parse(
                localStorage.getItem(OLD_STORAGE_KEY) || '[]'
            );
        } catch (error) {
            console.error('No se pudieron leer las tareas anteriores:', error);
        }

        if (!Array.isArray(oldTodos)) oldTodos = [];

        data = {
            lists: [{
                id: createId(),
                name: 'Mi lista',
                tasks: oldTodos
                    .filter(todo => todo && typeof todo.title === 'string')
                    .map(todo => ({
                        id: createId(),
                        title: todo.title,
                        day: 'lunes',
                        completed: Boolean(todo.completed)
                    }))
            }],
            lastResetWeek: getWeekKey()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Normaliza los datos para que todas las tareas tengan sus propiedades.
    data.lists.forEach(list => {
        if (!Array.isArray(list.tasks)) list.tasks = [];

        list.tasks = list.tasks
            .filter(task => task && typeof task.title === 'string')
            .map(task => ({
                id: task.id || createId(),
                title: task.title,
                day: DAYS.some(day => day.id === task.day)
                    ? task.day
                    : 'lunes',
                completed: Boolean(task.completed)
            }));
    });

    // Reinicia las tareas completadas cuando cambia la semana.
    const currentWeek = getWeekKey();

    if (data.lastResetWeek !== currentWeek) {
        data.lists.forEach(list => {
            list.tasks.forEach(task => {
                task.completed = false;
            });
        });

        data.lastResetWeek = currentWeek;
        saveData(data);
    }

    return data;
}

// Genera identificadores únicos para listas y tareas.
function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Guarda toda la información en el navegador.
function saveData(data = appData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Busca la lista actualmente abierta.
function getCurrentList() {
    return appData.lists.find(list => list.id === currentListId);
}

// Crea una nueva lista.
function addList() {
    const name = listNameInput.value.trim();

    if (!name) {
        alert('Escribe un nombre para la lista.');
        return;
    }

    appData.lists.push({
        id: createId(),
        name: name,
        tasks: []
    });

    saveData();
    listNameInput.value = '';
    renderLists();
}

// Muestra todas las listas.
function renderLists() {
    listsContainer.innerHTML = '';

    appData.lists.forEach(list => {
        const item = document.createElement('li');

        const openButton = document.createElement('button');
        openButton.className = 'list-name-button';
        openButton.textContent = list.name;
        openButton.addEventListener('click', () => openList(list.id));

        const renameButton = document.createElement('button');
        renameButton.className = 'action-button';
        renameButton.textContent = 'Renombrar';
        renameButton.addEventListener('click', () => renameList(list.id));

        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-button delete-button';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => deleteList(list.id));

        item.append(openButton, renameButton, deleteButton);
        listsContainer.appendChild(item);
    });
}

// Abre una lista y muestra sus días.
function openList(listId) {
    currentListId = listId;
    currentDay = 'lunes';

    renderTasks();
    showTasksSection();
}

function showListsSection() {
    listsSection.hidden = false;
    tasksSection.hidden = true;
}

function showTasksSection() {
    listsSection.hidden = true;
    tasksSection.hidden = false;
}

// Cambia el nombre de una lista.
function renameList(listId) {
    const list = appData.lists.find(item => item.id === listId);
    if (!list) return;

    const newName = prompt('Nuevo nombre de la lista:', list.name);

    if (newName === null || !newName.trim()) return;

    list.name = newName.trim();
    saveData();
    renderLists();

    if (currentListId === listId) {
        renderTasks();
    }
}

// Elimina una lista y todas sus tareas.
function deleteList(listId) {
    const list = appData.lists.find(item => item.id === listId);
    if (!list) return;

    const confirmed = confirm(
        `¿Quieres eliminar la lista "${list.name}" y todas sus tareas?`
    );

    if (!confirmed) return;

    appData.lists = appData.lists.filter(item => item.id !== listId);

    if (currentListId === listId) {
        currentListId = null;
        showListsSection();
    }

    saveData();
    renderLists();
}

// Dibuja los botones de lunes a domingo.
function renderDays() {
    weekDays.innerHTML = '';

    DAYS.forEach(day => {
        const button = document.createElement('button');
        button.className = 'day-button';
        button.textContent = day.short;
        button.title = day.name;

        if (currentDay === day.id) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            currentDay = day.id;
            renderTasks();
        });

        weekDays.appendChild(button);
    });
}

// Añade una tarea al día seleccionado.
function addTodo() {
    const title = todoTitleInput.value.trim();
    const list = getCurrentList();

    if (!list) return;

    if (!title) {
        alert('Escribe el nombre de la tarea.');
        return;
    }

    list.tasks.push({
        id: createId(),
        title: title,
        day: currentDay,
        completed: false
    });

    saveData();
    todoTitleInput.value = '';
    renderTasks();
}

// Muestra las tareas del día seleccionado.
function renderTasks() {
    const list = getCurrentList();

    if (!list) {
        showListsSection();
        return;
    }

    document.getElementById('current-list-title').textContent = list.name;

    const selectedDay = DAYS.find(day => day.id === currentDay);
    document.getElementById('current-day-title').textContent =
        selectedDay.name;

    renderDays();
    todoList.innerHTML = '';

    const dayTasks = list.tasks.filter(task => task.day === currentDay);

    document.getElementById('empty-message').hidden = dayTasks.length > 0;

    dayTasks.forEach(task => {
        const item = document.createElement('li');

        if (task.completed) {
            item.classList.add('completed');
        }

        const taskTitle = document.createElement('span');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.title;
        taskTitle.title = 'Haz clic para marcar como completada';

        taskTitle.addEventListener('click', () => {
            task.completed = !task.completed;
            saveData();
            renderTasks();
        });

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editButton = document.createElement('button');
        editButton.className = 'action-button';
        editButton.textContent = 'Editar';

        editButton.addEventListener('click', () => {
            const newTitle = prompt('Editar tarea:', task.title);

            if (newTitle === null || !newTitle.trim()) return;

            task.title = newTitle.trim();
            saveData();
            renderTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-button delete-button';
        deleteButton.textContent = 'Eliminar';

        deleteButton.addEventListener('click', () => {
            const confirmed = confirm('¿Eliminar esta tarea?');

            if (!confirmed) return;

            list.tasks = list.tasks.filter(item => item.id !== task.id);
            saveData();
            renderTasks();
        });

        actions.append(editButton, deleteButton);
        item.append(taskTitle, actions);
        todoList.appendChild(item);
    });
}

// Inicio de la aplicación.
renderLists();
showListsSection();
