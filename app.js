document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica de Navegación Responsiva ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('#main-nav ul');
    const navLinks = document.querySelectorAll('#main-nav ul li a');

    // Toggle para el menú hamburguesa
    menuToggle.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });

    // Cerrar el menú después de hacer clic en un enlace (útil en móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navUl.classList.contains('active')) {
                navUl.classList.remove('active');
            }
        });
    });

    // --- Lógica del Formulario (Integración 3: Make Webhook) ---
    const form = document.getElementById('registroForm');
    const formMessage = document.getElementById('formMessage');

    // URL del Webhook de Make (Punto Final/Endpoint)
    // *** REEMPLAZA ESTA URL CON LA REAL DE TU SCENARIO DE MAKE *** [cite: 15, 16]
    const MAKE_WEBHOOK_URL = 'TU_MAKE_WEBHOOK_URL'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Recolección de datos del formulario [cite: 17]
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 2. Preparación de la respuesta visual
        formMessage.textContent = 'Enviando tu registro...';
        formMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';

        try {
            // 3. Envío de los datos al Webhook de Make (POST Request) [cite: 16, 17]
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data) // Envía los datos del formulario como JSON [cite: 17]
            });

            // Make devuelve un status 200/202 si el webhook se recibe correctamente
            if (response.ok) {
                // Éxito: El flujo de Make se activará (almacenamiento en Firebase, correos, etc.) [cite: 49]
                formMessage.textContent = '✅ ¡Registro Exitoso! Revisa tu correo para la confirmación.';
                formMessage.style.backgroundColor = '#d4edda'; // Color verde claro
                formMessage.style.color = '#155724'; // Color de texto verde oscuro
                form.reset(); // Limpia el formulario
            } else {
                // Error al recibir en Make (posiblemente un error de URL o en Make)
                throw new Error('Error al conectar con el servicio de automatización. Intenta más tarde.');
            }

        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            formMessage.textContent = '❌ Error en el registro. Por favor, verifica tu conexión o intenta con WhatsApp.';
            formMessage.style.backgroundColor = '#f8d7da'; // Color rojo claro
            formMessage.style.color = '#721c24'; // Color de texto rojo oscuro
        }
    });

});