function handleScrollReveal() {
  const elementsToReveal = document.querySelectorAll('.reveal, .zoom-reveal, .pilares-zigzag .pilar-card, .mentors-section .mentor-card, .cursos-section-aesthetic, .cursos-section-learnsy, .testimonios-section, .nueva-seccion-learnsy, .es-hora-de-cambiar-section, .why-learnsy-background');
  const equipoSection = document.querySelector('.equipo-section');
  const pilaresZigzagSection = document.querySelector('.pilares-zigzag');
  const tituloPilaresContainer = document.querySelector('.titulo-pilares-container'); // <--- SELECCIONA EL CONTENEDOR DEL TÍTULO
  const whyLearnsyBackground = document.querySelector('.why-learnsy-background');
  const learnsyImageContainer = document.querySelector('.image-container-left'); // Seleccionamos el contenedor de la imagen

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

    if (rectEquipo.top < windowHeight * 0.85) {
      equipoSection.classList.add('active');
    }
  }

  // Lógica para la sección de Pilares Zigzag (incluyendo el contenedor del título)
  if (pilaresZigzagSection) {
    const rectPilares = pilaresZigzagSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rectPilares.top < windowHeight * 0.85 && rectPilares.bottom > windowHeight * 0.15) {
      pilaresZigzagSection.classList.add('active');
      if (tituloPilaresContainer) {
        tituloPilaresContainer.classList.add('active');
      }
    } else {
      pilaresZigzagSection.classList.remove('active');
      if (tituloPilaresContainer) {
        tituloPilaresContainer.classList.remove('active');
      }
    }
  }

  // Lógica específica para la imagen de Why Learnsy (añadir y remover la clase)
  if (whyLearnsyBackground && learnsyImageContainer) {
    const rectWhyLearnsy = whyLearnsyBackground.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rectWhyLearnsy.top < windowHeight * 0.85 && rectWhyLearnsy.bottom > windowHeight * 0.15) {
      learnsyImageContainer.classList.add('active-on-scroll-down');
    } else {
      learnsyImageContainer.classList.remove('active-on-scroll-down');
    }
  }
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);