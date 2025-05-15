function handleScrollReveal() {
  const elementsToReveal = document.querySelectorAll('.reveal, .zoom-reveal, .pilares-zigzag .pilar-card, .mentors-section .mentor-card, .cursos-section-aesthetic, .cursos-section-learnsy, .testimonios-section, .nueva-seccion-learnsy, .es-hora-de-cambiar-section');
  const equipoSection = document.querySelector('.equipo-section');

  elementsToReveal.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Lógica específica para la sección del equipo
  if (equipoSection) {
    const rectEquipo = equipoSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Añade la clase 'active' si la parte superior del elemento entra en la vista
    if (rectEquipo.top < windowHeight * 0.85) {
      equipoSection.classList.add('active');
    }
    // No removemos la clase 'active' para la sección del equipo
  }
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);