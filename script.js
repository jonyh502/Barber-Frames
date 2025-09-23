// Variables globales
let currentSlide = 0;
let selectedService = '';
let selectedEmployee = '';
let selectedServiceName = '';
let selectedEmployeeName = '';
let bookingConfirmed = false;
let confirmationWatcher = null;

const totalSlides = 5;

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página cargada - Inicializando sistema');
    
    initializeSlides();
    setupEmployeeSelection();
    setupServiceSelection();
    setupIndicatorNavigation();
    
    const newReservationBtn = document.querySelector('.btn-secondary');
    if (newReservationBtn) {
        newReservationBtn.addEventListener('click', function() {
            resetSelections();
        });
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            previousSlide();
        } else if (event.key === 'Escape') {
            closeConfirmation();
        }
    });
    
    console.log('✅ Sistema inicializado correctamente');
});

// FUNCIÓN DE PANTALLA COMPLETA MEJORADA PARA MÓVIL
function enterFullscreen() {
    try {
        const elem = document.documentElement;
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        }
        
        // Para iOS Safari - simular pantalla completa
        if (window.navigator.standalone !== undefined) {
            // Ocultar la barra de direcciones en iOS
            setTimeout(function() {
                window.scrollTo(0, 1);
            }, 0);
        }
        
        // Cambiar ícono
        const icon = document.querySelector('.fullscreen-btn i');
        if (icon) {
            icon.className = 'fas fa-compress';
        }
        
        console.log('🔲 Intentando activar pantalla completa');
        
    } catch (error) {
        console.log('❌ Error al activar pantalla completa:', error);
        
        // Método alternativo - ocultar elementos del navegador
        hideAddressBar();
    }
}

// FUNCIÓN ALTERNATIVA PARA MÓVILES QUE NO SOPORTAN FULLSCREEN
function hideAddressBar() {
    // Ocultar barra de direcciones en móviles
    window.scrollTo(0, 1);
    
    // Agregar estilos para simular pantalla completa
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    
    console.log('📱 Aplicando modo pseudo-pantalla completa para móvil');
    
    // Mostrar mensaje al usuario
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10001;
        font-size: 14px;
        text-align: center;
    `;
    message.innerHTML = '📱 Para pantalla completa real:<br>Toca el menú de tu navegador<br>y selecciona "Pantalla completa"';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
}

// Detectar cambios en pantalla completa
document.addEventListener('fullscreenchange', function() {
    const icon = document.querySelector('.fullscreen-btn i');
    if (icon) {
        if (document.fullscreenElement) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    }
});

// Para otros navegadores
document.addEventListener('webkitfullscreenchange', function() {
    const icon = document.querySelector('.fullscreen-btn i');
    if (icon) {
        if (document.webkitFullscreenElement) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    }
});

// Función para inicializar slides
function initializeSlides() {
    updateSlideVisibility();
    updateNavigationButtons();
    updateIndicators();
}

// Navegación de slides
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        console.log('Avanzando a slide:', currentSlide);
        updateSlideVisibility();
        updateNavigationButtons();
        updateIndicators();
        
        // Si llegamos al slide del calendario, iniciar observador
        if (currentSlide === 3) {
            startCalendarWatcher();
        } else {
            // Si salimos del slide del calendario, detener observador y remover botón
            stopCalendarWatcher();
        }
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        console.log('Retrocediendo a slide:', currentSlide);
        updateSlideVisibility();
        updateNavigationButtons();
        updateIndicators();
        
        // Si llegamos al slide del calendario, iniciar observador
        if (currentSlide === 3) {
            startCalendarWatcher();
        } else {
            // Si salimos del slide del calendario, detener observador y remover botón
            stopCalendarWatcher();
        }
    }
}

function goToSlide(slideNumber) {
    if (slideNumber >= 0 && slideNumber < totalSlides) {
        console.log('Yendo directamente a slide:', slideNumber);
        currentSlide = slideNumber;
        updateSlideVisibility();
        updateNavigationButtons();
        updateIndicators();
        
        // Si vamos al slide del calendario, iniciar observador
        if (slideNumber === 3) {
            startCalendarWatcher();
        } else {
            // Si salimos del slide del calendario, detener observador y remover botón
            stopCalendarWatcher();
        }
    }
}

// Actualizar visibilidad de slides
function updateSlideVisibility() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index < currentSlide) {
            slide.classList.add('prev');
        }
    });
}

// Actualizar botones de navegación
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
}

// Actualizar indicadores
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Navegación por indicadores
function setupIndicatorNavigation() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

// Observador del calendario - MEJORADO
function startCalendarWatcher() {
    console.log('🔍 Iniciando observador del calendario...');
    
    if (confirmationWatcher) {
        clearInterval(confirmationWatcher);
    }
    
    let attempts = 0;
    const maxAttempts = 180; // 3 minutos de monitoreo
    
    // Crear botón de confirmación manual que aparece después de 10 segundos - SOLO EN EL SLIDE DEL CALENDARIO
    setTimeout(() => {
        if (currentSlide === 3 && !bookingConfirmed) {
            createManualConfirmButton();
        }
    }, 10000);
    
    confirmationWatcher = setInterval(() => {
        attempts++;
        
        // SOLO CONTINUAR SI ESTAMOS EN EL SLIDE DEL CALENDARIO
        if (currentSlide !== 3) {
            stopCalendarWatcher();
            return;
        }
        
        try {
            const iframe = document.getElementById('calendar-iframe');
            if (!iframe) return;
            
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            if (iframeDoc && iframeDoc.body) {
                const bodyText = iframeDoc.body.innerText.toLowerCase();
                
                if (bodyText.includes('reserva confirmada') ||
                    bodyText.includes('cita confirmada') ||
                    bodyText.includes('appointment confirmed') ||
                    bodyText.includes('confirmada')) {
                    
                    console.log('✅ ¡CONFIRMACIÓN AUTO-DETECTADA!');
                    stopCalendarWatcher();
                    handleBookingConfirmation();
                    return;
                }
            }
        } catch (error) {
            // Error CORS esperado
        }
        
        if (attempts >= maxAttempts) {
            console.log('⏰ Tiempo de observación agotado');
            stopCalendarWatcher();
        }
    }, 1000);
}

// NUEVA FUNCIÓN: Detener observador del calendario
function stopCalendarWatcher() {
    if (confirmationWatcher) {
        clearInterval(confirmationWatcher);
        confirmationWatcher = null;
        console.log('🛑 Observador del calendario detenido');
    }
    
    // Remover botón manual si existe
    removeManualConfirmButton();
}

// Crear botón de confirmación manual - SOLO EN SLIDE CALENDARIO - MÁS PEQUEÑO PARA MÓVIL
function createManualConfirmButton() {
    // VERIFICAR QUE ESTEMOS EN EL SLIDE DEL CALENDARIO
    if (currentSlide !== 3) {
        return;
    }
    
    // Verificar si ya existe
    if (document.getElementById('manual-confirm-btn')) return;
    
    console.log('🔘 Creando botón de confirmación manual...');
    
    const button = document.createElement('div');
    button.id = 'manual-confirm-btn';
    button.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #d4af37, #f4c842);
            color: #1a1a1a;
            padding: 10px 18px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
            z-index: 10001;
            animation: bounce 2s infinite;
            display: flex;
            align-items: center;
            gap: 8px;
            border: 2px solid #1a1a1a;
            max-width: 200px;
        ">
            <span style="font-size: 16px;">✅</span>
            <span>¡Mi cita está confirmada!</span>
        </div>
    `;
    
    // Agregar animación
    const style = document.createElement('style');
    style.id = 'manual-confirm-style';
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-8px); }
            60% { transform: translateY(-4px); }
        }
    `;
    document.head.appendChild(style);
    
    button.addEventListener('click', function() {
        console.log('🖱️ Usuario confirmó manualmente');
        removeManualConfirmButton();
        handleBookingConfirmation();
    });
    
    document.body.appendChild(button);
}

// Remover botón manual
function removeManualConfirmButton() {
    const button = document.getElementById('manual-confirm-btn');
    const style = document.getElementById('manual-confirm-style');
    
    if (button) document.body.removeChild(button);
    if (style) document.head.removeChild(style);
}

// Selección de empleado (PRIMERO)
function setupEmployeeSelection() {
    const employeeCards = document.querySelectorAll('.employee-card');
    
    employeeCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.add('selecting');
            
            employeeCards.forEach(c => {
                c.classList.remove('selected', 'confirmed');
            });
            
            this.classList.add('selected');
            
            selectedEmployee = this.getAttribute('data-employee');
            selectedEmployeeName = this.querySelector('h3').textContent;
            
            const selectionText = document.querySelector('#slide-1 .selection-text');
            if (selectionText) {
                selectionText.textContent = `Barbero seleccionado: ${selectedEmployeeName}`;
            }
            
            const barberName = document.getElementById('selected-barber-name');
            if (barberName) {
                barberName.textContent = selectedEmployeeName;
            }
            
            setTimeout(() => {
                this.classList.remove('selecting');
                this.classList.add('confirmed');
                
                setTimeout(() => {
                    nextSlide();
                }, 1200);
                
            }, 600);
        });
    });
}

// Selección de servicios (SEGUNDO)
function setupServiceSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.add('selecting');
            
            serviceCards.forEach(c => {
                c.classList.remove('selected', 'confirmed');
            });
            
            this.classList.add('selected');
            
            selectedService = this.getAttribute('data-service');
            selectedServiceName = this.querySelector('h3').textContent;
            
            const selectionText = document.querySelector('#slide-2 .selection-text');
            if (selectionText) {
                selectionText.textContent = `Servicio seleccionado: ${selectedServiceName}`;
            }
            
            updateBookingSummary();
            
            setTimeout(() => {
                this.classList.remove('selecting');
                this.classList.add('confirmed');
                
                setTimeout(() => {
                    nextSlide();
                }, 1200);
                
            }, 600);
        });
    });
}

// Actualizar resumen de reserva
function updateBookingSummary() {
    const employeeText = document.getElementById('selected-employee-text');
    const serviceText = document.getElementById('selected-service-text');
    
    if (employeeText) employeeText.textContent = selectedEmployeeName;
    if (serviceText) serviceText.textContent = selectedServiceName;
}

// Mostrar mensaje de confirmación
function showConfirmationMessage() {
    console.log('Mostrando mensaje de confirmación personalizado');
    const confirmation = document.getElementById('confirmation-message');
    if (confirmation) {
        confirmation.className = 'confirmation-show';
        
        const confirmEmployee = document.getElementById('confirm-employee');
        const confirmService = document.getElementById('confirm-service');
        
        if (confirmEmployee) confirmEmployee.textContent = selectedEmployeeName;
        if (confirmService) confirmService.textContent = selectedServiceName;
    }
}

// Cerrar mensaje de confirmación
function closeConfirmation() {
    console.log('Cerrando mensaje de confirmación');
    const confirmation = document.getElementById('confirmation-message');
    if (confirmation) {
        confirmation.className = 'confirmation-hidden';
    }
}

// Manejar confirmación de reserva - 3 MINUTOS
function handleBookingConfirmation() {
    console.log('🎉 handleBookingConfirmation() ejecutada');
    
    if (bookingConfirmed) {
        console.log('❌ Confirmación ya procesada');
        return;
    }
    
    bookingConfirmed = true;
    console.log('✅ Procesando confirmación de reserva...');
    
    // Detener observador y remover botón manual
    stopCalendarWatcher();
    
    // Mostrar mensaje de confirmación
    showConfirmationMessage();
    
    // Esperar 3 MINUTOS (180000 ms)
    console.log('⏰ Esperando 3 MINUTOS antes de cambiar slide...');
    setTimeout(() => {
        console.log('🔄 Cambiando al slide de contacto (slide 4) después de 3 minutos');
        
        closeConfirmation();
        goToSlide(4);
        
        setTimeout(() => {
            console.log('🔄 Reseteando flag de confirmación');
            bookingConfirmed = false;
        }, 5000);
        
    }, 180000); // 3 minutos
}

// Función para resetear selecciones
function resetSelections() {
    selectedService = '';
    selectedEmployee = '';
    selectedServiceName = '';
    selectedEmployeeName = '';
    bookingConfirmed = false;
    
    // Detener observador
    stopCalendarWatcher();
    
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected', 'confirmed', 'selecting');
    });
    
    document.querySelectorAll('.employee-card').forEach(card => {
        card.classList.remove('selected', 'confirmed', 'selecting');
    });
    
    const slide1Text = document.querySelector('#slide-1 .selection-text');
    const slide2Text = document.querySelector('#slide-2 .selection-text');
    const barberName = document.getElementById('selected-barber-name');
    
    if (slide1Text) slide1Text.textContent = 'Selecciona tu barbero preferido';
    if (slide2Text) slide2Text.textContent = 'Selecciona el servicio que deseas';
    if (barberName) barberName.textContent = 'tu barbero';
}

// Función manual para testing
window.testBookingConfirmation = function() {
    console.log('🧪 Ejecutando confirmación de prueba manual...');
    handleBookingConfirmation();
};

// Hacer las funciones accesibles globalmente
window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.goToSlide = goToSlide;
window.closeConfirmation = closeConfirmation;
window.enterFullscreen = enterFullscreen;
