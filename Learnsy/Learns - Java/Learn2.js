const introSection = document.getElementById('intro-section');
const quizSection = document.getElementById('quiz-section');
const questionContainers = document.querySelectorAll('.hero-question-container');
const progressBar = document.querySelector('.hero-progress-bar');
const finalMessage = document.querySelector('.hero-final-message');
const startQuizButton = document.getElementById('start-quiz');

let currentQuestionIndex = 0;
const totalQuestions = questionContainers.length - 1; // Excluimos el mensaje final

function showQuestion(index) {
  if (index >= totalQuestions) {
    questionContainers.forEach(container => container.style.display = 'none');
    finalMessage.style.display = 'flex';
    progressBar.style.width = '100%';
    return;
  }

  questionContainers.forEach((container, i) => {
    container.classList.remove('active');
    container.classList.remove('fade-in'); // Asegurarse de eliminar fade-in antes de fade-out
    if (i === index) {
      setTimeout(() => {
        container.classList.add('active'); // Añadir clase para mostrar la nueva pregunta
        container.classList.add('fade-in');  // Añadir clase para el desvanecimiento de entrada
        setTimeout(() => {
          container.classList.remove('fade-in'); // Eliminar clase de entrada después de la animación
        }, 300); // Duración de la animación de entrada
      }, 300); // Esperar la duración del desvanecimiento de salida
    } else {
      container.classList.add('fade-out'); // Añadir clase para el desvanecimiento de salida
      setTimeout(() => {
        container.classList.remove('fade-out'); // Eliminar clase de salida después de la animación
      }, 300);
    }
  });
  const progress = ((index + 1) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;

  // Obtener los botones de respuesta de la pregunta actual y añadir el listener
  const currentOptions = questionContainers[index].querySelectorAll('.hero-option-button');
  currentOptions.forEach(option => {
    option.onclick = handleAnswerClick; // Usamos onclick directamente para evitar duplicados
    option.disabled = false;
  });
}

function handleAnswerClick() {
  // Deshabilitar todos los botones de la pregunta actual
  const currentOptions = questionContainers[currentQuestionIndex].querySelectorAll('.hero-option-button');
  currentOptions.forEach(btn => btn.disabled = true);

  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }, 500);
}

startQuizButton.addEventListener('click', () => {
  introSection.style.opacity = 0;
  setTimeout(() => {
    introSection.style.display = 'none';
    quizSection.style.display = 'block';
    setTimeout(() => {
      quizSection.classList.add('active');
      showQuestion(currentQuestionIndex);
      progressBar.style.width = '0%';
    }, 10);
  }, 300);
});

window.onload = () => {
  questionContainers.forEach(container => container.classList.remove('active'));
  questionContainers.forEach(container => container.classList.remove('fade-out'));
  questionContainers.forEach(container => container.classList.remove('fade-in'));
  if (questionContainers.length > 0) {
    questionContainers[0].classList.add('active');
    const initialOptions = questionContainers[0].querySelectorAll('.hero-option-button');
    initialOptions.forEach(option => {
      option.onclick = handleAnswerClick;
    });
  }
  progressBar.style.width = '0%';
};