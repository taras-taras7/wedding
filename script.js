// ⚠️ ВСТАВЬТЕ СВОЙ URL ВЕБ-ПРИЛОЖЕНИЯ GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVNDyyO04aAfBkDwaggTMvmk_yGpl4jlx4KIW7dYONxoxY6Q0WKLvwJ9P4DbHQX0oelw/exec';

// ---------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ----------------------
function setSafeAreaVariables() {
    const root = document.documentElement;
    const safeAreaTop = getComputedStyle(root).getPropertyValue('--safe-area-top') || '0px';
    root.style.setProperty('--computed-safe-area-top', safeAreaTop);
}

function updateCountdown() {
    const weddingDate = new Date('2026-09-05T15:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (document.getElementById('days')) document.getElementById('days').textContent = days.toString().padStart(3, '0');
    if (document.getElementById('hours')) document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    if (document.getElementById('minutes')) document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');

    if (distance < 0) {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) countdownElement.innerHTML = '<div class="countdown-item"><span class="countdown-number">🎉</span><span class="countdown-label">Свадьба сегодня!</span></div>';
    }
}

function createLemonAnimation() {
    const container = document.getElementById('lemon-animation');
    if (!container) return;
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

// ---------------------- ОТПРАВКА В GOOGLE TABLES ----------------------
async function submitToGoogleSheets(formData) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        return result.result === 'success';
    } catch (error) {
        console.error('Ошибка отправки:', error);
        return false;
    }
}

// ---------------------- ОБРАБОТКА ФОРМЫ ----------------------
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            guests: document.getElementById('guests').value,
            accommodation: document.getElementById('accommodation').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString('ru-RU')
        };

        // Резервное копирование в localStorage
        try {
            const responses = JSON.parse(localStorage.getItem('weddingRSVP') || '[]');
            responses.push(formData);
            localStorage.setItem('weddingRSVP', JSON.stringify(responses));
        } catch (err) { console.log('localStorage error:', err); }

        const success = await submitToGoogleSheets(formData);
        if (success) {
            alert('Ждём вас на нашей свадьбе!');
            form.reset();
        } else {
            alert('Данные сохранены локально. Мы свяжемся с вами позже.');
        }
    });
}

// ---------------------- ПЛАВНАЯ ПРОКРУТКА ----------------------
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
                const isMobile = window.innerWidth <= 768;
                const offsetTop = target.offsetTop - navHeight - (isMobile ? 30 : 20);
                window.scrollTo({ top: Math.max(offsetTop, 0), behavior: 'smooth' });
            }
        });
    });
}

function setHeroPadding() {
    const nav = document.querySelector('.main-nav');
    const hero = document.querySelector('.hero');
    if (nav && hero) {
        const navHeight = nav.offsetHeight;
        const isMobile = window.innerWidth <= 768;
        const paddingTop = isMobile ? navHeight + 20 : navHeight + 10;
        hero.style.paddingTop = `calc(${paddingTop}px + var(--safe-area-top))`;
    }
}

function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        const container = document.getElementById('lemon-animation');
        if (container && container.children.length > 20) {
            for (let i = 20; i < container.children.length; i++) container.removeChild(container.children[i]);
        }
    }
}

// Заглушка для музыкального плеера (если не используется)
function initMusicPlayer() {}

// ---------------------- ЗАПУСК ПРИ ЗАГРУЗКЕ ----------------------
document.addEventListener('DOMContentLoaded', function () {
    setSafeAreaVariables();
    updateCountdown();
    createLemonAnimation();
    initMusicPlayer();    // теперь ошибки не будет
    initRSVPForm();
    initSmoothScroll();
    setHeroPadding();
    optimizeForMobile();

    window.addEventListener('resize', () => {
        setSafeAreaVariables();
        setHeroPadding();
        optimizeForMobile();
    });
    window.addEventListener('load', () => {
        setSafeAreaVariables();
        setHeroPadding();
    });
    window.addEventListener('orientationchange', () => setTimeout(() => {
        setSafeAreaVariables();
        setHeroPadding();
        optimizeForMobile();
    }, 300));

    setInterval(updateCountdown, 60000);
});

// Определение поддержки safe-area
if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
    document.documentElement.classList.add('safe-area-supported');
} else {
    document.documentElement.classList.add('safe-area-not-supported');
}
