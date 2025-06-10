document.addEventListener('DOMContentLoaded', function() {
            // Alapvető változók
            let tasks = [
                {
                    id: 1,
                    title: "Helyszín lefoglalása",
                    description: "Esküvői helyszín kiválasztása és lefoglalása",
                    deadline: "2023-06-15",
                    category: "venue",
                    priority: "high",
                    completed: true,
                    notes: ["Három helyszínt megnéztünk, a Kastély Étterem tűnik a legjobbnak.", "Előleg befizetése megtörtént."]
                },
                {
                    id: 2,
                    title: "Fotós és videós keresése",
                    description: "Profi fotós és videós keresése az esküvőre",
                    deadline: "2023-07-01",
                    category: "other",
                    priority: "medium",
                    completed: false,
                    notes: ["Három ajánlatot kaptunk, még gondolkodunk."]
                },
                {
                    id: 3,
                    title: "Menyasszonyi ruha kiválasztása",
                    description: "Menyasszonyi ruha kiválasztása és megrendelése",
                    deadline: "2023-07-15",
                    category: "attire",
                    priority: "high",
                    completed: false,
                    notes: []
                },
                {
                    id: 4,
                    title: "Meghívók tervezése",
                    description: "Esküvői meghívók tervezése és nyomtatása",
                    deadline: "2023-08-01",
                    category: "other",
                    priority: "medium",
                    completed: false,
                    notes: ["Néhány minta már megérkezett, a hétvégén döntünk."]
                },
                {
                    id: 5,
                    title: "Catering szolgáltatás kiválasztása",
                    description: "Esküvői menü és catering szolgáltatás kiválasztása",
                    deadline: "2023-08-15",
                    category: "catering",
                    priority: "high",
                    completed: false,
                    notes: []
                },
                {
                    id: 6,
                    title: "Dekoráció tervezése",
                    description: "Esküvői dekoráció tervezése és megrendelése",
                    deadline: "2023-09-01",
                    category: "decoration",
                    priority: "low",
                    completed: false,
                    notes: []
                },
                {
                    id: 7,
                    title: "Vőlegény öltöny kiválasztása",
                    description: "Vőlegény öltönyének kiválasztása és megrendelése",
                    deadline: "2023-09-15",
                    category: "attire",
                    priority: "medium",
                    completed: false,
                    notes: []
                }
            ];

            // DOM elemek
            const tasksContainer = document.getElementById('tasks-container');
            const progressBar = document.getElementById('progress-bar');
            const progressPercentage = document.getElementById('progress-percentage');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const sortSelect = document.getElementById('sort-tasks');
            
            // Új teendő modal
            const addTaskBtn = document.getElementById('add-task-btn');
            const addTaskModal = document.getElementById('add-task-modal');
            const closeTaskModal = document.getElementById('close-task-modal');
            const addTaskForm = document.getElementById('add-task-form');
            const cancelAddTask = document.getElementById('cancel-add-task');
            
            // Teendő szerkesztése modal
            const editTaskModal = document.getElementById('edit-task-modal');
            const closeEditTaskModal = document.getElementById('close-edit-task-modal');
            const editTaskForm = document.getElementById('edit-task-form');
            const cancelEditTask = document.getElementById('cancel-edit-task');
            const deleteTaskBtn = document.getElementById('delete-task');
            
            // Megjegyzés hozzáadása modal
            const addNoteModal = document.getElementById('add-note-modal');
            const closeNoteModal = document.getElementById('close-note-modal');
            const addNoteForm = document.getElementById('add-note-form');
            const cancelAddNote = document.getElementById('cancel-add-note');

            // Teendők megjelenítése
            renderTasks();
            updateProgress();

            // Szűrés
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('bg-[#d4a373]', 'text-white'));
                    this.classList.add('bg-[#d4a373]', 'text-white');
                    renderTasks(this.dataset.filter);
                });
            });

            // Rendezés
            sortSelect.addEventListener('change', function() {
                renderTasks(document.querySelector('.filter-btn.bg-\\[\\#d4a373\\]')?.dataset.filter || 'all');
            });

            // Új teendő hozzáadása modal
            addTaskBtn.addEventListener('click', function() {
                addTaskModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Megakadályozza a háttér görgetését
            });

            closeTaskModal.addEventListener('click', function() {
                addTaskModal.style.display = 'none';
                document.body.style.overflow = ''; // Visszaállítja a görgetést
            });

            cancelAddTask.addEventListener('click', function() {
                addTaskModal.style.display = 'none';
                document.body.style.overflow = ''; // Visszaállítja a görgetést
            });

            addTaskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const title = document.getElementById('task-title').value;
                const description = document.getElementById('task-description').value;
                const deadline = document.getElementById('task-deadline').value;
                const category = document.getElementById('task-category').value;
                const priority = document.querySelector('input[name="task-priority"]:checked').value;
                
                const newTask = {
                    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                    title,
                    description,
                    deadline,
                    category,
                    priority,
                    completed: false,
                    notes: []
                };
                
                tasks.push(newTask);
                renderTasks();
                updateProgress();
                addTaskModal.style.display = 'none';
                document.body.style.overflow = ''; // Visszaállítja a görgetést
                addTaskForm.reset();
            });

            // Teendő szerkesztése modal
            closeEditTaskModal.addEventListener('click', function() {
                editTaskModal.style.display = 'none';
                document.body.style.overflow = ''; // Visszaállítja a görgetést
            });

            cancelEditTask.addEventListener('click', function() {
                editTaskModal.style.display = 'none';
                document.body.style.overflow = ''; // Visszaállítja a görgetést
            });

            editTaskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const id = parseInt(document.getElementById('edit-task-id').value);
                const title = document.getElementById('edit-task-title').value;
                const description = document.getElementById('edit-task-description').value;
                const deadline = document.getElementById('edit-task-deadline').value;
                const category = document.getElementById('edit-task-category').value;
                const priority = document.querySelector('input[name="edit-task-priority"]:checked').value;
                const completed = document.getElementById('edit-task-completed').checked;
                
                const taskIndex = tasks.findIndex(task => task.id === id);
                if (taskIndex !== -1) {
                    tasks[taskIndex] = {
                        ...tasks[taskIndex],
                        title,
                        description,
                        deadline,
                        category,
                        priority,
                        completed
                    };
                    
                    renderTasks();
                    updateProgress();
                    editTaskModal.style.display = 'none';
                    document.body.style.overflow = ''; // Visszaállítja a görgetést
                }
            });

            // Teendő törlése
            deleteTaskBtn.addEventListener('click', function() {
                const id = parseInt(document.getElementById('edit-task-id').value);
                const confirmDelete = confirm('Biztosan törölni szeretnéd ezt a teendőt?');
                
                if (confirmDelete) {
                    tasks = tasks.filter(task => task.id !== id);
                    renderTasks();
                    updateProgress();
                    editTaskModal.style.display = 'none';
                    document.body.style.overflow = ''; // Visszaállítja a görgetést
                }
            });

            // Megjegyzés hozzáadása modal
            closeNoteModal.addEventListener('click', function() {
                addNoteModal.style.display = 'none';
                document.body.style.overflow = ''; // Visszaállítja a görgetést
            });

            cancelAddNote.addEventListener('click', function() {
                addNoteModal.style.display = 'none';
                document.body.style.overflow = ''; // Visszaállítja a görgetést
            });

            addNoteForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const taskId = parseInt(document.getElementById('note-task-id').value);
                const note = document.getElementById('task-note').value;
                
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex].notes.push(note);
                    renderTasks();
                    addNoteModal.style.display = 'none';
                    document.body.style.overflow = ''; // Visszaállítja a görgetést
                    document.getElementById('task-note').value = '';
                }
            });

            // Teendők megjelenítése
            function renderTasks(filter = 'all') {
                tasksContainer.innerHTML = '';
                
                let filteredTasks = [...tasks];
                
                // Szűrés
                switch (filter) {
                    case 'active':
                        filteredTasks = filteredTasks.filter(task => !task.completed);
                        break;
                    case 'completed':
                        filteredTasks = filteredTasks.filter(task => task.completed);
                        break;
                    case 'high':
                        filteredTasks = filteredTasks.filter(task => task.priority === 'high');
                        break;
                    case 'medium':
                        filteredTasks = filteredTasks.filter(task => task.priority === 'medium');
                        break;
                    case 'low':
                        filteredTasks = filteredTasks.filter(task => task.priority === 'low');
                        break;
                }
                
                // Rendezés
                const sortBy = sortSelect.value;
                switch (sortBy) {
                    case 'priority':
                        const priorityOrder = { high: 1, medium: 2, low: 3 };
                        filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                        break;
                    case 'date':
                        filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                        break;
                    case 'name':
                        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case 'category':
                        filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
                        break;
                }
                
                if (filteredTasks.length === 0) {
                    tasksContainer.innerHTML = '<div class="text-center py-8 text-gray-500">Nincsenek megjeleníthető teendők</div>';
                    return;
                }
                
                filteredTasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = `task-item p-4 bg-white rounded-lg shadow-sm ${task.completed ? 'task-completed' : ''} priority-${task.priority}`;
                    
                    let priorityBadge, priorityText;
                    switch(task.priority) {
                        case 'high':
                            priorityBadge = 'priority-high-badge';
                            priorityText = 'Magas';
                            break;
                        case 'medium':
                            priorityBadge = 'priority-medium-badge';
                            priorityText = 'Közepes';
                            break;
                        case 'low':
                            priorityBadge = 'priority-low-badge';
                            priorityText = 'Alacsony';
                            break;
                    }
                    
                    let categoryBadge, categoryText;
                    switch(task.category) {
                        case 'venue':
                            categoryBadge = 'category-venue';
                            categoryText = 'Helyszín';
                            break;
                        case 'catering':
                            categoryBadge = 'category-catering';
                            categoryText = 'Vendéglátás';
                            break;
                        case 'decoration':
                            categoryBadge = 'category-decoration';
                            categoryText = 'Dekoráció';
                            break;
                        case 'attire':
                            categoryBadge = 'category-attire';
                            categoryText = 'Ruházat';
                            break;
                        case 'other':
                            categoryBadge = 'category-other';
                            categoryText = 'Egyéb';
                            break;
                    }
                    
                    // Határidő formázása
                    const deadlineDate = task.deadline ? new Date(task.deadline) : null;
                    const formattedDeadline = deadlineDate ? 
                        `${deadlineDate.getFullYear()}. ${String(deadlineDate.getMonth() + 1).padStart(2, '0')}. ${String(deadlineDate.getDate()).padStart(2, '0')}.` : 
                        'Nincs határidő';
                    
                    // Megjegyzések megjelenítése
                    let notesHtml = '';
                    if (task.notes && task.notes.length > 0) {
                        notesHtml = `
                            <div class="mt-3 pt-3 border-t border-gray-200">
                                <div class="text-sm font-medium mb-2">Megjegyzések (${task.notes.length}):</div>
                                <div class="space-y-2">
                                    ${task.notes.map(note => `
                                        <div class="text-sm bg-gray-50 p-2 rounded">
                                            ${note}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }
                    
                    taskElement.innerHTML = `
                        <div class="flex justify-between">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <input type="checkbox" class="task-checkbox mr-3" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                                    <h3 class="text-lg font-medium task-title">${task.title}</h3>
                                </div>
                                <div class="text-sm text-gray-600 mb-2">${task.description}</div>
                                <div class="flex flex-wrap items-center gap-2 text-sm">
                                    <div class="flex items-center">
                                        <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        ${formattedDeadline}
                                    </div>
                                    <span class="priority-badge ${priorityBadge}">${priorityText} prioritás</span>
                                    <span class="category-badge ${categoryBadge}">${categoryText}</span>
                                </div>
                                ${notesHtml}
                            </div>
                            <div class="flex flex-col space-y-2">
                                <button class="edit-task-btn p-2 text-blue-600 hover:bg-blue-50 rounded-full" data-id="${task.id}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                                <button class="add-note-btn p-2 text-green-600 hover:bg-green-50 rounded-full" data-id="${task.id}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Teendő állapot változtatása
                    const checkbox = taskElement.querySelector('.task-checkbox');
                    checkbox.addEventListener('change', function() {
                        const taskId = parseInt(this.dataset.id);
                        const taskIndex = tasks.findIndex(t => t.id === taskId);
                        if (taskIndex !== -1) {
                            tasks[taskIndex].completed = this.checked;
                            renderTasks(document.querySelector('.filter-btn.bg-\\[\\#d4a373\\]')?.dataset.filter || 'all');
                            updateProgress();
                        }
                    });
                    
                    // Teendő szerkesztése
                    const editBtn = taskElement.querySelector('.edit-task-btn');
                    editBtn.addEventListener('click', function() {
                        const taskId = parseInt(this.dataset.id);
                        openEditTaskModal(taskId);
                    });
                    
                    // Megjegyzés hozzáadása
                    const addNoteBtn = taskElement.querySelector('.add-note-btn');
                    addNoteBtn.addEventListener('click', function() {
                        const taskId = parseInt(this.dataset.id);
                        openAddNoteModal(taskId);
                    });
                    
                    tasksContainer.appendChild(taskElement);
                });
            }

            // Haladás frissítése
            function updateProgress() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                
                progressBar.style.width = `${progressPercent}%`;
                progressPercentage.textContent = `${progressPercent}%`;
            }

            // Teendő szerkesztése modal megnyitása
            function openEditTaskModal(taskId) {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    document.getElementById('edit-task-id').value = task.id;
                    document.getElementById('edit-task-title').value = task.title;
                    document.getElementById('edit-task-description').value = task.description;
                    document.getElementById('edit-task-deadline').value = task.deadline;
                    document.getElementById('edit-task-category').value = task.category;
                    document.querySelector(`input[name="edit-task-priority"][value="${task.priority}"]`).checked = true;
                    document.getElementById('edit-task-completed').checked = task.completed;
                    
                    editTaskModal.style.display = 'block';
                    document.body.style.overflow = 'hidden'; // Megakadályozza a háttér görgetését
                }
            }

            // Megjegyzés hozzáadása modal megnyitása
            function openAddNoteModal(taskId) {
                document.getElementById('note-task-id').value = taskId;
                addNoteModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Megakadályozza a háttér görgetését
            }

            // Kattintás a dokumentumon bárhol - modalok elrejtése
            window.addEventListener('click', function(event) {
                if (event.target === addTaskModal) {
                    addTaskModal.style.display = 'none';
                    document.body.style.overflow = ''; // Visszaállítja a görgetést
                }
                if (event.target === editTaskModal) {
                    editTaskModal.style.display = 'none';
                    document.body.style.overflow = ''; // Visszaállítja a görgetést
                }
                if (event.target === addNoteModal) {
                    addNoteModal.style.display = 'none';
                    document.body.style.overflow = ''; // Visszaállítja a görgetést
                }
            });

            // Első szűrőgomb kijelölése alapértelmezettként
            if (filterButtons.length > 0) {
                filterButtons[0].classList.add('bg-[#d4a373]', 'text-white');
            }
        });