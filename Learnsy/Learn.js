function handleScrollReveal() {
  const elementsToReveal = document.querySelectorAll('.reveal, .zoom-reveal, .pilares-zigzag .pilar-card, .mentors-section .mentor-card, .cursos-section-aesthetic, .cursos-section-learnsy, .testimonios-section, .nueva-seccion-learnsy, .es-hora-de-cambiar-section');

  elementsToReveal.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);