document.addEventListener('DOMContentLoaded', function () {
    // Display current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);

    // Task form submission
    const taskForm = document.getElementById('task-form');
    const tasksContainer = document.getElementById('tasks-container');
    const emptyState = document.getElementById('empty-state');

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('task-title').value;
        const time = document.getElementById('task-time').value;
        const priority = document.getElementById('task-priority').value;

        if (!title) return;

        // Hide empty state if it's the first task
        if (emptyState.style.display !== 'none') {
            emptyState.style.display = 'none';
        }

        // Create task element with animation
        const taskElement = document.createElement('div');
        taskElement.className = `bg-white bg-opacity-90 rounded-lg p-4 shadow-md transform transition-all duration-300 hover:scale-[1.01] task-item ${priority}-priority`;

        // Format time for display
        const formattedTime = time ? new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time set';

        taskElement.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div class="flex items-start space-x-3">
                            <button class="complete-btn mt-1 text-gray-400 hover:text-green-500 transition">
                                <i class="far fa-circle"></i>
                            </button>
                            <div>
                                <h3 class="font-medium text-gray-800">${title}</h3>
                                <div class="flex items-center space-x-2 mt-1 text-sm">
                                    <span class="text-gray-500"><i class="far fa-clock"></i> ${formattedTime}</span>
                                    <span class="px-2 py-0.5 rounded-full text-xs ${getPriorityClass(priority)}">${priority}</span>
                                </div>
                            </div>
                        </div>
                        <button class="delete-btn text-gray-400 hover:text-red-500 transition">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

        // Add animation when adding new task
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateY(20px)';
        tasksContainer.prepend(taskElement);

        // Trigger animation
        setTimeout(() => {
            taskElement.style.opacity = '1';
            taskElement.style.transform = 'translateY(0)';
        }, 10);

        // Add event listeners for the buttons
        taskElement.querySelector('.complete-btn').addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-circle')) {
                icon.classList.remove('fa-circle', 'far');
                icon.classList.add('fa-check-circle', 'fas', 'text-green-500');
                taskElement.classList.add('opacity-70');
                taskElement.querySelector('h3').classList.add('line-through');
            } else {
                icon.classList.remove('fa-check-circle', 'fas', 'text-green-500');
                icon.classList.add('fa-circle', 'far');
                taskElement.classList.remove('opacity-70');
                taskElement.querySelector('h3').classList.remove('line-through');
            }
        });

        taskElement.querySelector('.delete-btn').addEventListener('click', function () {
            // Add animation when deleting
            taskElement.style.transform = 'translateX(-100%)';
            taskElement.style.opacity = '0';

            setTimeout(() => {
                taskElement.remove();

                // Show empty state if no tasks left
                if (tasksContainer.children.length === 0) {
                    emptyState.style.display = 'block';
                }
            }, 300);
        });

        // Reset form
        taskForm.reset();
    });

    // Filter buttons functionality
    document.getElementById('filter-all').addEventListener('click', function () {
        document.querySelectorAll('.task-item').forEach(task => {
            task.style.display = 'block';
        });
        updateActiveFilterButton(this);
    });

    document.getElementById('filter-active').addEventListener('click', function () {
        document.querySelectorAll('.task-item').forEach(task => {
            const isCompleted = task.querySelector('.fa-check-circle');
            task.style.display = isCompleted ? 'none' : 'block';
        });
        updateActiveFilterButton(this);
    });

    document.getElementById('filter-completed').addEventListener('click', function () {
        document.querySelectorAll('.task-item').forEach(task => {
            const isCompleted = task.querySelector('.fa-check-circle');
            task.style.display = isCompleted ? 'block' : 'none';
        });
        updateActiveFilterButton(this);
    });

    function updateActiveFilterButton(activeButton) {
        document.querySelectorAll('#tasks-container ~ div button').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'bg-gray-600', 'bg-green-600');
            btn.classList.add('bg-gray-600');
        });

        if (activeButton.id === 'filter-all') {
            activeButton.classList.remove('bg-gray-600');
            activeButton.classList.add('bg-blue-600');
        } else if (activeButton.id === 'filter-active') {
            activeButton.classList.remove('bg-gray-600');
            activeButton.classList.add('bg-blue-600');
        } else if (activeButton.id === 'filter-completed') {
            activeButton.classList.remove('bg-gray-600');
            activeButton.classList.add('bg-green-600');
        }
    }

    function getPriorityClass(priority) {
        switch (priority) {
            case 'low': return 'bg-blue-100 text-blue-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    // Add some sample tasks for demo
    addSampleTasks();

    function addSampleTasks() {
        const sampleTasks = [
            { title: 'Morning Meeting with Team', time: '09:00', priority: 'high' },
            { title: 'Review Project Proposal', time: '11:30', priority: 'medium' },
            { title: 'Lunch Break', time: '13:00', priority: 'low' },
            { title: 'Client Call - Project Update', time: '14:30', priority: 'high' },
            { title: 'Plan Next Week Tasks', time: '', priority: 'medium' }
        ];

        // Simulate adding sample tasks with delays for animation
        sampleTasks.forEach((task, index) => {
            setTimeout(() => {
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-time').value = task.time;
                document.getElementById('task-priority').value = task.priority;
                taskForm.dispatchEvent(new Event('submit'));
            }, index * 200);
        });
    }
});