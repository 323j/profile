// features.js - الميزات الجديدة للإصدار 11.0

// 1. مؤشر إكمال الملف الشخصي
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
            localStorage.setItem('completionAchievement', 'true');
        }
    }

    window.addEventListener('scroll', updateProfileCompletion);
    window.addEventListener('load', updateProfileCompletion);
}

// 2. قسم المشاريع
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
    
    // إضافة قسم المشاريع قبل قسم المهارات
    const skillsSection = document.querySelector('.skills');
    skillsSection.insertAdjacentHTML('beforebegin', projectsHTML);

    // تهيئة Swiper للمشاريع
    new Swiper('.projects-swiper', {
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
        }
    });
}

// 3. قسم التقييمات
function initTestimonialsSection() {
    const testimonialsHTML = `
    <div class="card testimonials animate-on-scroll" id="testimonials">
        <h2><i class="fas fa-star"></i> تقييمات العملاء</h2>
        <div class="swiper testimonials-swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="testimonial-card">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="عميل 1">
                        <div class="stars">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                        </div>
                        <p>"أحمد محترف جدًا في عمله، أنجز المشروع قبل الموعد المحدد وبجودة عالية."</p>
                        <h4>- محمد علي</h4>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="testimonial-card">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="عميل 2">
                        <div class="stars">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <p>"سعيد جدًا بالتعامل مع أحمد، يقدم حلولاً إبداعية واحترافية."</p>
                        <h4>- سارة أحمد</h4>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
    `;
    
    // إضافة قسم التقييمات بعد قسم المشاريع
    const projectsSection = document.getElementById('projects');
    projectsSection.insertAdjacentHTML('afterend', testimonialsHTML);

    // تهيئة Swiper للتقييمات
    new Swiper('.testimonials-swiper', {
        loop: true,
        pagination: {
            el: '.testimonials-swiper .swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
        },
    });
}

// 4. قسم المدونة
function initBlogSection() {
    const blogHTML = `
    <div class="card blog animate-on-scroll" id="blog">
        <h2><i class="fas fa-pen"></i> أحدث المقالات</h2>
        <div class="blog-list">
            <div class="blog-item">
                <h3>كيفية إنشاء موقع شخصي مميز</h3>
                <p class="blog-date">10 يناير 2024</p>
                <p>دليل شامل لإنشاء موقع شخصي يعرض مهاراتك ويبرز إنجازاتك.</p>
                <a href="#" class="read-more">قراءة المزيد <i class="fas fa-arrow-left"></i></a>
            </div>
            <div class="blog-item">
                <h3>أفضل أدوات تطوير الويب في 2024</h3>
                <p class="blog-date">5 يناير 2024</p>
                <p>تعرف على أحدث الأدوات والمكتبات التي ستساعدك في تطوير الويب.</p>
                <a href="#" class="read-more">قراءة المزيد <i class="fas fa-arrow-left"></i></a>
            </div>
        </div>
        <a href="#" class="view-all">عرض جميع المقالات <i class="fas fa-arrow-left"></i></a>
    </div>
    `;
    
    // إضافة قسم المدونة بعد قسم التقييمات
    const testimonialsSection = document.getElementById('testimonials');
    testimonialsSection.insertAdjacentHTML('afterend', blogHTML);
}

// 5. نموذج الاتصال و QR Code
function initContactSection() {
    const contactHTML = `
    <div class="card contact animate-on-scroll" id="contact">
        <h2><i class="fas fa-envelope"></i> تواصل معي</h2>
        <form class="contact-form" id="contact-form">
            <input type="text" name="name" placeholder="اسمك" required>
            <input type="email" name="email" placeholder="بريدك الإلكتروني" required>
            <textarea name="message" placeholder="رسالتك" rows="4" required></textarea>
            <button type="submit">إرسال الرسالة</button>
        </form>
        
        <div class="qrcode-container">
            <h3><i class="fas fa-qrcode"></i> شارك ملفي الشخصي</h3>
            <div id="qrcode"></div>
            <p>مسح الكود لمشاركة الموقع</p>
        </div>
    </div>
    `;
    
    // إضافة قسم الاتصال في نهاية المحتوى
    const container = document.querySelector('.container');
    container.insertAdjacentHTML('beforeend', contactHTML);

    // تهيئة نموذج الاتصال
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('شكرًا لك! سنرد على رسالتك قريبًا.', 'var(--primary-color)');
        this.reset();
    });

    // توليد QR Code
    if (typeof QRCode !== 'undefined') {
        new QRCode(document.getElementById('qrcode'), {
            text: window.location.href,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// 6. تبديل اللغة
function initLanguageSwitcher() {
    const languageHTML = `
    <div class="language-switcher">
        <button class="language-btn" id="language-btn">
            <i class="fas fa-language"></i>
            <span id="language-text">English</span>
        </button>
    </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', languageHTML);

    const languageBtn = document.getElementById('language-btn');
    const languageText = document.getElementById('language-text');
    let currentLanguage = 'ar';

    languageBtn.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
        languageText.textContent = currentLanguage === 'ar' ? 'English' : 'العربية';
        showNotification(currentLanguage === 'ar' ? 'تم التبديل إلى العربية' : 'Switched to English');
    });
}

// 7. تأثيرات الحركة
function initAnimations() {
    function checkScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
}

// دالة مساعدة لعرض الإشعارات
function showNotification(message, bgColor = 'var(--edit-color)') {
    const notification = document.createElement('div');
    notification.className = 'card';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    notification.style.padding = '15px';
    notification.style.backgroundColor = bgColor;
    notification.style.color = 'white';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// تهيئة جميع الميزات
function initAllFeatures() {
    initProfileCompletion();
    initProjectsSection();
    initTestimonialsSection();
    initBlogSection();
    initContactSection();
    initLanguageSwitcher();
    initAnimations();
}

// تهيئة الميزات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initAllFeatures);
