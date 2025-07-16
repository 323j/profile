/**
 * ملف المميزات الإضافية - الإصدار v5
 * التعديلات الرئيسية:
 * 1- إصلاح مشاكل توزيع الأزرار وتنسيقها
 * 2- تحسين ظهور زر الموسيقى (يظهر فقط بعد تفعيله من المساعد)
 * 3- تحسين واجهة المساعد الذكي
 * 4- إضافة مؤثرات انتقال سلسة
 * 5- تحسين تجربة المستخدم العامة
 */

// ====== تهيئة المتغيرات العامة ======
const APP = {
    config: {
        debugMode: false,
        musicEnabled: false // لا يظهر زر الموسيقى إلا عند التفعيل
    },
    elements: {
        musicPlayer: null,
        musicButton: null
    }
};

// ====== تنفيذ عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    // إصلاح تنسيق الأزرار
    fixButtonsLayout();
    
    // تهيئة الأنظمة
    initMusicSystem();
    enhanceChatAI();
    
    // حقن الأنماط
    injectStyles();
    
    console.log('تم تحميل النظام بنجاح');
});

// ====== إصلاح تنسيق الأزرار ======
function fixButtonsLayout() {
    // إصلاح تنسيق الأزرار الاجتماعية
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(btn => {
        btn.style.margin = '5px';
        btn.style.padding = '10px 15px';
        btn.style.borderRadius = '8px';
        btn.style.transition = 'all 0.3s ease';
    });
    
    // إصلاح تنسيق أزرار التحكم
    const controlButtons = document.querySelectorAll('.control-button, .music-btn');
    controlButtons.forEach(btn => {
        btn.style.width = '40px';
        btn.style.height = '40px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
    });
    
    console.log('تم إصلاح تنسيق الأزرار');
}

// ====== نظام الموسيقى المحسن ======
function initMusicSystem() {
    // إنشاء عناصر الموسيقى مخفية في البداية
    createMusicUI();
    
    // تهيئة مشغل الصوت
    APP.music = {
        player: new Audio(),
        currentSong: 0,
        isPlaying: false,
        volume: 0.7,
        songs: [
            {
                title: "أغنية هادئة",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                cover: "https://via.placeholder.com/150/3498db/FFFFFF?text=Music1"
            },
            {
                title: "أغنية سريعة",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                cover: "https://via.placeholder.com/150/e74c3c/FFFFFF?text=Music2"
            }
        ]
    };
    
    // تحميل أول أغنية
    loadSong(0);
}

function createMusicUI() {
    const musicUI = `
    <div class="music-player" id="music-player" style="display:none; opacity:0;">
        <div class="music-header">
            <h3><i class="fas fa-music"></i> مشغل الموسيقى</h3>
            <button id="close-music"><i class="fas fa-times"></i></button>
        </div>
        <div class="player-container">
            <img src="" id="music-cover" class="music-cover">
            <div class="player-controls">
                <div id="music-title" class="music-title">...</div>
                <div class="progress-container">
                    <div class="progress-bar" id="music-progress"></div>
                </div>
                <div class="time-display">
                    <span id="current-time">00:00</span> / <span id="duration">00:00</span>
                </div>
                <div class="control-buttons">
                    <button id="prev-btn" class="control-btn"><i class="fas fa-step-backward"></i></button>
                    <button id="play-btn" class="control-btn play-btn"><i class="fas fa-play"></i></button>
                    <button id="next-btn" class="control-btn"><i class="fas fa-step-forward"></i></button>
                </div>
            </div>
        </div>
    </div>
    
    <button class="music-launcher" id="music-launcher" style="display:none; opacity:0;">
        <i class="fas fa-music"></i>
    </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', musicUI);
    
    // حفظ العناصر للإشارة السريعة
    APP.elements.musicPlayer = document.getElementById('music-player');
    APP.elements.musicButton = document.getElementById('music-launcher');
    
    // إعداد أحداث التحكم
    setupMusicEvents();
}

function setupMusicEvents() {
    document.getElementById('play-btn').addEventListener('click', togglePlay);
    document.getElementById('prev-btn').addEventListener('click', prevSong);
    document.getElementById('next-btn').addEventListener('click', nextSong);
    document.getElementById('close-music').addEventListener('click', hideMusicPlayer);
    APP.elements.musicButton.addEventListener('click', toggleMusicPlayer);
}

function toggleMusicSystem(enable) {
    APP.config.musicEnabled = enable;
    if (enable) {
        showMusicButton();
    } else {
        hideMusicButton();
        hideMusicPlayer();
    }
}

function showMusicButton() {
    const btn = APP.elements.musicButton;
    btn.style.display = 'flex';
    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
    }, 10);
}

function hideMusicButton() {
    const btn = APP.elements.musicButton;
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(20px)';
    setTimeout(() => {
        btn.style.display = 'none';
    }, 300);
}

function toggleMusicPlayer() {
    if (APP.elements.musicPlayer.style.display === 'none') {
        showMusicPlayer();
    } else {
        hideMusicPlayer();
    }
}

function showMusicPlayer() {
    const player = APP.elements.musicPlayer;
    player.style.display = 'block';
    setTimeout(() => {
        player.style.opacity = '1';
    }, 10);
    
    // تحديث معلومات الأغنية
    updateSongInfo();
}

function hideMusicPlayer() {
    const player = APP.elements.musicPlayer;
    player.style.opacity = '0';
    setTimeout(() => {
        player.style.display = 'none';
    }, 300);
}

// ... (بقية دوال نظام الموسيقى من الإصدار السابق)

// ====== المساعد الذكي المحسن ======
function enhanceChatAI() {
    const originalAI = window.getAIResponse || function() { 
        return "مرحباً! كيف يمكنني مساعدتك اليوم؟ اكتب 'مساعدة' لرؤية الأوامر المتاحة.";
    };
    
    window.getAIResponse = function(message) {
        const lowerMsg = message.toLowerCase().trim();
        
        // أمر المساعدة
        if (/مساعدة|help/.test(lowerMsg)) {
            return showHelpMenu();
        }
        
        // تفعيل الموسيقى
        if (/موسيقى|أغاني|music/.test(lowerMsg)) {
            toggleMusicSystem(true);
            return "تم تفعيل مشغل الموسيقى. يمكنك الوصول إليه من الزر في الزاوية اليسرى السفلية.";
        }
        
        // إيقاف الموسيقى
        if (/إيقاف الموسيقى|stop music/.test(lowerMsg)) {
            toggleMusicSystem(false);
            return "تم إيقاف مشغل الموسيقى.";
        }
        
        // الرد العادي
        return originalAI(message);
    };
    
    function showHelpMenu() {
        return `🎯 الأوامر المتاحة:
        
🎵 الموسيقى:
- "موسيقى": تفعيل مشغل الموسيقى
- "إيقاف الموسيقى": إخفاء المشغل

📱 معلومات:
- "مساعدة": عرض هذه القائمة

${APP.config.musicEnabled ? 'تم تفعيل مشغل الموسيقى ✅' : 'المشغل غير مفعل ❌'}`;
    }
}

// ====== حقن الأنماط المطلوبة ======
function injectStyles() {
    const styles = `
    /* أنماط مشغل الموسيقى */
    .music-player {
        position: fixed;
        bottom: 80px;
        left: 20px;
        background: var(--card-bg);
        border-radius: 15px;
        padding: 15px;
        width: 300px;
        max-width: 90%;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .music-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .music-header h3 {
        margin: 0;
        font-size: 1.2rem;
        color: var(--primary-color);
    }
    
    .music-header button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .player-container {
        display: flex;
        gap: 15px;
    }
    
    .music-cover {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        object-fit: cover;
    }
    
    .player-controls {
        flex: 1;
    }
    
    .music-title {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 0.95rem;
    }
    
    .progress-container {
        height: 5px;
        background: rgba(0,0,0,0.1);
        border-radius: 5px;
        margin: 10px 0;
    }
    
    .progress-bar {
        height: 100%;
        background: var(--primary-color);
        border-radius: 5px;
        width: 0%;
        transition: width 0.1s linear;
    }
    
    .time-display {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #666;
        margin: 5px 0 15px;
    }
    
    .control-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
    }
    
    .control-btn {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.2rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .control-btn:hover {
        background: rgba(0,0,0,0.05);
    }
    
    .play-btn.playing {
        background: var(--primary-color);
        color: white;
    }
    
    /* زر تشغيل الموسيقى */
    .music-launcher {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
        transform: translateY(20px);
    }
    
    .music-launcher:hover {
        transform: translateY(0) scale(1.1);
    }
    
    /* إصلاح تنسيق الأزرار العامة */
    .social-button {
        margin: 5px !important;
        padding: 10px 15px !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    .social-button:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
    }
    
    .control-button {
        width: 40px !important;
        height: 40px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    /* تحسينات عامة */
    body {
        font-family: 'Tajawal', sans-serif;
        line-height: 1.6;
    }
    
    .card {
        margin: 15px 0;
        padding: 20px;
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    /* تأثيرات الظهور */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-in {
        animation: fadeIn 0.5s ease forwards;
    }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// ====== دوال الموسيقى ======
function loadSong(index) {
    APP.music.currentSong = index;
    const song = APP.music.songs[index];
    
    APP.music.player.src = song.src;
    document.getElementById('music-title').textContent = song.title;
    document.getElementById('music-cover').src = song.cover;
    
    if (APP.music.isPlaying) {
        APP.music.player.play().catch(e => console.error('خطأ التشغيل:', e));
    }
}

function togglePlay() {
    if (APP.music.isPlaying) {
        APP.music.player.pause();
    } else {
        APP.music.player.play().catch(e => {
            console.error('خطأ التشغيل:', e);
            showNotification('تعذر تشغيل الموسيقى', 'var(--error-color)');
        });
    }
    APP.music.isPlaying = !APP.music.isPlaying;
    updatePlayButton();
}

function updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    if (APP.music.isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('playing');
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('playing');
    }
}

function prevSong() {
    let newIndex = APP.music.currentSong - 1;
    if (newIndex < 0) newIndex = APP.music.songs.length - 1;
    loadSong(newIndex);
}

function nextSong() {
    let newIndex = APP.music.currentSong + 1;
    if (newIndex >= APP.music.songs.length) newIndex = 0;
    loadSong(newIndex);
}

function updateSongInfo() {
    const player = APP.music.player;
    document.getElementById('duration').textContent = formatTime(player.duration || 0);
    document.getElementById('current-time').textContent = formatTime(player.currentTime || 0);
    
    player.addEventListener('timeupdate', function() {
        const progress = (player.currentTime / player.duration) * 100;
        document.getElementById('music-progress').style.width = `${progress}%`;
        document.getElementById('current-time').textContent = formatTime(player.currentTime);
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ====== نظام الإشعارات ======
function showNotification(message, color = 'var(--primary-color)') {
    const notification = document.createElement('div');
    notification.className = 'custom-notification animate-in';
    notification.style.backgroundColor = color;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
