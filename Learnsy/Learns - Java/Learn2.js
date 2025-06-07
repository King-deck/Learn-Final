document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const introSection = document.getElementById('intro-section');
    const quizSection = document.getElementById('quiz-section');
    const questionContainers = document.querySelectorAll('.hero-question-container');

    // Seleccionamos el contenedor principal de la barra de progreso y la barra interna.
    const progressBarContainer = document.querySelector('.hero-progress-bar-container'); 
    const progressBar = document.querySelector('.hero-progress-bar'); 

    // Referencias a los dos mensajes finales
    const finalDignoMessage = document.getElementById('final-digno');
    const finalNoDignoMessage = document.getElementById('final-no-digno');

    const startQuizButton = document.getElementById('start-quiz');

    // MODIFICADO: Ahora el botón de reintentar solo existe en 'final-no-digno'
    // Lo buscamos dentro de su contenedor para asegurar que es el correcto.
    const retryQuizButton = finalNoDignoMessage.querySelector('#retry-quiz-button');

    // NUEVA REFERENCIA PARA EL BOTÓN "ACTIVAR MI DESPERTAR"
    const awakeBeastButton = document.getElementById('awake-beast-button'); 

    // Variables globales para el estado del quiz (dentro del ámbito DOMContentLoaded)
    let currentQuestionIndex = 0;
    const totalQuestions = questionContainers.length;
    let correctAnswersCount = 0;

    // Duración de la transición en CSS para la opacidad (0.5s = 500ms)
    const TRANSITION_DURATION = 500; 

    // Array de respuestas "dignas" (asegúrate de que el orden coincide con tus preguntas HTML)
    const heroAnswers = [
        'si',            // Pregunta 1: ¿Estás harto del sistema?
        'absolutamente', // Pregunta 2: ¿Quieres romper el molde?
        'siempre',       // Pregunta 3: ¿Tienes hambre de más?
        'si',            // Pregunta 4: ¿Te consideras una persona resiliente?
        'si',            // Pregunta 5: ¿Buscas constantemente mejorar?
        'si',            // Pregunta 6: ¿Te adaptas fácilmente a los cambios?
        'si',            // Pregunta 7: ¿Te atraen los desafíos complejos?
        'si',            // Pregunta 8: ¿Crees en el trabajo en equipo?
        'si',            // Pregunta 9: ¿Estás dispuesto a aprender de tus errores?
        'si'             // Pregunta 10: ¿Te consideras una persona con determinación?
    ];


    // --- FUNCIONES PARA MANEJAR LA VISIBILIDAD DE LOS ELEMENTOS CON TRANSICIONES ---
    function showElement(element) {
        if (!element) return;
        // console.log(`[showElement] MOSTRANDO: ${element.id || element.className}`);

        // Aseguramos que el display sea flex/block inmediatamente para que la transición de opacidad funcione
        // Añado 'digno-content-card' y 'digno-background-image' aquí para su visibilidad correcta.
        if (element.classList.contains('hero-final-message') || element.classList.contains('hero-quiz-container') || 
            element.classList.contains('hero-question-container') || element.classList.contains('digno-content-card')) {
            element.style.display = 'flex';
        } else if (element.classList.contains('hero-progress-bar-container') || element.classList.contains('hero-intro') ||
                   element.classList.contains('digno-background-image')) { // Asegurar que la imagen de fondo se muestre
            element.style.display = 'block';
        } else {
            element.style.display = 'block';
        }
        
        // Forzar un reflow para que el navegador "vea" el cambio de display antes de aplicar la clase 'active'
        element.offsetHeight; 
        element.classList.add('active'); // Agrega la clase 'active' para transicionar a opacidad 1
        element.style.pointerEvents = 'auto'; // Habilita los clics
        // console.log(`[showElement] FIN MOSTRANDO: ${element.id || element.className}. Clases: ${element.classList.toString()}`);
    }

    function hideElement(element) {
        if (!element) return;
        // console.log(`[hideElement] OCULTANDO: ${element.id || element.className}. Removiendo 'active'.`);

        element.classList.remove('active'); // Remueve la clase 'active' para iniciar la transición de opacidad a 0
        element.style.pointerEvents = 'none'; // Deshabilita clics

        // Esperar a que la transición de opacidad termine antes de aplicar display: none
        setTimeout(() => {
            element.style.display = 'none';
            // console.log(`[hideElement] COMPLETADO OCULTADO (display: none): ${element.id || element.className}.`);
        }, TRANSITION_DURATION); // Este timeout coincide con la duración de la transición CSS (0.5s)
    }
    // --- FIN FUNCIONES DE VISIBILIDAD ---


    // Función para actualizar la barra de progreso
    function updateProgressBar() {
        if (progressBar) {
            const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
            // console.log(`[updateProgressBar] Progreso: ${progress}%`);
        }
    }


    function showQuestion(index) {
        // console.log(`[showQuestion] Intentando mostrar pregunta con índice: ${index}`);
        
        if (index >= totalQuestions) {
            endQuiz();
            return;
        }

        // Oculta todas las preguntas que no sean la actual, usando la función hideElement con su transición.
        questionContainers.forEach((container, idx) => {
            if (idx !== index) {
                hideElement(container); 
            }
        });

        const questionToDisplay = questionContainers[index];
        if (questionToDisplay) {
            setTimeout(() => {
                showElement(questionToDisplay);
                updateProgressBar();
                
                questionToDisplay.querySelectorAll('.hero-option-button').forEach(option => {
                    option.onclick = handleAnswerClick; 
                    option.disabled = false; 
                });
            }, TRANSITION_DURATION / 2); // Un retraso un poco menor que la transición completa
        } else {
            console.warn(`[showQuestion] No se encontró el contenedor para el índice ${index}.`);
            endQuiz();
        }
    }


    function handleAnswerClick(event) {
        const currentQuestionEl = questionContainers[currentQuestionIndex];
        if (currentQuestionEl) {
            currentQuestionEl.querySelectorAll('.hero-option-button').forEach(btn => {
                btn.disabled = true; 
            });
        }

        const selectedAnswer = event.target.dataset.respuesta;
        if (selectedAnswer === heroAnswers[currentQuestionIndex]) {
            correctAnswersCount++;
        }

        if (currentQuestionEl) {
            hideElement(currentQuestionEl); 
        }

        setTimeout(() => {
            currentQuestionIndex++; 

            if (currentQuestionIndex < totalQuestions) {
                showQuestion(currentQuestionIndex); 
            } else {
                endQuiz(); 
            }
        }, TRANSITION_DURATION);
    }


    // Función para finalizar el cuestionario
    function endQuiz() {
        console.log("[endQuiz] Fin del cuestionario. Procesando mensajes finales.");
        
        hideElement(quizSection); // Oculta la sección del quiz
        hideElement(progressBarContainer); // Oculta la barra de progreso

        if (progressBar) { 
            progressBar.style.width = '100%'; 
        }

        const messageToShow = correctAnswersCount >= 8 ? finalDignoMessage : finalNoDignoMessage;
        const otherMessage = correctAnswersCount >= 8 ? finalNoDignoMessage : finalDignoMessage;

        // Ocultar el mensaje que NO se va a mostrar ANTES de mostrar el correcto.
        // Esto previene que se muestren los dos brevemente.
        if (otherMessage && otherMessage.classList.contains('active')) {
            hideElement(otherMessage);
        }

        // Pequeño retraso para que los elementos anteriores se oculten completamente
        // antes de que aparezca el mensaje final.
        setTimeout(() => {
            if (messageToShow) {
                showElement(messageToShow); // Muestra el mensaje final correspondiente (Digno o No Digno)
                console.log(`%c[endQuiz] Mensaje final '${messageToShow.id}' MOSTRADO. Score: ${correctAnswersCount}`, 'color: yellow; font-weight: bold;');
            }
        }, TRANSITION_DURATION); // Espera a que el quizSection y la barra de progreso se oculten.
    }


    // --- FUNCIÓN PARA REINICIAR EL QUIZ Y VOLVER A LA PRIMERA PREGUNTA ---
    function resetQuizAndStartFirstQuestion() {
        console.log("[resetQuizAndStartFirstQuestion] Reiniciando cuestionario.");
        
        // Ocultar los mensajes finales (si están visibles)
        // Usamos una función separada para asegurar que ambos se oculten.
        // Aquí no hay problemas de parpadeo, ya que la intención es ocultarlos.
        hideElement(finalDignoMessage);
        hideElement(finalNoDignoMessage);

        // Reiniciar variables de estado del cuestionario
        currentQuestionIndex = 0; 
        correctAnswersCount = 0; 
        console.log("[resetQuizAndStartFirstQuestion] Variables reiniciadas.");

        // Mostrar y activar la sección del cuestionario y la barra de progreso
        // Se hace en un setTimeout para asegurar que los mensajes finales se hayan ocultado primero
        setTimeout(() => {
            showElement(quizSection);
            showElement(progressBarContainer);
            if (progressBar) { 
                progressBar.style.width = '0%'; // Reiniciar la barra visualmente
            }

            // Ocultar todas las preguntas individuales al inicio del reinicio.
            questionContainers.forEach(container => {
                hideElement(container);
            });

            // Después de que la sección del quiz y la barra de progreso estén visibles,
            // y que las preguntas individuales estén ocultas, mostramos la primera pregunta.
            setTimeout(() => {
                showQuestion(currentQuestionIndex); // Muestra la primera pregunta (índice 0)
                console.log("[resetQuizAndStartFirstQuestion] showQuestion(0) llamado para reiniciar el flujo.");
            }, TRANSITION_DURATION); // Espera la duración de la transición de quizSection.

        }, TRANSITION_DURATION); // Espera a que los mensajes finales se oculten.
    }


    // --- Event listener para el botón "Estoy listo" que inicia el cuestionario ---
    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => {
            console.log("[startQuizButton] Botón 'Estoy listo' clickeado. Iniciando quiz.");
            
            hideElement(introSection); // Oculta la sección de introducción
            
            // Esperamos a que la intro se oculte antes de mostrar el quiz y la barra
            setTimeout(() => {
                showElement(quizSection); // Muestra la sección del quiz
                showElement(progressBarContainer); // Muestra la barra de progreso
                
                currentQuestionIndex = 0; 
                correctAnswersCount = 0; 
                if (progressBar) progressBar.style.width = '0%'; 

                // Esperamos a que quizSection y progressBarContainer sean visibles antes de mostrar la primera pregunta
                setTimeout(() => {
                    showQuestion(currentQuestionIndex); 
                }, TRANSITION_DURATION); // Espera la duración de la transición de quizSection.
            }, TRANSITION_DURATION); // Espera a que la intro se oculte.
        });
    }

    // --- Event Listener para el botón de "Reintentar Prueba" ---
    if (retryQuizButton) {
        retryQuizButton.addEventListener('click', () => {
            console.log("[retryQuizButton] Botón 'Reintentar Prueba' clickeado. Reiniciando quiz.");
            resetQuizAndStartFirstQuestion(); // Llama a la función de reinicio
        });
    }

    // Event Listener para el botón "Activar mi Despertar"
    if (awakeBeastButton) {
        awakeBeastButton.addEventListener('click', () => {
            console.log("[awakeBeastButton] Botón 'Activar mi Despertar' clickeado.");
            hideElement(finalDignoMessage); // Oculta el mensaje de "Digno"
            // Aquí es donde en el futuro, pondríamos la lógica para mostrar la sección de login
        });
    }


    // --- Lógica de inicialización al cargar la página ---
    // Oculta todas las secciones que no deben ser visibles al inicio
    hideElement(quizSection);
    hideElement(finalDignoMessage);
    hideElement(finalNoDignoMessage);
    hideElement(progressBarContainer);

    // Ocultar todas las preguntas individuales al inicio usando hideElement.
    questionContainers.forEach(container => {
        hideElement(container);
    });

    // Muestra la sección de introducción al cargar la página con la transición
    showElement(introSection); 
    console.log(`[DOMContentLoaded] Inicialización completa. Intro visible.`);
}); // Fin de DOMContentLoaded