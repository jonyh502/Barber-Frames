// ===============================================
// BARBERSHOP ELITE - JAVASCRIPT RESPONSIVE OPTIMIZADO
// ===============================================

// Variables globales mejoradas
let currentSlide = 0;
let selectedService = '';
let selectedEmployee = '';
let selectedServiceName = '';
let selectedEmployeeName = '';
let selectedServicePrice = 0;
let bookingConfirmed = false;
let confirmationWatcher = null;
let touchStartX = 0;
let touchEndX = 0;
let isTransitioning = false;
let responsiveBreakpoint = 'desktop';

const totalSlides = 5;

// Detección de dispositivo y orientación
const isMobile = () => window.innerWidth <= 768;
const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
const isLandscape = () => window.innerHeight < window.innerWidth;
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ===============================================
// INICIALIZACIÓN OPTIMIZADA
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Barbershop Elite - Inicializando sistema responsive...');
    
    // Detectar breakpoint inicial
    detectBreakpoint();
    
    // Configurar sistema
    initializeSlides();
    setupEmployeeSelection();
    setupServiceSelection();
    setupIndicatorNavigation();
    setupTouchGestures();
    setupKeyboardNavigation();
    setupResponsiveFeatures();
    setupAccessibility();
    
    // Event listeners
    setupEventListeners();
    
    // Optimizaciones de rendimiento
    setupPerformanceOptimizations();
    
    console.log('✅ Sistema responsive inicializado correctamente');
});

// ===============================================
// DETECCIÓN RESPONSIVE
// ===============================================
function detectBreakpoint() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width <= 480) {
        responsiveBreakpoint = 'mobile-small';
    } else if (width <= 768) {
        responsiveBreakpoint = 'mobile';
    } else if (width <= 1024) {
        responsiveBreakpoint = 'tablet';
    } else {
        responsiveBreakpoint = 'desktop';
    }
    
    // Aplicar clases específicas
    document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
    document.body.classList.add(`breakpoint-${responsiveBreakpoint}`);
    
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
    
    if (isLandscape() && height < 500) {
        document.body.classList.add('landscape-mobile');
    } else {
        document.body.classList.remove('landscape-mobile');
    }
    
    console.log(`📱 Breakpoint detectado: ${responsiveBreakpoint}`);
}

// ===============================================
// CONFIGURACIÓN DE SLIDES RESPONSIVE
// ===============================================
function initializeSlides() {
    updateSlideVisibility();
    updateNavigationButtons();
    updateIndicators();
    
    // Configurar altura dinámica en móviles
    if (isMobile()) {
        adjustMobileViewport();
    }
    
    // Configurar transiciones optimizadas
    setupTransitions();
}

function adjustMobileViewport() {
    // Ajustar altura en móviles para evitar problemas con la barra de direcciones
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
}

function setupTransitions() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.style.willChange = 'transform, opacity';
        
        // Configurar transiciones según el dispositivo
        if (isMobile() && 'ontouchstart' in window) {
            slide.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });
}

// ===============================================
// NAVEGACIÓN DE SLIDES MEJORADA
// ===============================================
function nextSlide() {
    if (isTransitioning) return;
    
    // Validación específica por slide
    if (!validateSlideProgression()) return;
    
    if (currentSlide < totalSlides - 1) {
        isTransitioning = true;
        currentSlide++;
        
        // Logging para debugging
        console.log(`➡️ Avanzando a slide ${currentSlide + 1}/${totalSlides}`);
        
        updateSlideVisibility();
        updateNavigationButtons();
        updateIndicators();
        
        // Acciones específicas por slide
        handleSlideSpecificActions();
        
        // Liberar transición después de completarla
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
        
        // Anunciar cambio para lectores de pantalla
        announceSlideChange();
    }
}

function previousSlide() {
    if (isTransitioning || currentSlide === 0) return;
    
    isTransitioning = true;
    currentSlide--;
    
    console.log(`⬅️ Retrocediendo a slide ${currentSlide + 1}/${totalSlides}`);
    
    updateSlideVisibility();
    updateNavigationButtons();
    updateIndicators();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
    
    announceSlideChange();
}

function goToSlide(slideNumber) {
    if (isTransitioning || slideNumber === currentSlide || slideNumber < 0 || slideNumber >= totalSlides) {
        return;
    }
    
    // Validar que se puede acceder al slide
    if (slideNumber > currentSlide && !canAdvanceToSlide(slideNumber)) {
        showFeedback('Completa los pasos anteriores primero', 'warning');
        return;
    }
    
    isTransitioning = true;
    const previousSlide = currentSlide;
    currentSlide = slideNumber;
    
    console.log(`🎯 Navegando directamente a slide ${currentSlide + 1}/${totalSlides}`);
    
    updateSlideVisibility();
    updateNavigationButtons();
    updateIndicators();
    
    handleSlideSpecificActions();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
    
    announceSlideChange();
}

// ===============================================
// ACTUALIZACIÓN DE INTERFAZ RESPONSIVE
// ===============================================
function updateSlideVisibility() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        
        if (index === currentSlide) {
            slide.classList.add('active');
            slide.setAttribute('aria-hidden', 'false');
            
            // Enfocar el primer elemento interactivo en dispositivos táctiles
            if (isTouchDevice()) {
                const focusableElement = slide.querySelector('button, [tabindex="0"]');
                if (focusableElement && !isMobile()) {
                    setTimeout(() => focusableElement.focus(), 300);
                }
            }
        } else {
            slide.setAttribute('aria-hidden', 'true');
            
            if (index < currentSlide) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        }
    });
    
    // Actualizar atributos ARIA
    updateAriaAttributes();
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
        prevBtn.setAttribute('aria-disabled', currentSlide === 0);
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides - 1;
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        nextBtn.setAttribute('aria-disabled', currentSlide === totalSlides - 1);
    }
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        
        if (index === currentSlide) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'step');
        } else {
            indicator.removeAttribute('aria-current');
            
            if (index < currentSlide) {
                indicator.classList.add('completed');
            }
        }
    });
}

// ===============================================
// SELECCIÓN DE EMPLEADOS OPTIMIZADA
// ===============================================
function setupEmployeeSelection() {
    const employeeCards = document.querySelectorAll('.employee-card');
    
    employeeCards.forEach((card, index) => {
        // Click/Touch events
        card.addEventListener('click', (e) => {
            e.preventDefault();
            selectEmployee(card);
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectEmployee(card);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextCard = employeeCards[Math.min(index + 1, employeeCards.length - 1)];
                nextCard.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevCard = employeeCards[Math.max(index - 1, 0)];
                prevCard.focus();
            }
        });
        
        // Hover effects optimizados
        if (!isTouchDevice()) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = '';
                }
            });
        }
        
        // Accessibility
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-describedby', `employee-${card.dataset.employee}-description`);
    });
}

function selectEmployee(card) {
    // Feedback háptico en dispositivos compatibles
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
    
    // Remover selección anterior
    document.querySelectorAll('.employee-card').forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-selected', 'false');
        if (!isTouchDevice()) {
            c.style.transform = '';
        }
    });
    
    // Seleccionar nuevo empleado
    card.classList.add('selected');
    card.setAttribute('aria-selected', 'true');
    card.style.transform = 'translateY(-5px)';
    
    // Actualizar variables
    selectedEmployee = card.dataset.employee;
    selectedEmployeeName = card.dataset.name;
    
    // Actualizar UI
    updateEmployeeSelection();
    
    // Feedback visual mejorado
    showSelectionFeedback(card, 'employee');
    
    // Auto-avanzar con delay apropiado según dispositivo
    const delay = isMobile() ? 1000 : 800;
    setTimeout(() => {
        if (selectedEmployee) { // Verificar que la selección sigue activa
            nextSlide();
        }
    }, delay);
    
    // Mostrar confirmación
    showFeedback(`Barbero seleccionado: ${selectedEmployeeName}`, 'success');
    
    // Anunciar selección para lectores de pantalla
    announceSelection('employee', selectedEmployeeName);
}

function updateEmployeeSelection() {
    const selectedEmployeeElement = document.getElementById('selected-barber-name');
    const summaryElement = document.getElementById('summary-barber');
    const finalElement = document.getElementById('final-barber');
    
    const displayName = selectedEmployeeName || 'Ninguno';
    
    if (selectedEmployeeElement) {
        selectedEmployeeElement.textContent = displayName;
    }
    if (summaryElement) {
        summaryElement.textContent = displayName;
    }
    if (finalElement) {
        finalElement.textContent = displayName;
    }
}

// ===============================================
// SELECCIÓN DE SERVICIOS OPTIMIZADA
// =============================================== 
function setupServiceSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Click/Touch events
        card.addEventListener('click', (e) => {
            e.preventDefault();
            selectService(card);
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectService(card);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextCard = serviceCards[Math.min(index + 1, serviceCards.length - 1)];
                nextCard.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevCard = serviceCards[Math.max(index - 1, 0)];
                prevCard.focus();
            }
        });
        
        // Hover effects
        if (!isTouchDevice()) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('selected')) {
                    card.style.transform = '';
                }
            });
        }
        
        // Accessibility
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-describedby', `service-${card.dataset.service}-description`);
    });
}

function selectService(card) {
    // Feedback háptico
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
    
    // Remover selección anterior
    document.querySelectorAll('.service-card').forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-selected', 'false');
        if (!isTouchDevice()) {
            c.style.transform = '';
        }
    });
    
    // Seleccionar nuevo servicio
    card.classList.add('selected');
    card.setAttribute('aria-selected', 'true');
    card.style.transform = 'translateY(-5px)';
    
    // Actualizar variables
    selectedService = card.dataset.service;
    selectedServiceName = card.dataset.name;
    selectedServicePrice = parseInt(card.dataset.price) || 0;
    
    // Actualizar UI
    updateServiceSelection();
    
    // Feedback visual
    showSelectionFeedback(card, 'service');
    
    // Auto-avanzar
    const delay = isMobile() ? 1000 : 800;
    setTimeout(() => {
        if (selectedService) {
            nextSlide();
        }
    }, delay);
    
    // Mostrar confirmación
    const priceText = selectedServicePrice ? ` - $${selectedServicePrice.toLocaleString()}` : '';
    showFeedback(`Servicio seleccionado: ${selectedServiceName}${priceText}`, 'success');
    
    // Anunciar selección
    announceSelection('service', selectedServiceName);
}

function updateServiceSelection() {
    const selectedServiceElement = document.getElementById('selected-service-name');
    const summaryElement = document.getElementById('summary-service');
    const finalElement = document.getElementById('final-service');
    
    const displayName = selectedServiceName || 'Ninguno';
    
    if (selectedServiceElement) {
        selectedServiceElement.textContent = displayName;
    }
    if (summaryElement) {
        summaryElement.textContent = displayName;
    }
    if (finalElement) {
        finalElement.textContent = displayName;
    }
}

// ===============================================
// GESTOS TÁCTILES OPTIMIZADOS
// ===============================================
function setupTouchGestures() {
    if (!isTouchDevice()) return;
    
    const slidesContainer = document.querySelector('.slides-container');
    if (!slidesContainer) return;
    
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isVerticalScroll = false;
    
    slidesContainer.addEventListener('touchstart', (e) => {
        if (isTransitioning) return;
        
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        isVerticalScroll = false;
        
        touchStartX = startX;
    }, { passive: true });
    
    slidesContainer.addEventListener('touchmove', (e) => {
        if (isTransitioning) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // Detectar si es scroll vertical
        if (diffY > diffX && diffY > 10) {
            isVerticalScroll = true;
            return;
        }
        
        // Prevenir scroll horizontal si es swipe
        if (diffX > 10 && !isVerticalScroll) {
            e.preventDefault();
        }
    }, { passive: false });
    
    slidesContainer.addEventListener('touchend', (e) => {
        if (isTransitioning || isVerticalScroll) return;
        
        touchEndX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(startY - endY);
        const timeDiff = endTime - startTime;
        const velocity = Math.abs(diffX) / timeDiff;
        
        // Validar swipe (mínimo 30px, máximo 100px vertical, velocidad mínima)
        if (Math.abs(diffX) > 30 && diffY < 100 && velocity > 0.1) {
            if (diffX > 0 && currentSlide < totalSlides - 1) {
                // Swipe izquierda - siguiente
                nextSlide();
            } else if (diffX < 0 && currentSlide > 0) {
                // Swipe derecha - anterior
                previousSlide();
            }
        }
    }, { passive: true });
}

// ===============================================
// NAVEGACIÓN POR TECLADO MEJORADA
// ===============================================
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Ignorar si está escribiendo en un input
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            return;
        }
        
        // Ignorar si hay modificadores (excepto en algunos casos específicos)
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        
        switch (e.key) {
            case 'ArrowRight':
            case 'Space':
                e.preventDefault();
                nextSlide();
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                break;
                
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
                
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
                
            case 'Escape':
                e.preventDefault();
                if (document.getElementById('confirmation-overlay').classList.contains('confirmation-show')) {
                    closeConfirmation();
                } else if (currentSlide === totalSlides - 1) {
                    resetSelections();
                }
                break;
                
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                if (!e.shiftKey) {
                    e.preventDefault();
                    const slideNum = parseInt(e.key) - 1;
                    if (slideNum >= 0 && slideNum < totalSlides) {
                        goToSlide(slideNum);
                    }
                }
                break;
        }
    });
}

// ===============================================
// INDICADORES DE NAVEGACIÓN
// ===============================================
function setupIndicatorNavigation() {
    const indicators = document.querySelectorAll('.indicator');
    
    indicators.forEach((indicator, index) => {
        // Click/Touch navigation
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
        
        // Keyboard navigation
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndicator = indicators[Math.min(index + 1, indicators.length - 1)];
                nextIndicator.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndicator = indicators[Math.max(index - 1, 0)];
                prevIndicator.focus();
            }
        });
        
        // Accessibility
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
}

// ===============================================
// CARACTERÍSTICAS RESPONSIVE
// ===============================================
function setupResponsiveFeatures() {
    // Listener para cambios de tamaño/orientación
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            detectBreakpoint();
            handleResponsiveChanges();
        }, 250);
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            detectBreakpoint();
            handleResponsiveChanges();
            if (isMobile()) {
                adjustMobileViewport();
            }
        }, 100);
    });
}

function handleResponsiveChanges() {
    console.log(`📱 Cambio de breakpoint: ${responsiveBreakpoint}`);
    
    // Reajustar elementos según el nuevo breakpoint
    adjustElementsForBreakpoint();
    
    // Reconfigurar interacciones
    if (isTouchDevice() !== document.body.classList.contains('touch-device')) {
        location.reload(); // Recargar si cambió el tipo de dispositivo
    }
}

function adjustElementsForBreakpoint() {
    const cards = document.querySelectorAll('.employee-card, .service-card');
    
    if (responsiveBreakpoint ===
