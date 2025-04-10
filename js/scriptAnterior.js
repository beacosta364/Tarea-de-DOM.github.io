document.getElementById('add-todo').addEventListener('click', addTodo);

function addTodo() {
    const todoTitle = document.getElementById('todo-title').value;
    if (todoTitle === '') return;

    const todoList = document.getElementById('todo-list');
    const todoItem = document.createElement('li');
    todoItem.textContent = todoTitle;

    const editButton = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.src = 'Img/1.png'; // img
    editButton.appendChild(editIcon);
    editButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        const newTitle = prompt('Editar tarea:', todoItem.firstChild.textContent);
        if (newTitle !== null) {
            todoItem.firstChild.textContent = newTitle;
        }
    });

    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'Img/2.png'; // Img
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); 
        todoList.removeChild(todoItem);
    });

    todoItem.appendChild(editButton);
    todoItem.appendChild(deleteButton);
    todoItem.addEventListener('click', () => {
        todoItem.classList.toggle('completed');
    });

    todoList.appendChild(todoItem);
    document.getElementById('todo-title').value = '';
}
