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
        
        // Create task text span
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = inputBox.value;
        li.appendChild(taskTextSpan);
        
        // Add time information
        const timeSpan = document.createElement('div');
        timeSpan.className = 'task-times';
        timeSpan.innerHTML = `Start: ${formatDate(startTime)} <br> End: ${formatDate(endTime)}`;
        li.appendChild(timeSpan);
        
        // Store time data as attributes
        li.setAttribute('data-start-time', startTime);
        li.setAttribute('data-end-time', endTime);
        
        // Create edit button
        const editBtn = document.createElement('span');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.className = 'edit-btn';
        editBtn.title = 'Edit task';
        li.appendChild(editBtn);
        
        // Create delete button
        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = '\u00d7'; // × symbol
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete task';
        li.appendChild(deleteBtn);
        
        // Create edit mode container
        const editMode = document.createElement('div');
        editMode.className = 'edit-mode';
        
        // Create edit input
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = inputBox.value;
        editMode.appendChild(editInput);
        
        // Create edit time fields
        const editTimeFields = document.createElement('div');
        editTimeFields.className = 'time-fields';
        
        // Start time field
        const startTimeField = document.createElement('div');
        startTimeField.className = 'time-field';
        const startTimeLabel = document.createElement('label');
        startTimeLabel.textContent = 'Start Time';
        const startTimeEdit = document.createElement('input');
        startTimeEdit.type = 'datetime-local';
        startTimeEdit.className = 'edit-start-time';
        startTimeEdit.value = startTime;
        startTimeField.appendChild(startTimeLabel);
        startTimeField.appendChild(startTimeEdit);
        
        // End time field
        const endTimeField = document.createElement('div');
        endTimeField.className = 'time-field';
        const endTimeLabel = document.createElement('label');
        endTimeLabel.textContent = 'Completion Time';
        const endTimeEdit = document.createElement('input');
        endTimeEdit.type = 'datetime-local';
        endTimeEdit.className = 'edit-end-time';
        endTimeEdit.value = endTime;
        endTimeField.appendChild(endTimeLabel);
        endTimeField.appendChild(endTimeEdit);
        
        // Add time fields to edit mode
        editTimeFields.appendChild(startTimeField);
        editTimeFields.appendChild(endTimeField);
        editMode.appendChild(editTimeFields);
        
        // Create action buttons
        const editActions = document.createElement('div');
        editActions.className = 'edit-actions';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Save';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';
        
        editActions.appendChild(saveBtn);
        editActions.appendChild(cancelBtn);
        editMode.appendChild(editActions);
        
        // Add edit mode to list item
        li.appendChild(editMode);
        
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

    // Event delegation for task list (check/uncheck, edit, and delete)
    taskList.addEventListener('click', function(e) {
        const target = e.target;
        const li = target.closest('li');
        
        if (!li) return;
        
        // If clicked on list item or task text, toggle checked class
        if (target === li || (target.classList.contains('task-text') && !li.classList.contains('editing'))) {
            li.classList.toggle('checked');
            saveTasks();
        }
        // If clicked on edit button, enter edit mode
        else if (target.classList.contains('edit-btn') || target.parentElement.classList.contains('edit-btn')) {
            li.classList.add('editing');
        }
        // If clicked on delete button, remove the list item
        else if (target.classList.contains('delete-btn') || target.parentElement.classList.contains('delete-btn')) {
            li.remove();
            saveTasks();
        }
        // If clicked on save button, save edits
        else if (target.classList.contains('save-btn')) {
            const editInput = li.querySelector('.edit-input');
            const startTimeEdit = li.querySelector('.edit-start-time');
            const endTimeEdit = li.querySelector('.edit-end-time');
            const taskText = li.querySelector('.task-text');
            const taskTimes = li.querySelector('.task-times');
            
            // Validate times
            if (!startTimeEdit.value || !endTimeEdit.value) {
                alert('Please select both start and completion times');
                return;
            }
            
            if (new Date(startTimeEdit.value) > new Date(endTimeEdit.value)) {
                alert('Start time cannot be after completion time');
                return;
            }
            
            // Update task text and times
            taskText.textContent = editInput.value;
            taskTimes.innerHTML = `Start: ${formatDate(startTimeEdit.value)} <br> End: ${formatDate(endTimeEdit.value)}`;
            
            // Update data attributes
            li.setAttribute('data-start-time', startTimeEdit.value);
            li.setAttribute('data-end-time', endTimeEdit.value);
            
            // Exit edit mode
            li.classList.remove('editing');
            
            // Save changes
            saveTasks();
        }
        // If clicked on cancel button, exit edit mode without saving
        else if (target.classList.contains('cancel-btn')) {
            li.classList.remove('editing');
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