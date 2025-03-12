document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('input-box');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    
    // Set default times (current time for start, +1 hour for end)
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
    
    // Format for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateForInput = (date) => {
        return date.toISOString().slice(0, 16);
    };
    
    startTimeInput.value = formatDateForInput(now);
    endTimeInput.value = formatDateForInput(later);
    
    // Check for saved theme preference or use preferred color scheme
    const currentTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Update button icon
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // Load tasks from local storage
    loadTasks();

    // Add task when clicking the add button
    addButton.addEventListener('click', addTask);

    // Add task when pressing Enter in the input field
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Function to format date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    // Function to add a new task
    function addTask() {
        if (inputBox.value === '') {
            alert('You must write something!');
            return;
        }

        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        
        if (!startTime || !endTime) {
            alert('Please select both start and completion times');
            return;
        }
        
        if (new Date(startTime) > new Date(endTime)) {
            alert('Start time cannot be after completion time');
            return;
        }

        // Create list item
        const li = document.createElement('li');
        li.textContent = inputBox.value;
        
        // Add time information
        const timeSpan = document.createElement('div');
        timeSpan.className = 'task-times';
        timeSpan.innerHTML = `Start: ${formatDate(startTime)} <br> End: ${formatDate(endTime)}`;
        li.appendChild(timeSpan);
        
        // Store time data as attributes
        li.setAttribute('data-start-time', startTime);
        li.setAttribute('data-end-time', endTime);
        
        // Create delete button
        const span = document.createElement('span');
        span.innerHTML = '\u00d7'; // × symbol
        span.className = 'delete-btn';
        span.title = 'Delete task';
        
        // Add delete button to list item
        li.appendChild(span);
        
        // Add list item to task list
        taskList.appendChild(li);
        
        // Clear input field
        inputBox.value = '';
        
        // Reset time fields to default (current time + 1 hour)
        const newNow = new Date();
        const newLater = new Date(newNow.getTime() + 60 * 60 * 1000);
        startTimeInput.value = formatDateForInput(newNow);
        endTimeInput.value = formatDateForInput(newLater);
        
        // Save tasks to local storage
        saveTasks();
    }

    // Event delegation for task list (check/uncheck and delete)
    taskList.addEventListener('click', function(e) {
        // If clicked on list item, toggle checked class
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle('checked');
            saveTasks();
        }
        // If clicked on delete button, remove the list item
        else if (e.target.className === 'delete-btn') {
            e.target.parentElement.remove();
            saveTasks();
        }
    });

    // Function to save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', taskList.innerHTML);
    }

    // Function to load tasks from local storage
    function loadTasks() {
        taskList.innerHTML = localStorage.getItem('tasks') || '';
    }
});