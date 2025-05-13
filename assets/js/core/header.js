window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.querySelector('.burger-menu').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('show');
});

function resizeCanvas() {
    const canvas = document.getElementById("venteChart");
    canvas.width = window.innerWidth * 0.8; // 80% de la largeur de l'écran
    canvas.height = canvas.width * 0.5; // Garde une bonne proportion
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Appel initial pour ajuster dès le chargement

