document.addEventListener('DOMContentLoaded', function() {
// Mobil menü működése
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Profilkép feltöltés előnézet
        function previewImage(event) {
            const reader = new FileReader();
            reader.onload = function() {
                const output = document.getElementById('profile-preview');
                output.src = reader.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        
        // Szekciók összecsukása/kinyitása
        function toggleSection(contentId, chevronId) {
            const content = document.getElementById(contentId);
            const chevron = document.getElementById(chevronId);
            
            content.classList.toggle('open');
            chevron.classList.toggle('open');
        }
        
        document.getElementById('toggle-calendar').addEventListener('click', () => {
            toggleSection('calendar-content', 'calendar-chevron');
        });
        
        document.getElementById('toggle-wedding-form').addEventListener('click', () => {
            toggleSection('wedding-form-content', 'wedding-form-chevron');
        });
        
        document.getElementById('toggle-services').addEventListener('click', () => {
            toggleSection('services-content', 'services-chevron');
        });
        
        // Naptár működése
        let currentDate = new Date();
        let selectedDate = null;
        
        function updateCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // Hónap nevének beállítása
            const monthNames = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
            document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
            
            // Naptár napjainak generálása
            const calendarDays = document.getElementById('calendar-days');
            calendarDays.innerHTML = '';
            
            // Az adott hónap első napja
            const firstDay = new Date(year, month, 1);
            // Az adott hónap utolsó napja
            const lastDay = new Date(year, month + 1, 0);
            
            // Hét első napja (hétfő = 1, vasárnap = 0)
            let firstDayOfWeek = firstDay.getDay() || 7; // Ha 0 (vasárnap), akkor 7
            firstDayOfWeek--; // 0-tól indexelünk (hétfő = 0, vasárnap = 6)
            
            // Üres cellák hozzáadása a hónap első napja előtt
            for (let i = 0; i < firstDayOfWeek; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day empty';
                calendarDays.appendChild(emptyDay);
            }
            
            // Napok hozzáadása
            const today = new Date();
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const day = document.createElement('div');
                day.className = 'calendar-day hover:bg-gray-100';
                day.textContent = i;
                
                // Mai nap jelölése
                if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                    day.classList.add('today');
                }
                
                // Kiválasztott nap jelölése
                if (selectedDate && year === selectedDate.getFullYear() && month === selectedDate.getMonth() && i === selectedDate.getDate()) {
                    day.classList.add('selected');
                }
                
                // Nap kiválasztása kattintásra
                day.addEventListener('click', () => {
                    // Előző kiválasztás törlése
                    const prevSelected = document.querySelector('.calendar-day.selected');
                    if (prevSelected) {
                        prevSelected.classList.remove('selected');
                    }
                    
                    // Új kiválasztás
                    day.classList.add('selected');
                    selectedDate = new Date(year, month, i);
                    
                    // Dátum formázása és megjelenítése
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    document.getElementById('selected-date-display').textContent = selectedDate.toLocaleDateString('hu-HU', options);
                });
                
                calendarDays.appendChild(day);
            }
        }
        
        // Előző hónap
        document.getElementById('prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
        
        // Következő hónap
        document.getElementById('next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
        
        // Dátum mentése gomb
        document.getElementById('save-date').addEventListener('click', () => {
            if (selectedDate) {
                alert('A dátum sikeresen mentve!');
                // Naptár szekció összecsukása
                toggleSection('calendar-content', 'calendar-chevron');
            } else {
                alert('Kérjük, válassz egy dátumot a naptárból!');
            }
        });
        
        // Esküvői adatok űrlap kezelése
        document.getElementById('wedding-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Adatok kinyerése
            const venue = document.getElementById('venue').value;
            const guests = document.getElementById('guests').value;
            
            // Adatok megjelenítése a profil részben
            if (venue) {
                document.getElementById('venue-display').textContent = venue;
            }
            
            if (guests) {
                document.getElementById('guests-display').textContent = guests + ' fő';
            }
            
            // Űrlap szekció összecsukása
            toggleSection('wedding-form-content', 'wedding-form-chevron');
            
            alert('Az adatok sikeresen mentve!');
        });
        
        // Naptár inicializálása
        updateCalendar();
        
        // Profil almenü működése
        const profileTabs = document.querySelectorAll('.profile-tab');
        const sections = {
            'profile': document.getElementById('profile-section'),
            'seating': document.getElementById('seating-section'),
            'budget': document.getElementById('budget-section'),
            'guests': document.getElementById('guests-section'),
            'tasks': document.getElementById('tasks-section')
        };
        
        profileTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Aktív tab beállítása
                profileTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Megfelelő szekció megjelenítése
                const sectionId = tab.getAttribute('href').substring(1);
                
                for (const [id, section] of Object.entries(sections)) {
                    if (id === sectionId) {
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
                    }
                }
            });
        });
        
    });