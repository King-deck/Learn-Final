window.addEventListener('scroll', function () {
  document.querySelectorAll('.reveal, .zoom-reveal, .pilares-zigzag .pilar-card').forEach(function (el) {
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (top < windowHeight - 100) {
      el.classList.add('active');
    }
  });
});

function checkElements() {
  const elements = document.querySelectorAll('.reveal, .zoom-reveal, .pilares-zigzag .pilar-card');

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Condición para añadir la clase 'active': el elemento es visible en la ventana
    if (rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15) {
      el.classList.add('active');
    } else {
      // Condición para remover la clase 'active': el elemento ya no está visible
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', checkElements);
window.addEventListener('load', checkElements);