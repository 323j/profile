/**
 * ملف المميزات الإضافية - الإصدار v3
 * التعديلات الرئيسية:
 * 1- إصلاح مشاكل التناسق في الواجهة
 * 2- تحسين نظام المساعد الذكي
 * 3- مشغل موسيقى مخفي يظهر عند الطلب
 * 4- أوامر خفية متقدمة
 * 5- تحسينات في تجربة المستخدم
 */

// ====== تهيئة المتغيرات العامة ======
const APP = {
    settings: {
        musicPlayerVisible: false,
        hiddenCommands: {
            'الأسرار': 'showAllSecrets',
            'المطور': 'showDevInfo',
            'إعادة تحميل': 'refreshApp'
        }
    },
    music: {
        player: null,
        currentSong: 0,
        isPlaying: false,
        volume: 0.5,
        songs: [
            {
                title: "أغنية هادئة",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                cover: "https://via.placeholder.com/150"
            },
            {
                title: "أغنية سريعة",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                cover: "https://via.placeholder.com/150"
            }
        ]
    }
};

// ====== تنفيذ عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    // إصلاح مشاكل التناسق
    fixLayoutIssues();
    
    // تهيئة الأنظمة
    initMusicSystem();
    enhanceChatAI();
    
    // إشعار البدء
    showNotification('تم تحميل النظام بنجاح!', 'var(--success-color)');
});

// ====== إصلاح مشاكل التناسق ======
function fixLayoutIssues() {
    // إصلاح مساحة العناصر
    document.querySelectorAll('.card').forEach(card => {
        card.style.margin = '15px 0';
        card.style.padding = '20px';
    });
    
    // إصلاح رأس الصفحة
    const header = document.querySelector('.header');
    if (header) {
        header.style.flexDirection = 'row';
        header.style.alignItems = 'center';
    }
    
    // إصلاح تناسق النصوص
    document.querySelectorAll('body').forEach(el => {
        el.style.lineHeight = '1.6';
    });
    
    console.log('تم إصلاح مشاكل التناسق');
}

// ====== نظام الموسيقى المحسن ======
function initMusicSystem() {
    try {
        // إنشاء عناصر واجهة المستخدم المخفية
        createHiddenMusicUI();
        
        // تهيئة مشغل الصوت
        APP.music.player = new Audio();
        APP.music.player.volume = APP.music.volume;
        
        // تحميل أول أغنية
        loadSong(0);
        
        console.log('نظام الموسيقى جاهز (مخفي)');
    } catch (error) {
        console.error('خطأ في نظام الموسيقى:', error);
        showNotification('تعذر تحميل مشغل الموسيقى', 'var(--error-color)');
    }
}

function createHiddenMusicUI() {
    const musicUI = `
    <div class="hidden-music-player" id="music-player" style="display:none;">
        <div class="music-header">
            <h3><i class="fas fa-music"></i> مشغل الموسيقى</h3>
            <button id="close-music"><i class="fas fa-times"></i></button>
        </div>
        <div class="music-controls">
            <button id="prev-song"><i class="fas fa-step-backward"></i></button>
            <button id="play-pause"><i class="fas fa-play"></i></button>
            <button id="next-song"><i class="fas fa-step-forward"></i></button>
        </div>
        <div class="song-info">
            <img src="${APP.music.songs[0].cover}" id="music-cover">
            <div>
                <div id="music-title">${APP.music.songs[0].title}</div>
                <div class="progress-container">
                    <div class="progress-bar" id="music-progress"></div>
                </div>
                <div class="time-display">
                    <span id="current-time">00:00</span>
                    <span id="duration">00:00</span>
                </div>
            </div>
        </div>
        <div class="volume-control">
            <i class="fas fa-volume-down"></i>
            <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="${APP.music.volume}">
            <i class="fas fa-volume-up"></i>
        </div>
    </div>
    
    <button id="show-music-btn" class="floating-btn" style="display:none;">
        <i class="fas fa-music"></i>
    </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', musicUI);
    
    // أحداث المشغل
    document.getElementById('play-pause').addEventListener('click', togglePlay);
    document.getElementById('prev-song').addEventListener('click', prevSong);
    document.getElementById('next-song').addEventListener('click', nextSong);
    document.getElementById('volume-slider').addEventListener('input', changeVolume);
    document.getElementById('close-music').addEventListener('click', hideMusicPlayer);
    document.getElementById('show-music-btn').addEventListener('click', showMusicPlayer);
}

function showMusicPlayer() {
    const player = document.getElementById('music-player');
    player.style.display = 'block';
    player.style.position = 'fixed';
    player.style.bottom = '20px';
    player.style.right = '20px';
    player.style.zIndex = '1000';
    player.style.width = '300px';
    document.getElementById('show-music-btn').style.display = 'none';
}

function hideMusicPlayer() {
    document.getElementById('music-player').style.display = 'none';
    document.getElementById('show-music-btn').style.display = 'block';
}

// ... (بقية دوال نظام الموسيقى من الإصدار السابق)

// ====== المساعد الذكي المحسن ======
function enhanceChatAI() {
    try {
        // حفظ الدالة الأصلية
        const originalAI = window.getAIResponse || function() { return "المساعد غير متاح حالياً"; };
        
        // استبدال الدالة
        window.getAIResponse = function(message) {
            const lowerMsg = message.toLowerCase();
            
            // الأوامر الخاصة بالموسيقى
            if (/موسيقى|أغاني|تشغيل|music/.test(lowerMsg)) {
                toggleMusicCommand();
                return "تم تفعيل مشغل الموسيقى. يمكنك فتحه من الزر العائم في الأسفل";
            }
            
            // الأوامر الخفية
            for (const [cmd, action] of Object.entries(APP.settings.hiddenCommands)) {
                if (lowerMsg.includes(cmd.toLowerCase())) {
                    return executeHiddenCommand(action);
                }
            }
            
            // الرد العادي
            return originalAI(message);
        };
        
        console.log('تم تحميل المساعد الذكي المحسن');
    } catch (error) {
        console.error('خطأ في تحميل المساعد الذكي:', error);
    }
}

function toggleMusicCommand() {
    const btn = document.getElementById('show-music-btn');
    btn.style.display = 'block';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '1000';
    APP.settings.musicPlayerVisible = true;
}

function executeHiddenCommand(action) {
    switch(action) {
        case 'showAllSecrets':
            return `الأوامر الخفية المتاحة:
- "المطور": معلومات عن المطور
- "إعادة تحميل": تحديث الصفحة
- "الموسيقى": تفعيل مشغل الموسيقى`;
            
        case 'showDevInfo':
            return `معلومات المطور:
الاسم: أحمد
التخصص: تطوير الويب والتطبيقات
المهارات: JavaScript, Python, React, Node.js`;
            
        case 'refreshApp':
            setTimeout(() => location.reload(), 2000);
            return "جاري إعادة تحميل التطبيق...";
            
        default:
            return "أمر غير معروف";
    }
}

// ====== نظام الإشعارات ======
function showNotification(message, color = 'var(--primary-color)') {
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    notification.style.backgroundColor = color;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ====== حقن الأنماط المطلوبة ======
function injectStyles() {
    const styles = `
    /* أنماط مشغل الموسيقى المخفي */
    .hidden-music-player {
        background: var(--card-bg);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .music-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .music-controls {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 15px 0;
    }
    
    .music-controls button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .song-info {
        display: flex;
        gap: 15px;
        align-items: center;
    }
    
    #music-cover {
        width: 60px;
        height: 60px;
        border-radius: 5px;
    }
    
    .progress-container {
        width: 100%;
        height: 5px;
        background: rgba(255,255,255,0.1);
        border-radius: 5px;
        margin: 10px 0;
    }
    
    .progress-bar {
        height: 100%;
        background: var(--primary-color);
        border-radius: 5px;
        width: 0%;
    }
    
    .time-display {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: rgba(255,255,255,0.7);
    }
    
    .volume-control {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 15px;
    }
    
    /* الزر العائم */
    .floating-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    
    /* الإشعارات المخصصة */
    .custom-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 30px;
        color: white;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { bottom: -50px; opacity: 0; }
        to { bottom: 20px; opacity: 1; }
    }
    
    /* إصلاحات التناسق */
    .card {
        margin: 15px 0 !important;
        padding: 20px !important;
    }
    
    .header {
        flex-direction: row !important;
        align-items: center !important;
    }
    
    body {
        line-height: 1.6 !important;
    }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// حقن الأنماط عند التحميل
injectStyles();
