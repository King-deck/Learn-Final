const introSection = document.getElementById('intro-section');
const quizSection = document.getElementById('quiz-section');
const questionContainers = document.querySelectorAll('.hero-question-container');
const nextButtons = document.querySelectorAll('.hero-next-button');
const progressBar = document.querySelector('.hero-progress-bar');
const finalMessage = document.querySelector('.hero-final-message');
const startQuizButton = document.getElementById('start-quiz');

let currentQuestionIndex = 0;
const totalQuestions = questionContainers.length;

function showQuestion(index) {
  questionContainers.forEach((container, i) => {
    container.classList.remove('active');
    if (i === index) {
      setTimeout(() => {
        container.classList.add('active');
      }, 300); // Pequeño delay para el efecto de transición
    }
  });
  const progress = ((index + 1) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
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
    }, 10); // Pequeño delay para la transición del cuestionario
  }, 500); // Duración de la transición de la introducción
});

nextButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
      showQuestion(currentQuestionIndex);
    } else {
      questionContainers.forEach(container => container.style.display = 'none');
      finalMessage.style.display = 'flex';
      progressBar.style.width = '100%';
    }
  });
});

window.onload = () => {
  questionContainers.forEach(container => container.classList.remove('active'));
};