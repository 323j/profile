// enhanced-features.js - الميزات المحسنة مع الصوت والموسيقى

// 1. تهيئة الأصوات
const sounds = {
    hover: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-hover-click-notification-358.mp3'),
    click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
    navigation: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arrow-whoosh-1491.mp3'),
    success: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'),
    music: new Audio('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3')
};

// تعطيل التشغيل التلقائي للموسيقى
sounds.music.loop = true;
sounds.music.volume = 0.3;

// 2. زر تشغيل الموسيقى
function initMusicPlayer() {
    const musicPlayerHTML = `
    <div class="music-player">
        <button id="music-toggle" class="music-btn">
            <i class="fas fa-music"></i>
            <span id="music-status">تشغيل الموسيقى</span>
        </button>
        <div class="volume-control">
            <i class="fas fa-volume-down"></i>
            <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.3">
            <i class="fas fa-volume-up"></i>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', musicPlayerHTML);

    const musicToggle = document.getElementById('music-toggle');
    const musicStatus = document.getElementById('music-status');
    const volumeControl = document.getElementById('music-volume');
    let isMusicPlaying = false;

    // تحكم في تشغيل/إيقاف الموسيقى
    musicToggle.addEventListener('click', () => {
        sounds.click.play();
        if (isMusicPlaying) {
            sounds.music.pause();
            musicStatus.textContent = 'تشغيل الموسيقى';
            musicToggle.innerHTML = '<i class="fas fa-music"></i> تشغيل الموسيقى';
        } else {
            sounds.music.play();
            musicStatus.textContent = 'إيقاف الموسيقى';
            musicToggle.innerHTML = '<i class="fas fa-pause"></i> إيقاف الموسيقى';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // تحكم في مستوى الصوت
    volumeControl.addEventListener('input', () => {
        sounds.music.volume = volumeControl.value;
    });
}

// 3. تأثيرات صوتية للتنقل
function initNavigationSounds() {
    // تأثيرات لأزرار التنقل
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            sounds.hover.currentTime = 0;
            sounds.hover.play();
        });
        
        element.addEventListener('click', () => {
            sounds.click.currentTime = 0;
            sounds.click.play();
        });
    });

    // تأثير صوتي عند التمرير
    let lastScrollPosition = 0;
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        if (Math.abs(currentScrollPosition - lastScrollPosition) > 50) {
            sounds.navigation.currentTime = 0;
            sounds.navigation.volume = 0.3;
            sounds.navigation.play();
            lastScrollPosition = currentScrollPosition;
        }
    });
}

// 4. مؤشر إكمال الملف الشخصي مع تأثير صوتي
function initProfileCompletion() {
    const completionContainer = document.createElement('div');
    completionContainer.className = 'completion-container animate__animated animate__fadeInDown';
    completionContainer.innerHTML = `
        <div class="completion-header">
            <span>إكمال الملف الشخصي</span>
            <span id="completion-text">0% مكتمل</span>
        </div>
        <div class="completion-bar">
            <div class="completion-progress" id="completion-bar"></div>
        </div>
    `;
    
    document.querySelector('.container').prepend(completionContainer);

    function updateProfileCompletion() {
        const sections = document.querySelectorAll('.card');
        const viewedSections = Array.from(sections).filter(section => {
            const rect = section.getBoundingClientRect();
            return rect.top < window.innerHeight - 100 && rect.bottom >= 100;
        }).length;

        const completionPercentage = Math.min(Math.round((viewedSections / sections.length) * 100), 100);
        document.getElementById('completion-bar').style.width = `${completionPercentage}%`;
        document.getElementById('completion-text').textContent = `${completionPercentage}% مكتمل`;

        if (completionPercentage >= 80 && !localStorage.getItem('completionAchievement')) {
            showNotification('رائع! لقد استعرضت معظم ملفي الشخصي 🎉', 'var(--edit-color)');
            sounds.success.play();
            localStorage.setItem('completionAchievement', 'true');
        }
    }

    window.addEventListener('scroll', updateProfileCompletion);
    window.addEventListener('load', updateProfileCompletion);
}

// 5. قسم المشاريع مع تأثيرات صوتية
function initProjectsSection() {
    const projectsHTML = `
    <div class="card projects animate-on-scroll" id="projects">
        <h2><i class="fas fa-code-branch"></i> مشاريعي</h2>
        <div class="swiper projects-swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="project-card">
                        <img src="https://via.placeholder.com/400x250" alt="مشروع 1">
                        <h3>موقع تجارة إلكترونية</h3>
                        <p>تقنيات المستخدمة: React, Node.js, MongoDB</p>
                        <a href="#" class="project-link">عرض المشروع</a>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="project-card">
                        <img src="https://via.placeholder.com/400x250" alt="مشروع 2">
                        <h3>تطبيق إدارة المهام</h3>
                        <p>تقنيات المستخدمة: Flutter, Firebase</p>
                        <a href="#" class="project-link">عرض المشروع</a>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
    `;
    
    const skillsSection = document.querySelector('.skills');
    skillsSection.insertAdjacentHTML('beforebegin', projectsHTML);

    const projectsSwiper = new Swiper('.projects-swiper', {
        loop: true,
        pagination: {
            el: '.projects-swiper .swiper-pagination',
            clickable: true,
        },
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
            768: {
                slidesPerView: 2,
            }
        },
        on: {
            slideChange: () => {
                sounds.navigation.currentTime = 0;
                sounds.navigation.play();
            }
        }
    });
}

// 6. تأثيرات صوتية للتنقل بين الأقسام
function initSectionNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                sounds.navigation.currentTime = 0;
                sounds.navigation.play();
                
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 200);
            }
        });
    });
}

// 7. تهيئة جميع الميزات
function initAllEnhancedFeatures() {
    initMusicPlayer();
    initNavigationSounds();
    initProfileCompletion();
    initProjectsSection();
    initSectionNavigation();
    
    // يمكنك استدعاء بقية الميزات هنا
    // initTestimonialsSection();
    // initBlogSection();
    // initContactSection();
    // initLanguageSwitcher();
    // initAnimations();
}

// تهيئة الميزات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initAllEnhancedFeatures);
