document.getElementById('add-todo').addEventListener('click', addTodo);

window.addEventListener('DOMContentLoaded', loadTodos); // Cargar tareas al abrir

function addTodo() {
    const todoTitle = document.getElementById('todo-title').value.trim();
    if (todoTitle === '') return;

    const todo = {
        title: todoTitle,
        completed: false
    };

    const todos = getTodosFromStorage();
    todos.push(todo);
    saveTodosToStorage(todos);
    renderTodos();
    document.getElementById('todo-title').value = '';
}

function renderTodos() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    const todos = getTodosFromStorage();

    todos.forEach((todo, index) => {
        const todoItem = document.createElement('li');
        todoItem.textContent = todo.title;
        if (todo.completed) todoItem.classList.add('completed');

        const editButton = document.createElement('button');
        const editIcon = document.createElement('img');
        editIcon.src = 'Img/1.png';
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const newTitle = prompt('Editar tarea:', todo.title);
            if (newTitle !== null && newTitle.trim() !== '') {
                todos[index].title = newTitle.trim();
                saveTodosToStorage(todos);
                renderTodos();
            }
        });

        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'Img/2.png';
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            todos.splice(index, 1);
            saveTodosToStorage(todos);
            renderTodos();
        });

        todoItem.appendChild(editButton);
        todoItem.appendChild(deleteButton);
        todoItem.addEventListener('click', () => {
            todos[index].completed = !todos[index].completed;
            saveTodosToStorage(todos);
            renderTodos();
        });

        todoList.appendChild(todoItem);
    });
}

function getTodosFromStorage() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function saveTodosToStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    renderTodos();
}
