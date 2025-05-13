document.addEventListener("DOMContentLoaded", function() {
    const burgerMenu = document.querySelector(".burger-menu");
    const navMenu = document.querySelector("ul");

    burgerMenu.addEventListener("click", function() {
        navMenu.classList.toggle("active");
    });

    function resizeCanvas() {
        const canvas = document.getElementById("statsChart");

        if (!canvas) {
            console.error("Erreur : 'statsChart' introuvable !");
            return;
        }

        canvas.width = 800;
        canvas.height = 400;
    }

    resizeCanvas(); // Exécute au chargement
});
