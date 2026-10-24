
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
let editingTask = null;
let editingNoteOnly = false;
let deleteNoteButton = null;

// Elementos del HTML
const listsSection = document.getElementById('lists-section');
const tasksSection = document.getElementById('tasks-section');
const listsContainer = document.getElementById('lists-container');
const listNameInput = document.getElementById('list-name');
const todoTitleInput = document.getElementById('todo-title');
const todoList = document.getElementById('todo-list');
const weekDays = document.getElementById('week-days');

const taskModal = document.getElementById('task-modal');
const modalTaskTitle = document.getElementById('modal-task-title');
const modalTaskDay = document.getElementById('modal-task-day');
const modalTaskNote = document.getElementById('modal-task-note');
const saveTaskButton = document.getElementById('save-task');
const cancelTaskButton = document.getElementById('cancel-task');

// Eventos principales
document.getElementById('add-list').addEventListener('click', addList);
document.getElementById('add-todo').addEventListener('click', addTodo);

document.getElementById('back-to-lists').addEventListener('click', () => {
    currentListId = null;
    renderLists();
    showListsSection();
});

listNameInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') addList();
});

todoTitleInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') addTodo();
});

// Eventos de la ventana emergente
saveTaskButton.addEventListener('click', saveTaskChanges);
cancelTaskButton.addEventListener('click', closeTaskModal);

taskModal.addEventListener('click', event => {
    if (event.target === taskModal) {
        closeTaskModal();
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !taskModal.hidden) {
        closeTaskModal();
    }
});

// Carga los días en el selector de la ventana emergente.
DAYS.forEach(day => {
    const option = document.createElement('option');
    option.value = day.id;
    option.textContent = day.name;
    modalTaskDay.appendChild(option);
});

// Obtiene la fecha del lunes de la semana actual.
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

// Carga los datos y comprueba si comenzó una nueva semana.
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

    // Migra las tareas de la versión anterior si es necesario.
    if (!data || !Array.isArray(data.lists)) {
        let oldTodos = [];

        try {
            oldTodos = JSON.parse(
                localStorage.getItem(OLD_STORAGE_KEY) || '[]'
            );
        } catch (error) {
            console.error(
                'No se pudieron leer las tareas anteriores:',
                error
            );
        }

        if (!Array.isArray(oldTodos)) {
            oldTodos = [];
        }

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
                        completed: Boolean(todo.completed),
                        note: ''
                    }))
            }],
            lastResetWeek: getWeekKey()
        };
    }

    // Normaliza las listas y las tareas guardadas.
    data.lists.forEach(list => {
        if (!Array.isArray(list.tasks)) {
            list.tasks = [];
        }

        list.tasks = list.tasks
            .filter(task => task && typeof task.title === 'string')
            .map(task => ({
                id: task.id || createId(),
                title: task.title,
                day: DAYS.some(day => day.id === task.day)
                    ? task.day
                    : 'lunes',
                completed: Boolean(task.completed),
                note: typeof task.note === 'string' ? task.note : ''
            }));
    });

    // Reinicia el estado de completado al comenzar una nueva semana.
    const currentWeek = getWeekKey();

    if (data.lastResetWeek !== currentWeek) {
        data.lists.forEach(list => {
            list.tasks.forEach(task => {
                task.completed = false;
            });
        });

        data.lastResetWeek = currentWeek;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    return data;
}

// Genera identificadores únicos.
function createId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === 'function'
    ) {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Guarda la información en el navegador.
function saveData(data = appData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Obtiene la lista actualmente abierta.
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

// Abre una lista y muestra sus tareas.
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
        completed: false,
        note: ''
    });

    saveData();
    todoTitleInput.value = '';
    renderTasks();
}

// Abre la ventana emergente para editar una tarea o gestionar su nota.
function openTaskModal(task, focusNote = false) {
    editingTask = task;
    editingNoteOnly = focusNote;

    modalTaskTitle.value = task.title;
    modalTaskDay.value = task.day;
    modalTaskNote.value = task.note || '';

    const modalTitle = document.getElementById('modal-title');

    const titleLabel = modalTaskTitle.previousElementSibling;
    const dayLabel = modalTaskDay.previousElementSibling;
    const noteLabel = modalTaskNote.previousElementSibling;

    if (focusNote) {
        // Modo para consultar o editar únicamente la nota.
        modalTitle.textContent = task.note
            ? 'Nota de la tarea'
            : 'Añadir nota';

        titleLabel.hidden = true;
        modalTaskTitle.hidden = true;

        dayLabel.hidden = true;
        modalTaskDay.hidden = true;

        noteLabel.hidden = false;
        modalTaskNote.hidden = false;

        saveTaskButton.textContent = 'Guardar nota';

        // Crea el botón para eliminar la nota una sola vez.
        if (!deleteNoteButton) {
            deleteNoteButton = document.createElement('button');
            deleteNoteButton.type = 'button';
            deleteNoteButton.className =
                'action-button delete-button';
            deleteNoteButton.textContent = 'Eliminar nota';

            deleteNoteButton.addEventListener('click', deleteTaskNote);

            cancelTaskButton.parentElement.insertBefore(
                deleteNoteButton,
                cancelTaskButton
            );
        }

        deleteNoteButton.hidden = !task.note;

        modalTaskNote.focus();
    } else {
        // Modo normal para editar el título, el día y la nota.
        modalTitle.textContent = 'Editar tarea';

        titleLabel.hidden = false;
        modalTaskTitle.hidden = false;

        dayLabel.hidden = false;
        modalTaskDay.hidden = false;

        noteLabel.hidden = false;
        modalTaskNote.hidden = false;

        saveTaskButton.textContent = 'Guardar cambios';

        if (deleteNoteButton) {
            deleteNoteButton.hidden = true;
        }

        modalTaskTitle.focus();
    }

    taskModal.hidden = false;
}

// Guarda los cambios de la tarea o únicamente su nota.
function saveTaskChanges() {
    if (!editingTask) return;

    if (editingNoteOnly) {
        // En este modo no se modifican el título ni el día.
        editingTask.note = modalTaskNote.value.trim();
    } else {
        const newTitle = modalTaskTitle.value.trim();

        if (!newTitle) {
            alert('Escribe el nombre de la tarea.');
            modalTaskTitle.focus();
            return;
        }

        editingTask.title = newTitle;

        if (DAYS.some(day => day.id === modalTaskDay.value)) {
            editingTask.day = modalTaskDay.value;
        }

        editingTask.note = modalTaskNote.value.trim();

        // Muestra el día al que se trasladó la tarea.
        currentDay = editingTask.day;
    }

    saveData();
    closeTaskModal();
    renderTasks();
}

// Elimina únicamente la nota, sin eliminar la tarea.
function deleteTaskNote() {
    if (!editingTask || !editingTask.note) return;

    const confirmed = confirm(
        '¿Quieres eliminar la nota de esta tarea?'
    );

    if (!confirmed) return;

    editingTask.note = '';

    saveData();
    closeTaskModal();
    renderTasks();
}

// Cierra la ventana sin guardar los cambios pendientes.
function closeTaskModal() {
    taskModal.hidden = true;
    editingTask = null;
    editingNoteOnly = false;
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

        // Título de la tarea.
        const taskTitle = document.createElement('span');
        taskTitle.className = 'task-title';
        taskTitle.textContent = task.title;
        taskTitle.title = 'Haz clic para marcar como completada';

        taskTitle.addEventListener('click', () => {
            task.completed = !task.completed;
            saveData();
            renderTasks();
        });

        // Botón para consultar o añadir la nota.
        const noteButton = document.createElement('button');
        noteButton.className = 'action-button note-button';

        if (task.note && task.note.trim()) {
            noteButton.textContent = '📝 Ver nota';
            noteButton.title = 'Esta tarea tiene una nota guardada';
            noteButton.setAttribute('aria-label', 'Ver nota de la tarea');
        } else {
            noteButton.textContent = '+ Añadir nota';
            noteButton.title = 'Añadir una nota a esta tarea';
        }

        noteButton.addEventListener('click', () => {
            openTaskModal(task, true);
        });

        // Botón para editar el título, el día y la nota.
        const editButton = document.createElement('button');
        editButton.className = 'action-button';
        editButton.textContent = 'Editar';

        editButton.addEventListener('click', () => {
            openTaskModal(task);
        });

        // Botón para eliminar la tarea completa.
        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-button delete-button';
        deleteButton.textContent = 'Eliminar';

        deleteButton.addEventListener('click', () => {
            const confirmed = confirm('¿Eliminar esta tarea?');

            if (!confirmed) return;

            list.tasks = list.tasks.filter(
                item => item.id !== task.id
            );

            saveData();
            renderTasks();
        });

        // Ensambla los elementos de la tarea.
        const actions = document.createElement('div');
        actions.className = 'task-actions';

        actions.append(noteButton, editButton, deleteButton);

        item.appendChild(taskTitle);
        item.appendChild(actions);

        todoList.appendChild(item);
    });
}

// Inicio de la aplicación.
renderLists();
showListsSection();
