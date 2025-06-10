document.addEventListener('DOMContentLoaded', function() {
            // Alapvető változók
            let currentZoom = 1;
            let isDragging = false;
            let draggedElement = null;
            let dragOffsetX = 0;
            let dragOffsetY = 0;
            let tableCounter = 0;
            let currentTableId = null;
            let guests = [
                { id: 1, name: "Nagy Péter", category: "family", notes: "Gluténérzékeny", tableId: null, seatId: null },
                { id: 2, name: "Nagy Katalin", category: "family", notes: "", tableId: null, seatId: null },
                { id: 3, name: "Kovács János", category: "family", notes: "", tableId: null, seatId: null },
                { id: 4, name: "Kovács Éva", category: "family", notes: "Vegetáriánus", tableId: null, seatId: null },
                { id: 5, name: "Tóth Gábor", category: "friends", notes: "", tableId: null, seatId: null },
                { id: 6, name: "Tóth Anna", category: "friends", notes: "", tableId: null, seatId: null },
                { id: 7, name: "Szabó Tamás", category: "friends", notes: "", tableId: null, seatId: null },
                { id: 8, name: "Szabó Eszter", category: "friends", notes: "", tableId: null, seatId: null },
                { id: 9, name: "Varga Zoltán", category: "colleagues", notes: "", tableId: null, seatId: null },
                { id: 10, name: "Varga Júlia", category: "colleagues", notes: "", tableId: null, seatId: null },
                { id: 11, name: "Kiss Ádám", category: "colleagues", notes: "", tableId: null, seatId: null },
                { id: 12, name: "Kiss Borbála", category: "colleagues", notes: "Laktózérzékeny", tableId: null, seatId: null },
                { id: 13, name: "Horváth Dániel", category: "family", notes: "", tableId: null, seatId: null },
                { id: 14, name: "Horváth Zsófia", category: "family", notes: "", tableId: null, seatId: null },
                { id: 15, name: "Fekete Máté", category: "friends", notes: "", tableId: null, seatId: null },
                { id: 16, name: "Fekete Lilla", category: "friends", notes: "", tableId: null, seatId: null }
            ];

            // DOM elemek
            const seatingArea = document.getElementById('seating-area');
            const tablesContainer = document.getElementById('tables-container');
            const guestList = document.getElementById('guest-list');
            const guestSearch = document.getElementById('guest-search');
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            // Vendég modal
            const addGuestBtn = document.getElementById('add-guest-btn');
            const addGuestModal = document.getElementById('add-guest-modal');
            const closeGuestModal = document.getElementById('close-guest-modal');
            const addGuestForm = document.getElementById('add-guest-form');
            const cancelAddGuest = document.getElementById('cancel-add-guest');
            
            // Asztal hozzáadás modal
            const addTableBtn = document.getElementById('add-table-btn');
            const addTableModal = document.getElementById('add-table-modal');
            const closeTableModal = document.getElementById('close-table-modal');
            const addTableForm = document.getElementById('add-table-form');
            const cancelAddTable = document.getElementById('cancel-add-table');
            
            // Asztal szerkesztés modal
            const editTableModal = document.getElementById('edit-table-modal');
            const closeEditTableModal = document.getElementById('close-edit-table-modal');
            const editTableForm = document.getElementById('edit-table-form');
            const cancelEditTable = document.getElementById('cancel-edit-table');
            const deleteTableBtn = document.getElementById('delete-table');
            
            const colorOptions = document.querySelectorAll('.color-option');
            const editColorOptions = document.querySelectorAll('#edit-color-picker .color-option');
            
            // Zoom vezérlők
            const zoomInBtn = document.getElementById('zoom-in');
            const zoomOutBtn = document.getElementById('zoom-out');
            const resetViewBtn = document.getElementById('reset-view');
            
            // Mentés és nyomtatás
            const saveBtn = document.getElementById('save-btn');
            const printBtn = document.getElementById('print-btn');

            // Vendéglista megjelenítése
            renderGuestList();

            // Vendég keresés
            guestSearch.addEventListener('input', function() {
                renderGuestList(this.value);
            });

            // Szűrés kategória szerint
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('bg-[#d4a373]', 'text-white'));
                    this.classList.add('bg-[#d4a373]', 'text-white');
                    renderGuestList(guestSearch.value, this.dataset.filter);
                });
            });

            // Új vendég hozzáadása modal
            addGuestBtn.addEventListener('click', function() {
                addGuestModal.style.display = 'block';
            });

            closeGuestModal.addEventListener('click', function() {
                addGuestModal.style.display = 'none';
            });

            cancelAddGuest.addEventListener('click', function() {
                addGuestModal.style.display = 'none';
            });

            addGuestForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('guest-name').value;
                const category = document.querySelector('input[name="guest-category"]:checked').value;
                const notes = document.getElementById('guest-notes').value;
                
                const newGuest = {
                    id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
                    name,
                    category,
                    notes,
                    tableId: null,
                    seatId: null
                };
                
                guests.push(newGuest);
                renderGuestList();
                addGuestModal.style.display = 'none';
                addGuestForm.reset();
            });

            // Új asztal hozzáadása modal
            addTableBtn.addEventListener('click', function() {
                addTableModal.style.display = 'block';
            });

            closeTableModal.addEventListener('click', function() {
                addTableModal.style.display = 'none';
            });

            cancelAddTable.addEventListener('click', function() {
                addTableModal.style.display = 'none';
            });

            addTableForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const tableName = document.getElementById('table-name').value;
                const seats = parseInt(document.getElementById('table-seats').value);
                const selectedColor = document.querySelector('.color-option.selected').dataset.color;
                
                addTable(tableName, seats, selectedColor);
                
                addTableModal.style.display = 'none';
                addTableForm.reset();
                document.querySelector('.color-option.selected').classList.remove('selected');
                document.querySelector('.color-option').classList.add('selected');
            });

            // Asztal szerkesztése modal
            closeEditTableModal.addEventListener('click', function() {
                editTableModal.style.display = 'none';
            });

            cancelEditTable.addEventListener('click', function() {
                editTableModal.style.display = 'none';
            });

            editTableForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const tableName = document.getElementById('edit-table-name').value;
                const selectedColor = document.querySelector('#edit-color-picker .color-option.selected').dataset.color;
                
                const table = document.getElementById(currentTableId);
                const tableNameElement = table.querySelector('.table-name');
                tableNameElement.textContent = tableName;
                table.style.backgroundColor = selectedColor;
                
                // Frissítsük az asztal vendégek tooltipet
                updateTableGuestsTooltip(currentTableId);
                
                editTableModal.style.display = 'none';
            });

            deleteTableBtn.addEventListener('click', function() {
                if (currentTableId) {
                    deleteTable(currentTableId);
                    editTableModal.style.display = 'none';
                }
            });

            colorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            editColorOptions.forEach(option => {
                option.addEventListener('click', function() {
                    editColorOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });

            // Zoom vezérlők
            zoomInBtn.addEventListener('click', function() {
                if (currentZoom < 2) {
                    currentZoom += 0.1;
                    seatingArea.style.transform = `scale(${currentZoom})`;
                }
            });

            zoomOutBtn.addEventListener('click', function() {
                if (currentZoom > 0.5) {
                    currentZoom -= 0.1;
                    seatingArea.style.transform = `scale(${currentZoom})`;
                }
            });

            resetViewBtn.addEventListener('click', function() {
                currentZoom = 1;
                seatingArea.style.transform = `scale(${currentZoom})`;
            });

            // Mentés és nyomtatás
            saveBtn.addEventListener('click', function() {
                alert('Az ülésrend mentve!');
                // Itt lehetne implementálni a valódi mentést
            });

            printBtn.addEventListener('click', function() {
                window.print();
            });

            // Asztal hozzáadása
            function addTable(tableName, seats, tableColor) {
                tableCounter++;
                const tableId = `table-${tableCounter}`;
                const table = document.createElement('div');
                table.id = tableId;
                table.className = 'table';
                
                // Asztal méretezése a férőhelyek alapján
                let tableWidth, tableHeight;
                
                // Téglalap alakú asztal méretezése a férőhelyek alapján
                if (seats <= 6) {
                    tableWidth = 160;
                    tableHeight = 80;
                } else if (seats <= 8) {
                    tableWidth = 200;
                    tableHeight = 90;
                } else if (seats <= 10) {
                    tableWidth = 240;
                    tableHeight = 100;
                } else {
                    tableWidth = 280;
                    tableHeight = 110;
                }
                
                table.style.width = `${tableWidth}px`;
                table.style.height = `${tableHeight}px`;
                table.style.backgroundColor = tableColor;
                
                // Asztal pozícionálása a tervező közepére
                const container = seatingArea.getBoundingClientRect();
                const left = container.width / 2;
                const top = container.height / 2;
                
                table.style.left = `${left}px`;
                table.style.top = `${top}px`;
                
                // Asztal név
                const tableNameElement = document.createElement('div');
                tableNameElement.className = 'table-name';
                tableNameElement.textContent = tableName;
                table.appendChild(tableNameElement);
                
                // Asztal vezérlők
                const tableControls = document.createElement('div');
                tableControls.className = 'table-controls';
                
                const editBtn = document.createElement('div');
                editBtn.className = 'table-control-btn edit-btn';
                editBtn.innerHTML = '✎';
                editBtn.title = 'Szerkesztés';
                editBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openEditTableModal(tableId);
                });
                
                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'table-control-btn delete-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.title = 'Törlés';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    deleteTable(tableId);
                });
                
                tableControls.appendChild(editBtn);
                tableControls.appendChild(deleteBtn);
                table.appendChild(tableControls);
                
                // Vendégek tooltip
                const guestsTooltip = document.createElement('div');
                guestsTooltip.className = 'table-guests-tooltip';
                guestsTooltip.innerHTML = '<h3 class="font-bold mb-2">Asztalnál ülő vendégek</h3><div class="guests-list"></div>';
                table.appendChild(guestsTooltip);
                
                // Székek hozzáadása
                addSeats(table, seats, tableWidth, tableHeight);
                
                // Asztal mozgatás
                table.addEventListener('mousedown', function(e) {
                    if (e.target === table || e.target === tableNameElement) {
                        isDragging = true;
                        draggedElement = table;
                        const rect = table.getBoundingClientRect();
                        dragOffsetX = e.clientX - rect.left;
                        dragOffsetY = e.clientY - rect.top;
                        table.style.cursor = 'grabbing';
                    }
                });
                
                tablesContainer.appendChild(table);
                
                // Frissítsük az asztal vendégek tooltipet
                updateTableGuestsTooltip(tableId);
            }

            // Asztal törlése
            function deleteTable(tableId) {
                const table = document.getElementById(tableId);
                if (table) {
                    // Felszabadítjuk a vendégeket
                    guests.forEach(guest => {
                        if (guest.tableId === tableId) {
                            guest.tableId = null;
                            guest.seatId = null;
                        }
                    });
                    
                    table.remove();
                    renderGuestList();
                }
            }

            // Asztal szerkesztése modal megnyitása
            function openEditTableModal(tableId) {
                currentTableId = tableId;
                const table = document.getElementById(tableId);
                const tableName = table.querySelector('.table-name').textContent;
                const tableColor = table.style.backgroundColor;
                
                document.getElementById('edit-table-name').value = tableName;
                
                // Aktuális szín kiválasztása
                editColorOptions.forEach(option => {
                    option.classList.remove('selected');
                    if (option.dataset.color === tableColor) {
                        option.classList.add('selected');
                    }
                });
                
                editTableModal.style.display = 'block';
            }

            // Székek hozzáadása az asztalhoz
            function addSeats(table, seatCount, tableWidth, tableHeight) {
                const tableId = table.id;
                
                // Téglalap alakú asztal - székek az asztal körül
                // 1-1 asztalfő a két rövidebb oldalon, a többi a hosszabb oldalakon
                
                // Asztalfők (rövidebb oldalak)
                const headSeat1 = createSeat(tableId, 1, -20, tableHeight / 2);
                const headSeat2 = createSeat(tableId, 2, tableWidth + 20, tableHeight / 2);
                
                table.appendChild(headSeat1);
                table.appendChild(headSeat2);
                
                // Többi szék a hosszabb oldalakon
                const remainingSeats = seatCount - 2;
                const seatsPerSide = Math.ceil(remainingSeats / 2);
                
                // Felső oldal
                for (let i = 0; i < seatsPerSide; i++) {
                    const spacing = tableWidth / (seatsPerSide + 1);
                    const seat = createSeat(tableId, i + 3, (i + 1) * spacing, -20);
                    table.appendChild(seat);
                }
                
                // Alsó oldal
                for (let i = 0; i < remainingSeats - seatsPerSide; i++) {
                    const spacing = tableWidth / ((remainingSeats - seatsPerSide) + 1);
                    const seat = createSeat(tableId, i + 3 + seatsPerSide, (i + 1) * spacing, tableHeight + 20);
                    table.appendChild(seat);
                }
            }

            // Szék létrehozása
            function createSeat(tableId, seatNumber, left, top) {
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.dataset.seatId = `${tableId}-seat-${seatNumber}`;
                seat.textContent = seatNumber;
                seat.style.left = `${left}px`;
                seat.style.top = `${top}px`;
                
                // Szék eseménykezelők
                seat.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    this.classList.add('drop-indicator');
                });
                
                seat.addEventListener('dragleave', function() {
                    this.classList.remove('drop-indicator');
                });
                
                seat.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.classList.remove('drop-indicator');
                    
                    const guestId = e.dataTransfer.getData('text/plain');
                    const guest = guests.find(g => g.id === parseInt(guestId));
                    
                    if (guest) {
                        // Ha már ül valaki ezen a széken, felszabadítjuk
                        const currentOccupant = guests.find(g => g.tableId === tableId && g.seatId === this.dataset.seatId);
                        if (currentOccupant) {
                            currentOccupant.tableId = null;
                            currentOccupant.seatId = null;
                        }
                        
                        // Ha a vendég már ült valahol, felszabadítjuk azt a széket
                        if (guest.tableId && guest.seatId) {
                            const oldSeat = document.querySelector(`[data-seat-id="${guest.seatId}"]`);
                            if (oldSeat) {
                                oldSeat.classList.remove('occupied');
                                oldSeat.removeAttribute('title');
                                const tooltip = oldSeat.querySelector('.seat-tooltip');
                                if (tooltip) tooltip.remove();
                            }
                        }
                        
                        // Vendég hozzárendelése az új székhez
                        guest.tableId = tableId;
                        guest.seatId = this.dataset.seatId;
                        
                        // Szék megjelölése foglaltként
                        this.classList.add('occupied');
                        
                        // Tooltip hozzáadása
                        const tooltip = document.createElement('div');
                        tooltip.className = 'seat-tooltip';
                        tooltip.textContent = guest.name;
                        this.appendChild(tooltip);
                        this.setAttribute('title', guest.name);
                        
                        renderGuestList();
                        
                        // Frissítsük az asztal vendégek tooltipet
                        updateTableGuestsTooltip(tableId);
                    }
                });
                
                return seat;
            }

            // Asztal vendégek tooltip frissítése
            function updateTableGuestsTooltip(tableId) {
                const table = document.getElementById(tableId);
                if (!table) return;
                
                const tooltip = table.querySelector('.table-guests-tooltip');
                const guestsList = tooltip.querySelector('.guests-list');
                
                // Asztalnál ülő vendégek lekérése
                const tableGuests = guests.filter(guest => guest.tableId === tableId);
                
                if (tableGuests.length === 0) {
                    guestsList.innerHTML = '<p class="text-gray-500">Nincs vendég az asztalnál</p>';
                } else {
                    guestsList.innerHTML = '';
                    
                    // Rendezzük a vendégeket szék sorszám szerint
                    tableGuests.sort((a, b) => {
                        const seatA = parseInt(a.seatId.split('-').pop());
                        const seatB = parseInt(b.seatId.split('-').pop());
                        return seatA - seatB;
                    });
                    
                    tableGuests.forEach(guest => {
                        const seatNumber = guest.seatId.split('-').pop();
                        const guestItem = document.createElement('div');
                        guestItem.className = 'guest-tooltip-item';
                        guestItem.innerHTML = `
                            <span>${guest.name}</span>
                            <span class="text-gray-500">${seatNumber}. szék</span>
                        `;
                        guestsList.appendChild(guestItem);
                    });
                }
            }

            // Vendéglista megjelenítése
            function renderGuestList(searchTerm = '', filter = 'all') {
                guestList.innerHTML = '';
                
                let filteredGuests = guests;
                
                // Keresés
                if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    filteredGuests = filteredGuests.filter(guest => 
                        guest.name.toLowerCase().includes(term)
                    );
                }
                
                // Szűrés kategória szerint
                if (filter !== 'all') {
                    if (filter === 'unassigned') {
                        filteredGuests = filteredGuests.filter(guest => !guest.tableId);
                    } else {
                        filteredGuests = filteredGuests.filter(guest => guest.category === filter);
                    }
                }
                
                // Rendezés: először a nem ültetettek, aztán név szerint
                filteredGuests.sort((a, b) => {
                    if (a.tableId === null && b.tableId !== null) return -1;
                    if (a.tableId !== null && b.tableId === null) return 1;
                    return a.name.localeCompare(b.name);
                });
                
                filteredGuests.forEach(guest => {
                    const guestItem = document.createElement('div');
                    guestItem.className = `guest-item p-3 bg-white rounded-lg shadow-sm ${guest.tableId ? 'border-l-4 border-[#d4a373]' : ''}`;
                    guestItem.draggable = true;
                    guestItem.dataset.id = guest.id;
                    
                    let categoryClass, categoryText;
                    switch(guest.category) {
                        case 'family':
                            categoryClass = 'category-family';
                            categoryText = 'Család';
                            break;
                        case 'friends':
                            categoryClass = 'category-friends';
                            categoryText = 'Barátok';
                            break;
                        case 'colleagues':
                            categoryClass = 'category-colleagues';
                            categoryText = 'Munkatársak';
                            break;
                    }
                    
                    let tableInfo = '';
                    if (guest.tableId) {
                        const table = document.getElementById(guest.tableId);
                        if (table) {
                            const tableName = table.querySelector('.table-name').textContent;
                            const seatNumber = guest.seatId.split('-').pop();
                            tableInfo = `<div class="text-sm text-gray-500 mt-1">${tableName}, ${seatNumber}. szék</div>`;
                        }
                    }
                    
                    guestItem.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="font-medium">${guest.name}</div>
                                ${tableInfo}
                                ${guest.notes ? `<div class="text-xs text-gray-500 mt-1">Megjegyzés: ${guest.notes}</div>` : ''}
                            </div>
                            <span class="category-tag ${categoryClass}">${categoryText}</span>
                        </div>
                    `;
                    
                    // Drag & Drop eseménykezelők
                    guestItem.addEventListener('dragstart', function(e) {
                        e.dataTransfer.setData('text/plain', guest.id);
                        this.classList.add('dragging');
                    });
                    
                    guestItem.addEventListener('dragend', function() {
                        this.classList.remove('dragging');
                    });
                    
                    guestList.appendChild(guestItem);
                });
            }

            // Asztal mozgatás eseménykezelők
            document.addEventListener('mousemove', function(e) {
                if (isDragging && draggedElement) {
                    const container = seatingArea.getBoundingClientRect();
                    const tableRect = draggedElement.getBoundingClientRect();
                    
                    // Korlátozzuk a mozgatást a seatingArea határain belül
                    let x = e.clientX - container.left - dragOffsetX;
                    let y = e.clientY - container.top - dragOffsetY;
                    
                    // Határok ellenőrzése
                    const minX = tableRect.width / 2;
                    const minY = tableRect.height / 2;
                    const maxX = container.width - tableRect.width / 2;
                    const maxY = container.height - tableRect.height / 2;
                    
                    x = Math.max(minX, Math.min(x, maxX));
                    y = Math.max(minY, Math.min(y, maxY));
                    
                    draggedElement.style.left = `${x}px`;
                    draggedElement.style.top = `${y}px`;
                }
            });

            document.addEventListener('mouseup', function() {
                if (isDragging && draggedElement) {
                    draggedElement.style.cursor = 'grab';
                    isDragging = false;
                    draggedElement = null;
                }
            });
        });

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'94d3907ad287d975',t:'MTc0OTUwMjg4OC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();