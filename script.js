// Установка CSS переменных для safe-area
function setSafeAreaVariables() {
    const root = document.documentElement;
    const safeAreaTop = getComputedStyle(root).getPropertyValue('--safe-area-top') || '0px';
    root.style.setProperty('--computed-safe-area-top', safeAreaTop);
}

// Счетчик обратного времени
function updateCountdown() {
    const weddingDate = new Date('2026-09-05T15:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (document.getElementById('days')) {
        document.getElementById('days').textContent = days.toString().padStart(3, '0');
    }
    if (document.getElementById('hours')) {
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    }
    if (document.getElementById('minutes')) {
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    }

    if (distance < 0) {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.innerHTML = '<div class="countdown-item"><span class="countdown-number">🎉</span><span class="countdown-label">Свадьба сегодня!</span></div>';
        }
    }
}

// Создание анимированных лимонов
function createLemonAnimation() {
    const container = document.getElementById('lemon-animation');
    if (!container) return;

    // Очищаем существующие лимоны
    container.innerHTML = '';

    for (let i = 0; i < 40; i++) {
        const lemon = document.createElement('div');
        lemon.className = 'lemon';

        lemon.style.left = Math.random() * 100 + '%';
        lemon.style.top = Math.random() * 100 + '%';
        lemon.style.animationDelay = (Math.random() * 8) + 's';
        lemon.style.animationDuration = (8 + Math.random() * 8) + 's';

        const size = 40 + Math.random() * 40;
        lemon.style.width = size + 'px';
        lemon.style.height = size + 'px';
        lemon.style.opacity = 0.15 + Math.random() * 0.1;

        container.appendChild(lemon);
    }
}

// Обработка формы RSVP
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            guests: document.getElementById('guests').value,
            accommodation: document.getElementById('accommodation').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString('ru-RU')
        };

        try {
            const responses = JSON.parse(localStorage.getItem('weddingRSVP') || '[]');
            responses.push(formData);
            localStorage.setItem('weddingRSVP', JSON.stringify(responses));
        } catch (error) {
            console.log('Ошибка сохранения:', error);
        }

        sendEmailNotification(formData);

        alert(`Спасибо, ${formData.name}! Ваше присутствие подтверждено. Ждем вас на свадьбе!`);
        this.reset();
    });
}

// Отправка уведомления на email
function sendEmailNotification(formData) {
    const subject = 'Новый ответ на приглашение на свадьбу';
    const body = `
Имя: ${formData.name}
Количество гостей: ${formData.guests}
Размещение в Саратове: ${formData.accommodation === 'yes' ? 'Да' : 'Нет, нужна помощь'}
Сообщение: ${formData.message || 'Нет'}
Время отправки: ${formData.timestamp}
    `.trim();

    const mailtoLink = `mailto:taras.margarita.wedding@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// Плавная прокрутка для навигации
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const nav = document.querySelector('.main-nav');
                const navHeight = nav ? nav.offsetHeight : 0;
                
                // Увеличиваем отступ для мобильных устройств
                const isMobile = window.innerWidth <= 768;
                const additionalOffset = isMobile ? 30 : 20;
                
                const offsetTop = target.offsetTop - navHeight - additionalOffset;
                
                window.scrollTo({
                    top: Math.max(offsetTop, 0),
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Динамическое определение высоты навигации
function setHeroPadding() {
    const nav = document.querySelector('.main-nav');
    const hero = document.querySelector('.hero');
    
    if (nav && hero) {
        const navHeight = nav.offsetHeight;
        const isMobile = window.innerWidth <= 768;
        const paddingTop = isMobile ? (navHeight + 20) + 'px' : (navHeight + 10) + 'px';
        
        hero.style.paddingTop = `calc(${paddingTop} + var(--safe-area-top))`;
    }
}

// Оптимизация для мобильных устройств
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Уменьшаем количество лимонов на мобильных
        const container = document.getElementById('lemon-animation');
        if (container) {
            const lemons = container.querySelectorAll('.lemon');
            if (lemons.length > 20) {
                for (let i = 20; i < lemons.length; i++) {
                    container.removeChild(lemons[i]);
                }
            }
        }
    }
}

// Основная инициализация
document.addEventListener('DOMContentLoaded', function () {
    setSafeAreaVariables();
    updateCountdown();
    createLemonAnimation();
    initMusicPlayer();
    initRSVPForm();
    initSmoothScroll();
    setHeroPadding();
    optimizeForMobile();

    // Обработчики событий
    window.addEventListener('resize', function() {
        setSafeAreaVariables();
        setHeroPadding();
        optimizeForMobile();
    });
    
    window.addEventListener('load', function() {
        setSafeAreaVariables();
        setHeroPadding();
    });
    
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            setSafeAreaVariables();
            setHeroPadding();
            optimizeForMobile();
        }, 300);
    });

    // Обновление счетчика каждую минуту
    setInterval(updateCountdown, 60000);
});

// Fallback для safe-area
if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
    document.documentElement.classList.add('safe-area-supported');
} else {
    document.documentElement.classList.add('safe-area-not-supported');
}
