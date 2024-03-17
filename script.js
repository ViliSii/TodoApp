document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const deleteAllBtn = document.getElementById('delete-all');
    const errorMessage = document.getElementById('error-message');


    

    let todos = []; //alustus - tyhjä lista tehtäviä varten

    todoForm.addEventListener('submit', function(event) { //käyttäjä syöttää tehtävän
        event.preventDefault();

        const todoText = todoInput.value.trim();

        if (todoText === '') {
            showError('Please enter a task.');
            highlightError(todoInput);
            return;
        }

        if (todoText.length < 3) {
            showError('Task must be at least 3 characters long.'); //virheilmoitus jos syöttö on vajaa
            highlightError(todoInput);
            return;
        }

        todos.push({ text: todoText, done: false });

        renderTodoList();
        saveTodos();
        todoInput.value = '';
    });

    todoList.addEventListener('click', function(event) { //ohjelma tunnistaa käyttäjän painalluksia listassa poiston ja suorittamisen kohdilla
        if (event.target.tagName === 'BUTTON') {
            const todoIndex = parseInt(event.target.parentElement.dataset.index);
            if (event.target.classList.contains('done-button')) {
                todos[todoIndex].done = !todos[todoIndex].done;
            } else {
                todos.splice(todoIndex, 1);
            }
            renderTodoList();
            saveTodos();
        }
    });
    

    deleteAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            renderTodoList();
            saveTodos();
        }
    });

    function renderTodoList() { // tehtävälistan päivitys ja tieto paljonko tehtäviä on
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('todo-item');
            if (todo.done) {
                listItem.classList.add('done');
            }
            listItem.dataset.index = index;
            listItem.innerHTML = `
                <button class="done-button">${todo.done ? 'Undo' : 'Done'}</button>
                <span>${todo.text}</span>
                <button class="delete-button">Delete</button>
            `;
            todoList.appendChild(listItem);
        });
    }

    function renderTodoList() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('todo-item');
            if (todo.done) {
                listItem.classList.add('done');
            }
            listItem.dataset.index = index;
            listItem.innerHTML = `
                <button class="done-button">${todo.done ? 'Undo' : 'Done'}</button>
                <span>${todo.text}</span>
                <button class="delete-button">Delete</button>
            `;
            todoList.appendChild(listItem);
        });
        
        const todoCountElement = document.createElement('p');
        const todoCount = todos.filter((todo) => todo.done === false).length;
        todoCountElement.textContent = `${todoCount} todos remaining`;
        todoList.appendChild(todoCountElement);
    }
    

    function showError(message) { //virheen tapahtuessa tulee esiin ja poistuu hetken kuluttua
        errorMessage.textContent = message;
        setTimeout(() => errorMessage.textContent = '', 3000);
    }

    function highlightError(element) {
        element.style.animation = 'highlight 10s infinite'; // animaatio
        element.style.border = '3px solid red';
        setTimeout(() => {
            element.style.animation = ''; // animaatio poistuu parin sekunnin jälkeen
            element.style.borderColor = ''; // reunojen väri palautuu
        }, 2000);
    }
    
    

    function saveTodos() { //tallentaa sivulla tehdyt muutokset paikalliseen tallennustilaan (localstorage)
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() { //lataa aiemmat tehtävät jotka on tallennettu. tapahtuu sivun uudelleenlatauksen yhteydessä
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
            renderTodoList();
        }
    }

    loadTodos(); //kutsutaan funktiota
});
