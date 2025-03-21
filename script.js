document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Слайдер портфолио
    const slider = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slider && slides.length > 0) {
        let currentSlide = 0;
        const slidesPerView = window.innerWidth <= 768 ? 1 : 3;
        const totalSlides = slides.length;

        // Создаем точки навигации
        for (let i = 0; i < Math.ceil(totalSlides / slidesPerView); i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i * slidesPerView));
            dotsContainer.appendChild(dot);
        }

        // Устанавливаем начальную ширину слайдов
        slides.forEach(slide => {
            slide.style.minWidth = `${100 / slidesPerView}%`;
        });

        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === Math.floor(currentSlide / slidesPerView)) {
                    dot.classList.add('active');
                }
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) {
                currentSlide = totalSlides - slidesPerView;
            } else if (currentSlide > totalSlides - slidesPerView) {
                currentSlide = 0;
            }
            
            const offset = -(currentSlide * (100 / slidesPerView));
            slider.style.transform = `translateX(${offset}%)`;
            updateDots();
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                goToSlide(currentSlide - slidesPerView);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                goToSlide(currentSlide + slidesPerView);
            });
        }

        // Автоматическая прокрутка слайдера
        let slideInterval = setInterval(() => {
            goToSlide(currentSlide + slidesPerView);
        }, 5000);

        // Остановка автопрокрутки при наведении
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    goToSlide(currentSlide + slidesPerView);
                }, 5000);
            });
        }

        // Обработка свайпов для мобильных устройств
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        slider.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', () => {
            const swipeDistance = touchStartX - touchEndX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    goToSlide(currentSlide + slidesPerView);
                } else {
                    goToSlide(currentSlide - slidesPerView);
                }
            }
        });
    }

    // Плавная прокрутка к секциям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация появления элементов при скролле
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .contact-item, .legal-info').forEach(el => {
            observer.observe(el);
        });
    }

    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesPerView = window.innerWidth <= 768 ? 1 : 3;
            if (newSlidesPerView !== slidesPerView) {
                location.reload();
            }
        }, 250);
    });

    // Инициализация карты
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        const iframe = mapContainer.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', () => {
                mapContainer.classList.add('map-loaded');
            });

            iframe.addEventListener('error', () => {
                mapContainer.innerHTML = `
                    <div class="map-error">
                        <p>Не удалось загрузить карту. Пожалуйста, попробуйте позже.</p>
                        <a href="https://yandex.ru/maps/org/peskostruynaya_obrabotka/216883567935" target="_blank" class="map-error-link">
                            Открыть карту в Яндекс.Картах
                        </a>
                    </div>
                `;
            });
        }
    }
});

// Функция копирования email
function copyEmailToClipboard(event) {
    event.preventDefault();
    const email = 'sandblasting-lnc@yandex.ru';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            const emailElement = event.target;
            const originalText = emailElement.textContent;
            emailElement.textContent = 'Email скопирован!';
            setTimeout(() => {
                emailElement.textContent = originalText;
            }, 2000);
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = email;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                const emailElement = event.target;
                const originalText = emailElement.textContent;
                emailElement.textContent = 'Email скопирован!';
                setTimeout(() => {
                    emailElement.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error('Ошибка при копировании:', err);
            }
            document.body.removeChild(textarea);
        });
    }
} 