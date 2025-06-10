document.addEventListener('DOMContentLoaded', function() {
            // Alapvető változók
            let totalBudget = 2500000; // Alapértelmezett költségvetés: 2.5 millió Ft
            let expenses = [
                {
                    id: 1,
                    name: "Kastély Étterem foglalás",
                    amount: 800000,
                    category: "venue",
                    date: "2023-06-15",
                    notes: "Előleg befizetése megtörtént, a teljes összeg 1.5 millió Ft.",
                    paid: true,
                    source: "own"
                },
                {
                    id: 2,
                    name: "Menyasszonyi ruha előleg",
                    amount: 150000,
                    category: "attire",
                    date: "2023-07-01",
                    notes: "A teljes összeg 350.000 Ft, a fennmaradó részt a próba után kell fizetni.",
                    paid: true,
                    source: "own"
                },
                {
                    id: 3,
                    name: "Fotós és videós",
                    amount: 300000,
                    category: "photography",
                    date: "2023-07-15",
                    notes: "Teljes napos csomag, drónfelvétellel.",
                    paid: false,
                    source: "own"
                },
                {
                    id: 4,
                    name: "Virágdekoráció",
                    amount: 120000,
                    category: "decoration",
                    date: "2023-08-01",
                    notes: "Asztaldíszek, menyasszonyi csokor, vőlegény kitűző.",
                    paid: false,
                    source: "parents"
                }
            ];
            let categoryPercentages = {
                venue: 40,
                catering: 25,
                decoration: 10,
                attire: 15,
                other: 10
            };
            let budgetChart;

            // DOM elemek
            const expensesContainer = document.getElementById('expenses-container');
            const budgetProgressPaid = document.getElementById('budget-progress-paid');
            const budgetProgressUnpaid = document.getElementById('budget-progress-unpaid');
            const budgetPercentage = document.getElementById('budget-percentage');
            const totalBudgetElement = document.getElementById('total-budget');
            const spentAmountElement = document.getElementById('spent-amount');
            const remainingAmountElement = document.getElementById('remaining-amount');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const sortSelect = document.getElementById('sort-expenses');
            
            // Kategória összegek
            const venueAmountElement = document.getElementById('venue-amount');
            const cateringAmountElement = document.getElementById('catering-amount');
            const decorationAmountElement = document.getElementById('decoration-amount');
            const attireAmountElement = document.getElementById('attire-amount');
            
            // Beállítások modal
            const settingsBtn = document.getElementById('settings-btn');
            const settingsModal = document.getElementById('settings-modal');
            const closeSettingsModal = document.getElementById('close-settings-modal');
            const settingsForm = document.getElementById('settings-form');
            const cancelSettings = document.getElementById('cancel-settings');
            const totalBudgetInput = document.getElementById('total-budget-input');
            const percentWarning = document.getElementById('percent-warning');
            
            // Új kiadás modal
            const addExpenseBtn = document.getElementById('add-expense-btn');
            const addExpenseModal = document.getElementById('add-expense-modal');
            const closeExpenseModal = document.getElementById('close-expense-modal');
            const addExpenseForm = document.getElementById('add-expense-form');
            const cancelAddExpense = document.getElementById('cancel-add-expense');
            
            // Kiadás szerkesztése modal
            const editExpenseModal = document.getElementById('edit-expense-modal');
            const closeEditExpenseModal = document.getElementById('close-edit-expense-modal');
            const editExpenseForm = document.getElementById('edit-expense-form');
            const cancelEditExpense = document.getElementById('cancel-edit-expense');
            const deleteExpenseBtn = document.getElementById('delete-expense');

            // Kiadások megjelenítése és összesítés
            renderExpenses();
            updateBudgetSummary();
            initChart();

            // Szűrés
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('bg-[#d4a373]', 'text-white'));
                    this.classList.add('bg-[#d4a373]', 'text-white');
                    renderExpenses(this.dataset.filter);
                });
            });

            // Rendezés
            sortSelect.addEventListener('change', function() {
                renderExpenses(document.querySelector('.filter-btn.bg-\\[\\#d4a373\\]')?.dataset.filter || 'all');
            });

            // Beállítások modal
            settingsBtn.addEventListener('click', function() {
                totalBudgetInput.value = totalBudget;
                document.getElementById('venue-percent').value = categoryPercentages.venue;
                document.getElementById('catering-percent').value = categoryPercentages.catering;
                document.getElementById('decoration-percent').value = categoryPercentages.decoration;
                document.getElementById('attire-percent').value = categoryPercentages.attire;
                document.getElementById('other-percent').value = categoryPercentages.other;
                
                settingsModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });

            closeSettingsModal.addEventListener('click', function() {
                settingsModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            cancelSettings.addEventListener('click', function() {
                settingsModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            // Százalékok ellenőrzése
            function checkPercentages() {
                const venuePercent = parseInt(document.getElementById('venue-percent').value) || 0;
                const cateringPercent = parseInt(document.getElementById('catering-percent').value) || 0;
                const decorationPercent = parseInt(document.getElementById('decoration-percent').value) || 0;
                const attirePercent = parseInt(document.getElementById('attire-percent').value) || 0;
                const otherPercent = parseInt(document.getElementById('other-percent').value) || 0;
                
                const total = venuePercent + cateringPercent + decorationPercent + attirePercent + otherPercent;
                
                if (total !== 100) {
                    percentWarning.classList.remove('hidden');
                    return false;
                } else {
                    percentWarning.classList.add('hidden');
                    return true;
                }
            }

            // Százalék inputok változásának figyelése
            document.getElementById('venue-percent').addEventListener('input', checkPercentages);
            document.getElementById('catering-percent').addEventListener('input', checkPercentages);
            document.getElementById('decoration-percent').addEventListener('input', checkPercentages);
            document.getElementById('attire-percent').addEventListener('input', checkPercentages);
            document.getElementById('other-percent').addEventListener('input', checkPercentages);

            settingsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!checkPercentages()) {
                    return;
                }
                
                totalBudget = parseInt(totalBudgetInput.value);
                
                categoryPercentages = {
                    venue: parseInt(document.getElementById('venue-percent').value),
                    catering: parseInt(document.getElementById('catering-percent').value),
                    decoration: parseInt(document.getElementById('decoration-percent').value),
                    attire: parseInt(document.getElementById('attire-percent').value),
                    other: parseInt(document.getElementById('other-percent').value)
                };
                
                updateBudgetSummary();
                updateChart();
                
                settingsModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            // Új kiadás modal
            addExpenseBtn.addEventListener('click', function() {
                // Dátum alapértelmezett értéke a mai nap
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('expense-date').value = today;
                
                addExpenseModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });

            closeExpenseModal.addEventListener('click', function() {
                addExpenseModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            cancelAddExpense.addEventListener('click', function() {
                addExpenseModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            addExpenseForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('expense-name').value;
                const amount = parseInt(document.getElementById('expense-amount').value);
                const category = document.getElementById('expense-category').value;
                const source = document.getElementById('expense-source').value;
                const date = document.getElementById('expense-date').value;
                const notes = document.getElementById('expense-notes').value;
                const paid = document.getElementById('expense-paid').checked;
                
                const newExpense = {
                    id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
                    name,
                    amount,
                    category,
                    source,
                    date,
                    notes,
                    paid
                };
                
                expenses.push(newExpense);
                renderExpenses();
                updateBudgetSummary();
                updateChart();
                
                addExpenseModal.style.display = 'none';
                document.body.style.overflow = '';
                addExpenseForm.reset();
            });

            // Kiadás szerkesztése modal
            closeEditExpenseModal.addEventListener('click', function() {
                editExpenseModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            cancelEditExpense.addEventListener('click', function() {
                editExpenseModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            editExpenseForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const id = parseInt(document.getElementById('edit-expense-id').value);
                const name = document.getElementById('edit-expense-name').value;
                const amount = parseInt(document.getElementById('edit-expense-amount').value);
                const category = document.getElementById('edit-expense-category').value;
                const source = document.getElementById('edit-expense-source').value;
                const date = document.getElementById('edit-expense-date').value;
                const notes = document.getElementById('edit-expense-notes').value;
                const paid = document.getElementById('edit-expense-paid').checked;
                
                const expenseIndex = expenses.findIndex(expense => expense.id === id);
                if (expenseIndex !== -1) {
                    expenses[expenseIndex] = {
                        ...expenses[expenseIndex],
                        name,
                        amount,
                        category,
                        source,
                        date,
                        notes,
                        paid
                    };
                    
                    renderExpenses();
                    updateBudgetSummary();
                    updateChart();
                    
                    editExpenseModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });

            // Kiadás törlése
            deleteExpenseBtn.addEventListener('click', function() {
                const id = parseInt(document.getElementById('edit-expense-id').value);
                const confirmDelete = confirm('Biztosan törölni szeretnéd ezt a kiadást?');
                
                if (confirmDelete) {
                    expenses = expenses.filter(expense => expense.id !== id);
                    renderExpenses();
                    updateBudgetSummary();
                    updateChart();
                    
                    editExpenseModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });

            // Kiadások megjelenítése
            function renderExpenses(filter = 'all') {
                expensesContainer.innerHTML = '';
                
                let filteredExpenses = [...expenses];
                
                // Szűrés
                if (filter !== 'all') {
                    filteredExpenses = filteredExpenses.filter(expense => expense.category === filter);
                }
                
                // Rendezés
                const sortBy = sortSelect.value;
                switch (sortBy) {
                    case 'date-desc':
                        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                        break;
                    case 'date-asc':
                        filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
                        break;
                    case 'amount-desc':
                        filteredExpenses.sort((a, b) => b.amount - a.amount);
                        break;
                    case 'amount-asc':
                        filteredExpenses.sort((a, b) => a.amount - b.amount);
                        break;
                    case 'name':
                        filteredExpenses.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    case 'category':
                        filteredExpenses.sort((a, b) => a.category.localeCompare(b.category));
                        break;
                }
                
                if (filteredExpenses.length === 0) {
                    expensesContainer.innerHTML = '<div class="text-center py-8 text-gray-500">Nincsenek megjeleníthető kiadások</div>';
                    return;
                }
                
                filteredExpenses.forEach(expense => {
                    const expenseElement = document.createElement('div');
                    expenseElement.className = `expense-item p-4 bg-white rounded-lg shadow-sm border-l-4 border-l-${getCategoryColor(expense.category)}`;
                    
                    // Dátum formázása
                    const expenseDate = expense.date ? new Date(expense.date) : null;
                    const formattedDate = expenseDate ? 
                        `${expenseDate.getFullYear()}. ${String(expenseDate.getMonth() + 1).padStart(2, '0')}. ${String(expenseDate.getDate()).padStart(2, '0')}.` : 
                        'Nincs dátum';
                    
                    // Kategória badge
                    const categoryBadge = `category-${expense.category}`;
                    const categoryText = getCategoryText(expense.category);
                    
                    // Finanszírozási forrás badge
                    const sourceBadge = `source-${expense.source || 'own'}`;
                    const sourceText = getSourceText(expense.source || 'own');
                    
                    expenseElement.innerHTML = `
                        <div class="flex justify-between">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <h3 class="text-lg font-medium">${expense.name}</h3>
                                    ${expense.paid ? 
                                        '<span class="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">Kifizetve</span>' : 
                                        '<span class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Fizetésre vár</span>'
                                    }
                                </div>
                                <div class="flex flex-wrap items-center gap-2 text-sm mb-2">
                                    <div class="flex items-center">
                                        <svg class="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        ${formattedDate}
                                    </div>
                                    <span class="category-badge ${categoryBadge}">${categoryText}</span>
                                    <span class="source-badge ${sourceBadge}">${sourceText}</span>
                                </div>
                                ${expense.notes ? `<div class="text-sm text-gray-600">${expense.notes}</div>` : ''}
                            </div>
                            <div class="flex flex-col items-end">
                                <div class="text-lg font-bold mb-2">${formatCurrency(expense.amount)}</div>
                                <button class="edit-expense-btn p-2 text-blue-600 hover:bg-blue-50 rounded-full" data-id="${expense.id}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Kiadás szerkesztése
                    const editBtn = expenseElement.querySelector('.edit-expense-btn');
                    editBtn.addEventListener('click', function() {
                        const expenseId = parseInt(this.dataset.id);
                        openEditExpenseModal(expenseId);
                    });
                    
                    expensesContainer.appendChild(expenseElement);
                });
            }

            // Költségvetés összesítés frissítése
            function updateBudgetSummary() {
                // Csak a saját költségvetésből fizetett tételeket számoljuk
                const ownExpenses = expenses.filter(expense => expense.source === 'own' || !expense.source);
                const spentAmount = ownExpenses.reduce((total, expense) => total + expense.amount, 0);
                const paidAmount = ownExpenses.filter(expense => expense.paid).reduce((total, expense) => total + expense.amount, 0);
                const unpaidAmount = ownExpenses.filter(expense => !expense.paid).reduce((total, expense) => total + expense.amount, 0);
                
                const remainingAmount = totalBudget - spentAmount;
                const percentSpent = totalBudget > 0 ? Math.round((spentAmount / totalBudget) * 100) : 0;
                const percentPaid = totalBudget > 0 ? Math.round((paidAmount / totalBudget) * 100) : 0;
                const percentUnpaid = totalBudget > 0 ? Math.round((unpaidAmount / totalBudget) * 100) : 0;
                
                // Kategória összegek számítása (csak saját költségvetésből)
                const categoryAmounts = {
                    venue: 0,
                    catering: 0,
                    decoration: 0,
                    attire: 0,
                    entertainment: 0,
                    photography: 0,
                    other: 0
                };
                
                ownExpenses.forEach(expense => {
                    if (categoryAmounts.hasOwnProperty(expense.category)) {
                        categoryAmounts[expense.category] += expense.amount;
                    } else {
                        categoryAmounts.other += expense.amount;
                    }
                });
                
                // Összegek megjelenítése
                totalBudgetElement.textContent = formatCurrency(totalBudget);
                spentAmountElement.textContent = formatCurrency(spentAmount);
                remainingAmountElement.textContent = formatCurrency(remainingAmount);
                
                // Kategória összegek megjelenítése
                venueAmountElement.textContent = formatCurrency(categoryAmounts.venue);
                cateringAmountElement.textContent = formatCurrency(categoryAmounts.catering);
                decorationAmountElement.textContent = formatCurrency(categoryAmounts.decoration);
                attireAmountElement.textContent = formatCurrency(categoryAmounts.attire);
                
                // Haladás sáv frissítése - külön a kifizetett és fizetésre váró tételek
                budgetProgressPaid.style.width = `${percentPaid}%`;
                budgetProgressUnpaid.style.width = `${percentUnpaid}%`;
                budgetPercentage.textContent = `${percentSpent}%`;
                
                // Haladás sáv színének beállítása a költés alapján
                if (percentSpent > 90) {
                    budgetPercentage.classList.add('text-red-500');
                } else if (percentSpent > 75) {
                    budgetPercentage.classList.add('text-yellow-500');
                } else {
                    budgetPercentage.classList.remove('text-red-500', 'text-yellow-500');
                }
            }

            // Diagram inicializálása
            function initChart() {
                const ctx = document.getElementById('budget-chart').getContext('2d');
                
                budgetChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: [],
                        datasets: [{
                            data: [],
                            backgroundColor: [],
                            borderWidth: 1,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    boxWidth: 12,
                                    padding: 15
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        const percentage = ((value / totalBudget) * 100).toFixed(1);
                                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
                
                updateChart();
            }

            // Diagram frissítése
            function updateChart() {
                // Csak a saját költségvetésből fizetett tételeket számoljuk
                const ownExpenses = expenses.filter(expense => expense.source === 'own' || !expense.source);
                
                // Kategóriák és fizetési státusz szerint csoportosítás
                const chartData = {
                    labels: [],
                    data: [],
                    backgroundColor: []
                };
                
                // Kifizetett tételek kategóriánként
                const paidByCategory = {
                    venue: 0,
                    catering: 0,
                    decoration: 0,
                    attire: 0,
                    entertainment: 0,
                    photography: 0,
                    other: 0
                };
                
                // Fizetésre váró tételek kategóriánként
                const unpaidByCategory = {
                    venue: 0,
                    catering: 0,
                    decoration: 0,
                    attire: 0,
                    entertainment: 0,
                    photography: 0,
                    other: 0
                };
                
                // Adatok összegyűjtése
                ownExpenses.forEach(expense => {
                    const category = expense.category;
                    if (expense.paid) {
                        if (paidByCategory.hasOwnProperty(category)) {
                            paidByCategory[category] += expense.amount;
                        } else {
                            paidByCategory.other += expense.amount;
                        }
                    } else {
                        if (unpaidByCategory.hasOwnProperty(category)) {
                            unpaidByCategory[category] += expense.amount;
                        } else {
                            unpaidByCategory.other += expense.amount;
                        }
                    }
                });
                
                // Kifizetett tételek hozzáadása a diagramhoz
                for (const [category, amount] of Object.entries(paidByCategory)) {
                    if (amount > 0) {
                        chartData.labels.push(`${getCategoryText(category)} (kifizetve)`);
                        chartData.data.push(amount);
                        chartData.backgroundColor.push(getPaidCategoryColor(category));
                    }
                }
                
                // Fizetésre váró tételek hozzáadása a diagramhoz
                for (const [category, amount] of Object.entries(unpaidByCategory)) {
                    if (amount > 0) {
                        chartData.labels.push(`${getCategoryText(category)} (fizetésre vár)`);
                        chartData.data.push(amount);
                        chartData.backgroundColor.push(getUnpaidCategoryColor(category));
                    }
                }
                
                // Fennmaradó összeg hozzáadása
                const spentAmount = ownExpenses.reduce((total, expense) => total + expense.amount, 0);
                const remainingAmount = totalBudget - spentAmount;
                
                if (remainingAmount > 0) {
                    chartData.labels.push('Fennmaradó');
                    chartData.data.push(remainingAmount);
                    chartData.backgroundColor.push('#e9ecef');
                }
                
                // Diagram frissítése
                budgetChart.data.labels = chartData.labels;
                budgetChart.data.datasets[0].data = chartData.data;
                budgetChart.data.datasets[0].backgroundColor = chartData.backgroundColor;
                
                budgetChart.update();
            }

            // Kiadás szerkesztése modal megnyitása
            function openEditExpenseModal(expenseId) {
                const expense = expenses.find(e => e.id === expenseId);
                if (expense) {
                    document.getElementById('edit-expense-id').value = expense.id;
                    document.getElementById('edit-expense-name').value = expense.name;
                    document.getElementById('edit-expense-amount').value = expense.amount;
                    document.getElementById('edit-expense-category').value = expense.category;
                    document.getElementById('edit-expense-source').value = expense.source || 'own';
                    document.getElementById('edit-expense-date').value = expense.date;
                    document.getElementById('edit-expense-notes').value = expense.notes;
                    document.getElementById('edit-expense-paid').checked = expense.paid;
                    
                    editExpenseModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            }

            // Segédfüggvények
            function formatCurrency(amount) {
                return new Intl.NumberFormat('hu-HU', { style: 'decimal' }).format(amount) + ' Ft';
            }

            function getCategoryText(category) {
                switch(category) {
                    case 'venue': return 'Helyszín';
                    case 'catering': return 'Vendéglátás';
                    case 'decoration': return 'Dekoráció';
                    case 'attire': return 'Ruházat';
                    case 'entertainment': return 'Szórakoztatás';
                    case 'photography': return 'Fotó/Videó';
                    case 'other': return 'Egyéb';
                    default: return 'Egyéb';
                }
            }

            function getSourceText(source) {
                switch(source) {
                    case 'own': return 'Saját költségvetés';
                    case 'parents': return 'Szülői támogatás';
                    default: return 'Saját költségvetés';
                }
            }

            function getCategoryColor(category) {
                switch(category) {
                    case 'venue': return 'green-600';
                    case 'catering': return 'orange-600';
                    case 'decoration': return 'blue-600';
                    case 'attire': return 'purple-600';
                    case 'entertainment': return 'red-600';
                    case 'photography': return 'green-700';
                    case 'other': return 'gray-600';
                    default: return 'gray-600';
                }
            }

            function getPaidCategoryColor(category) {
                switch(category) {
                    case 'venue': return '#2d6a4f';
                    case 'catering': return '#9d4e2f';
                    case 'decoration': return '#4361ee';
                    case 'attire': return '#9d4edd';
                    case 'entertainment': return '#9d0208';
                    case 'photography': return '#386641';
                    case 'other': return '#495057';
                    default: return '#495057';
                }
            }

            function getUnpaidCategoryColor(category) {
                switch(category) {
                    case 'venue': return '#81c29e';
                    case 'catering': return '#e9a178';
                    case 'decoration': return '#90a5f9';
                    case 'attire': return '#d8a8f3';
                    case 'entertainment': return '#ff8b8b';
                    case 'photography': return '#8ece99';
                    case 'other': return '#adb5bd';
                    default: return '#adb5bd';
                }
            }

            // Kattintás a dokumentumon bárhol - modalok elrejtése
            window.addEventListener('click', function(event) {
                if (event.target === settingsModal) {
                    settingsModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
                if (event.target === addExpenseModal) {
                    addExpenseModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
                if (event.target === editExpenseModal) {
                    editExpenseModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });

            // Első szűrőgomb kijelölése alapértelmezettként
            if (filterButtons.length > 0) {
                filterButtons[0].classList.add('bg-[#d4a373]', 'text-white');
            }
        });