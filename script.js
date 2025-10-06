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

    for (let i = 0; i < 50; i++) {
        const lemon = document.createElement('div');
        lemon.className = 'lemon';

        lemon.style.left = Math.random() * 100 + '%';
        lemon.style.top = Math.random() * 100 + '%';
        lemon.style.animationDelay = (Math.random() * 8) + 's';
        lemon.style.animationDuration = (8 + Math.random() * 8) + 's';

        const size = 60 + Math.random() * 30;
        lemon.style.width = size + 'px';
        lemon.style.height = size + 'px';
        lemon.style.opacity = 0.15 + Math.random() * 0.1;

        container.appendChild(lemon);
    }
}

// Управление музыкой
function initMusicPlayer() {
    const music = document.getElementById('background-music');
    const toggleBtn = document.getElementById('music-toggle');

    if (!music || !toggleBtn) return;

    let isPlaying = false;

    const playMusic = () => {
        music.volume = 0.3;
        music.play().then(() => {
            isPlaying = true;
            toggleBtn.textContent = '🔊';
            toggleBtn.style.background = 'rgba(143, 188, 143, 0.9)';
        }).catch(error => {
            toggleBtn.textContent = '🎵';
            isPlaying = false;
        });
    };

    playMusic();

    document.addEventListener('click', function initOnClick() {
        if (!isPlaying) {
            playMusic();
        }
        document.removeEventListener('click', initOnClick);
    });

    toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();

        if (isPlaying) {
            music.pause();
            toggleBtn.textContent = '🎵';
            toggleBtn.style.background = 'rgba(45, 80, 22, 0.9)';
        } else {
            music.play().then(() => {
                toggleBtn.textContent = '🔊';
                toggleBtn.style.background = 'rgba(143, 188, 143, 0.9)';
            });
        }
        isPlaying = !isPlaying;
    });
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
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const offsetTop = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: offsetTop,
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
        hero.style.paddingTop = (navHeight + 10) + 'px';
    }
}

// Основная инициализация
document.addEventListener('DOMContentLoaded', function () {
    updateCountdown();
    createLemonAnimation();
    initMusicPlayer();
    initRSVPForm();
    initSmoothScroll();
    setHeroPadding();

    window.addEventListener('resize', setHeroPadding);
    window.addEventListener('load', setHeroPadding);

    setInterval(updateCountdown, 60000);
});