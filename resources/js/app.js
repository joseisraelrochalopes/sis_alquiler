// Importa los estilos principales de tu app (Tailwind, etc.)
import '../css/app.css';

// Registro del Service Worker para convertir tu app en PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registrado con éxito:', registration.scope);
            })
            .catch((error) => {
                console.error('❌ Error al registrar el Service Worker:', error);
            });
    });
}
