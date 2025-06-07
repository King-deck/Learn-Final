// Asegúrate de que este script se ejecute cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS A ELEMENTOS DEL DOM en Secion.html ---
    const loginSection = document.getElementById('login-section'); // El div principal del formulario
    const loginForm = document.querySelector('.login-form'); // El formulario en sí
    const emailInput = document.getElementById('email'); // Input de email
    const passwordInput = document.getElementById('password'); // Input de contraseña
    const loginButton = document.getElementById('login-button'); // Botón de "Iniciar Sesión"
    const googleLoginButton = document.getElementById('google-login-button'); // Botón de Google
    const signupLink = document.getElementById('signup-link'); // Enlace de "Regístrate aquí"
    const forgotPasswordLink = document.getElementById('forgot-password-link'); // Enlace de "¿Olvidaste tu contraseña?"

    // --- REFERENCIAS A SERVICIOS DE FIREBASE ---
    // 'auth' y 'db' se inicializan en el script del HTML (Secion.html)
    // Asegúrate de que esas variables estén disponibles globalmente en ese HTML.
    // No necesitas declararlas aquí nuevamente si ya están en el HTML.
    // Ejemplo: const auth = firebase.auth(); const db = firebase.firestore();

    /**
     * Guarda o actualiza los datos del usuario en Firestore.
     * Se ejecuta después de cada inicio de sesión exitoso.
     * @param {firebase.User} user El objeto de usuario de Firebase.
     * @param {string} method El método de autenticación ('email' o 'google').
     */
    async function saveUserToFirestore(user, method) {
        try {
            // Asegúrate de que 'db' esté accesible globalmente o pasado a esta función
            if (typeof db === 'undefined') {
                console.error("Firestore 'db' no está definido. Asegúrate de inicializarlo en tu HTML.");
                return;
            }
            const userRef = db.collection('users').doc(user.uid);
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || null, 
                photoURL: user.photoURL || null,     
                authMethod: method,                  
                createdAt: user.metadata.creationTime, 
                lastSignInTime: user.metadata.lastSignInTime, 
            };
            await userRef.set(userData, { merge: true });
            console.log(`%c[Firestore] Perfil de usuario ${user.email} (${user.uid}) guardado/actualizado en Firestore.`, 'color: lightblue;');

        } catch (error) {
            console.error("[Firestore Error] Error al guardar el usuario en Firestore:", error);
            alert("Hubo un error al guardar tu perfil de usuario. Por favor, intenta de nuevo.");
        }
    }


    /**
     * Función central para manejar un inicio de sesión exitoso.
     * Redirige al usuario a la página principal después del login.
     * @param {firebase.User} user El objeto de usuario de Firebase.
     */
    async function handleSuccessfulLogin(user) {
        console.log(`%c[Auth] ¡Inicio de sesión exitoso! Usuario: ${user.email}`, 'color: lightgreen; font-weight: bold;');
        
        alert(`¡Bienvenido, ${user.displayName || user.email}! Has iniciado sesión exitosamente.`);

        let authMethod = 'unknown';
        if (user.providerData && user.providerData.length > 0) {
            if (user.providerData[0].providerId === 'google.com') {
                authMethod = 'google';
            } else if (user.providerData[0].providerId === 'password') {
                authMethod = 'email';
            }
        }
        await saveUserToFirestore(user, authMethod);

        // Después del login exitoso, redirigir al usuario a una página de "dashboard" o contenido principal
        window.location.href = "dashboard.html"; // ¡IMPORTANTE: CAMBIA ESTO A TU PÁGINA PRINCIPAL DESPUÉS DEL LOGIN!
    }


    // --- FUNCIÓN DE INICIO DE SESIÓN CON CORREO Y CONTRASEÑA ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Por favor, ingresa tu correo y contraseña.");
                return;
            }

            // Deshabilitar botón y cambiar texto mientras se procesa
            loginButton.disabled = true;
            loginButton.textContent = 'Iniciando...';

            try {
                // Asegúrate de que 'auth' esté accesible globalmente
                if (typeof auth === 'undefined') {
                    console.error("Firebase Auth 'auth' no está definido. Asegúrate de inicializarlo en tu HTML.");
                    return;
                }
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                await handleSuccessfulLogin(userCredential.user);
            } catch (error) {
                console.error("[Auth Error] Error al iniciar sesión con email:", error.code, error.message);
                let errorMessage = "Error al iniciar sesión. Verifica tu correo y contraseña.";
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = "Correo o contraseña incorrectos.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "El formato del correo es inválido.";
                }
                alert(errorMessage);
            } finally {
                // Habilitar botón y restaurar texto
                loginButton.disabled = false;
                loginButton.textContent = 'Iniciar Sesión →';
                emailInput.value = ''; // Limpiar campos
                passwordInput.value = '';
            }
        });
    }

    // --- FUNCIÓN DE REGISTRO CON CORREO Y CONTRASEÑA ---
    if (signupLink) {
        signupLink.addEventListener('click', async (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            console.log("[Link] Enlace 'Regístrate aquí' clickeado. Intentando registro...");
            const email = prompt("Ingresa tu correo para registrarte:");
            const password = prompt("Ingresa una contraseña (mínimo 6 caracteres):");

            if (!email || !password) {
                alert("Correo y contraseña son necesarios para el registro.");
                return;
            }
            if (password.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            try {
                if (typeof auth === 'undefined') {
                    console.error("Firebase Auth 'auth' no está definido. Asegúrate de inicializarlo en tu HTML.");
                    return;
                }
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                console.log(`%c[Auth] ¡Registro exitoso! Usuario: ${userCredential.user.email}`, 'color: lightgreen;');
                alert(`¡Cuenta creada exitosamente para ${userCredential.user.email}! Ahora puedes iniciar sesión.`);
                
                await handleSuccessfulLogin(userCredential.user); // Iniciar sesión automáticamente después del registro

            } catch (error) {
                console.error("[Auth Error] Error al registrar usuario:", error.code, error.message);
                let errorMessage = "Error al registrarte.";
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = "Este correo ya está registrado.";
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = "La contraseña es demasiado débil (mínimo 6 caracteres).";
                }
                alert(errorMessage);
            }
        });
    }


    // --- FUNCIÓN DE INICIO DE SESIÓN CON GOOGLE ---
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', async () => {
            console.log("[Google Auth] Botón 'Inicia Sesión con Google' clickeado.");
            // Asegúrate de que 'firebase' esté accesible globalmente
            if (typeof firebase === 'undefined') {
                console.error("Firebase SDK 'firebase' no está definido. Asegúrate de inicializarlo en tu HTML.");
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();

            try {
                const result = await auth.signInWithPopup(provider); // Abre la ventana emergente de Google
                await handleSuccessfulLogin(result.user); // Maneja el login exitoso

            } catch (error) {
                console.error("[Auth Error] Error al iniciar sesión con Google:", error.code, error.message);
                let errorMessage = "Error al iniciar sesión con Google. Inténtalo de nuevo.";
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = "La ventana de inicio de sesión de Google fue cerrada.";
                } else if (error.code === 'auth/cancelled-popup-request') {
                    errorMessage = "Ya hay una ventana emergente de inicio de sesión abierta.";
                }
                alert(errorMessage);
            }
        });
    }

    // --- MANEJO DEL ESTADO DE AUTENTICACIÓN (CUANDO LA PÁGINA CARGA O EL USUARIO INICIA/CIERRA SESIÓN) ---
    // Esto es crucial para si el usuario ya está logueado y llega a Secion.html
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // El usuario ha iniciado sesión. Redirigir si ya está logueado en esta página de login.
            console.log(`%c[AuthState] Usuario ya logueado en Secion.html: ${user.email}. Redirigiendo...`, 'color: orange; font-weight: bold;');
            
            // Obtener el método de autenticación para guardar en Firestore
            let authMethod = 'unknown';
            if (user.providerData && user.providerData.length > 0) {
                if (user.providerData[0].providerId === 'google.com') {
                    authMethod = 'google';
                } else if (user.providerData[0].providerId === 'password') {
                    authMethod = 'email';
                }
            }
            await saveUserToFirestore(user, authMethod);
            
            window.location.href = "dashboard.html"; // Redirige a la página principal del usuario
        } else {
            // El usuario NO ha iniciado sesión. Mostrar el formulario de login.
            console.log("[AuthState] Usuario no autenticado. Mostrando formulario de login.");
            // Si por alguna razón el loginSection está oculto por defecto, aquí podrías mostrarlo:
            // loginSection.style.display = 'block'; 
        }
    });

    // Event Listener para el enlace "Olvidaste tu contraseña?"
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = prompt("Ingresa tu correo electrónico para restablecer la contraseña:");
            if (email) {
                try {
                    if (typeof auth === 'undefined') {
                        console.error("Firebase Auth 'auth' no está definido. Asegúrate de inicializarlo en tu HTML.");
                        return;
                    }
                    await auth.sendPasswordResetEmail(email);
                    alert("Se ha enviado un correo electrónico para restablecer tu contraseña. Revisa tu bandeja de entrada.");
                    console.log("[Auth] Correo de restablecimiento enviado a:", email);
                } catch (error) {
                    console.error("[Auth Error] Error al enviar correo de restablecimiento:", error.code, error.message);
                    let errorMessage = "No se pudo enviar el correo de restablecimiento. Verifica el correo ingresado.";
                    if (error.code === 'auth/user-not-found') {
                        errorMessage = "No existe un usuario con ese correo.";
                    }
                    alert(errorMessage);
                }
            } else {
                alert("Por favor, ingresa un correo electrónico.");
            }
        });
    }
}); // Fin de DOMContentLoaded