document.getElementById('add-todo').addEventListener('click', addTodo);

function addTodo() {
    const todoTitle = document.getElementById('todo-title').value;
    if (todoTitle === '') return;

    const todoList = document.getElementById('todo-list');
    const todoItem = document.createElement('li');
    todoItem.textContent = todoTitle;

    const editButton = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.src = '1.png'; // img
    editButton.appendChild(editIcon);
    editButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        const newTitle = prompt('Editar tarea:', todoItem.firstChild.textContent);
        if (newTitle !== null) {
            todoItem.firstChild.textContent = newTitle;
        }
    });
}