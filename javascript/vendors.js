document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".category-btn");
    const cards = document.querySelectorAll(".service-card");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCategory = button.textContent.trim();

            // Gomb színek frissítése
            buttons.forEach(btn => {
                btn.classList.remove("bg-[#d4a373]", "text-white");
                btn.classList.add("text-[#d4a373]", "bg-transparent");
            });
            button.classList.remove("text-[#d4a373]", "bg-transparent");
            button.classList.add("bg-[#d4a373]", "text-white");

            // Kártyák szűrése
            cards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (selectedCategory === "Összes" || selectedCategory === category) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});

document.querySelectorAll('.favorite-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    
    const icon = btn.querySelector('svg');
    
    if (btn.classList.contains('active')) {
      icon.classList.remove('text-gray-400');
      icon.classList.add('text-[#d4a373]');
    } else {
      icon.classList.remove('text-[#d4a373]');
      icon.classList.add('text-gray-400');
    }
  });
});