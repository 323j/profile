/**
 * ملف المميزات الإضافية - الإصدار المتكامل
 * يحتوي على جميع الوظائف المطلوبة باستثناء حالة الطقس والعملات الرقمية
 */

// ====== الهيكل الرئيسي للتطبيق ======
const APP = {
    // إعدادات التطبيق
    config: {
        language: 'ar',
        theme: 'dark',
        sounds: true,
        analytics: true,
        notifications: true,
        plugins: {}
    },

    // حالة التطبيق
    state: {
        musicPlayerVisible: false,
        focusMode: false,
        aiAssistantActive: true
    },

    // بيانات التطبيق
    data: {
        user: {
            name: 'أحمد',
            skills: ['JavaScript', 'Python', 'React']
        },
        visitors: {
            total: 0,
            countries: {},
            devices: {}
        },
        achievements: []
    },

    // العناصر المرجعية
    refs: {
        musicPlayer: null,
        aiAssistant: null,
        themeSwitcher: null
    },

    // أنظمة التطبيق
    systems: {
        music: null,
        ai: null,
        analytics: null
    }
};

// ====== نظام اللغة الثنائي ======
function initLanguageSystem() {
    const langToggle = document.createElement('button');
    langToggle.id = 'lang-toggle';
    langToggle.className = 'app-control-btn';
    langToggle.innerHTML = APP.config.language === 'ar' ? 'EN' : 'AR';
    langToggle.title = APP.config.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
    
    langToggle.addEventListener('click', () => {
        APP.config.language = APP.config.language === 'ar' ? 'en' : 'ar';
        updateLanguage();
        playSound('toggle');
    });

    document.body.appendChild(langToggle);
}

function updateLanguage() {
    // تحديث نص العناصر حسب اللغة
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        el.textContent = LANGUAGE_PACK[APP.config.language][key];
    });

    // تحديث زر اللغة
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.innerHTML = APP.config.language === 'ar' ? 'EN' : 'AR';
        langToggle.title = APP.config.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
    }
}

const LANGUAGE_PACK = {
    ar: {
        welcome: 'مرحباً بك',
        musicTitle: 'مشغل الموسيقى',
        settingsTitle: 'الإعدادات'
    },
    en: {
        welcome: 'Welcome',
        musicTitle: 'Music Player',
        settingsTitle: 'Settings'
    }
};

// ====== نظام الثيمات ======
function initThemeSystem() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'app-control-btn';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = APP.config.language === 'ar' ? 'تبديل الثيم' : 'Toggle theme';

    themeToggle.addEventListener('click', () => {
        toggleTheme();
        playSound('switch');
    });

    document.body.appendChild(themeToggle);
    loadSavedTheme();
}

function toggleTheme() {
    const newTheme = APP.config.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    APP.config.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
    updateThemeIcon();
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) setTheme(savedTheme);
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = APP.config.theme === 'dark' ? 'fa-moon' : 'fa-sun';
    themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
}

// ====== نظام الموسيقى ======
function initMusicSystem() {
    createMusicPlayer();
    setupMusicControls();
    loadInitialTrack();
    setupMusicEvents();
}

function createMusicPlayer() {
    const playerHTML = `
    <div class="music-player" id="music-player" style="display:none;">
        <div class="player-header">
            <h3 data-lang="musicTitle">مشغل الموسيقى</h3>
            <button id="close-music"><i class="fas fa-times"></i></button>
        </div>
        <div class="player-controls">
            <button id="prev-track"><i class="fas fa-step-backward"></i></button>
            <button id="play-pause"><i class="fas fa-play"></i></button>
            <button id="next-track"><i class="fas fa-step-forward"></i></button>
        </div>
        <div class="track-info">
            <img src="https://via.placeholder.com/150" id="track-cover">
            <div>
                <div id="track-title">No track selected</div>
                <div class="progress-container">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
                <div class="time-display">
                    <span id="current-time">00:00</span> / <span id="total-time">00:00</span>
                </div>
            </div>
        </div>
        <div class="volume-control">
            <i class="fas fa-volume-down"></i>
            <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="0.5">
            <i class="fas fa-volume-up"></i>
        </div>
    </div>
    <button id="music-toggle" class="music-toggle-btn">
        <i class="fas fa-music"></i>
    </button>
    `;

    document.body.insertAdjacentHTML('beforeend', playerHTML);
    APP.refs.musicPlayer = document.getElementById('music-player');
}

function setupMusicControls() {
    APP.systems.music = {
        audio: new Audio(),
        tracks: [
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
        ],
        currentTrack: 0,
        isPlaying: false,
        volume: 0.5
    };
}

function loadInitialTrack() {
    const track = APP.systems.music.tracks[0];
    loadTrack(track);
}

function loadTrack(track) {
    const { audio } = APP.systems.music;
    audio.src = track.src;
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('track-cover').src = track.cover;
}

function setupMusicEvents() {
    const { audio } = APP.systems.music;
    const playPauseBtn = document.getElementById('play-pause');
    const prevTrackBtn = document.getElementById('prev-track');
    const nextTrackBtn = document.getElementById('next-track');
    const volumeSlider = document.getElementById('volume-slider');
    const progressBar = document.getElementById('progress-bar');
    const closeBtn = document.getElementById('close-music');
    const toggleBtn = document.getElementById('music-toggle');

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevTrackBtn.addEventListener('click', playPreviousTrack);
    nextTrackBtn.addEventListener('click', playNextTrack);
    volumeSlider.addEventListener('input', updateVolume);
    progressBar.addEventListener('click', seekTrack);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextTrack);
    audio.addEventListener('loadedmetadata', updateTrackDuration);
    closeBtn.addEventListener('click', hideMusicPlayer);
    toggleBtn.addEventListener('click', toggleMusicPlayer);
}

function togglePlayPause() {
    const { audio, isPlaying } = APP.systems.music;
    const playPauseBtn = document.getElementById('play-pause');

    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play()
            .then(() => {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(e => {
                showNotification('تعذر تشغيل الموسيقى', 'error');
                console.error('Playback error:', e);
            });
    }

    APP.systems.music.isPlaying = !isPlaying;
}

function playPreviousTrack() {
    const { tracks, currentTrack } = APP.systems.music;
    let newIndex = currentTrack - 1;
    if (newIndex < 0) newIndex = tracks.length - 1;
    changeTrack(newIndex);
}

function playNextTrack() {
    const { tracks, currentTrack } = APP.systems.music;
    let newIndex = currentTrack + 1;
    if (newIndex >= tracks.length) newIndex = 0;
    changeTrack(newIndex);
}

function changeTrack(index) {
    APP.systems.music.currentTrack = index;
    const track = APP.systems.music.tracks[index];
    loadTrack(track);
    
    if (APP.systems.music.isPlaying) {
        APP.systems.music.audio.play()
            .catch(e => console.error('Track change error:', e));
    }
}

function updateVolume() {
    const volume = this.value;
    APP.systems.music.audio.volume = volume;
    APP.systems.music.volume = volume;
}

function seekTrack(e) {
    const { audio } = APP.systems.music;
    const progressBar = document.getElementById('progress-bar');
    const percent = e.offsetX / progressBar.offsetWidth;
    audio.currentTime = percent * audio.duration;
}

function updateProgress() {
    const { audio } = APP.systems.music;
    const progressBar = document.getElementById('progress-bar');
    const currentTime = document.getElementById('current-time');
    const percent = (audio.currentTime / audio.duration) * 100;
    
    progressBar.style.width = `${percent}%`;
    currentTime.textContent = formatTime(audio.currentTime);
}

function updateTrackDuration() {
    const { audio } = APP.systems.music;
    document.getElementById('total-time').textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleMusicPlayer() {
    const player = document.getElementById('music-player');
    if (player.style.display === 'none') {
        showMusicPlayer();
    } else {
        hideMusicPlayer();
    }
}

function showMusicPlayer() {
    const player = document.getElementById('music-player');
    player.style.display = 'block';
    document.getElementById('music-toggle').classList.add('active');
    APP.state.musicPlayerVisible = true;
}

function hideMusicPlayer() {
    const player = document.getElementById('music-player');
    player.style.display = 'none';
    document.getElementById('music-toggle').classList.remove('active');
    APP.state.musicPlayerVisible = false;
}

// ====== المساعد الذكي ======
function initAIAssistant() {
    createAIAssistant();
    setupAIEvents();
    enhanceAIResponses();
}

function createAIAssistant() {
    const assistantHTML = `
    <div class="ai-assistant" id="ai-assistant">
        <i class="fas fa-robot"></i>
    </div>
    <div class="ai-chat" id="ai-chat">
        <div class="chat-header">
            <h3><i class="fas fa-robot"></i> المساعد الذكي</h3>
            <button id="close-chat"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="message ai-message">
                ${APP.config.language === 'ar' ? 
                 'مرحباً! كيف يمكنني مساعدتك اليوم؟' : 
                 'Hello! How can I help you today?'}
            </div>
        </div>
        <div class="chat-input">
            <input type="text" id="user-input" placeholder="${APP.config.language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}">
            <button id="send-message"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', assistantHTML);
    APP.refs.aiAssistant = document.getElementById('ai-assistant');
}

function setupAIEvents() {
    const assistant = document.getElementById('ai-assistant');
    const chat = document.getElementById('ai-chat');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-message');
    const userInput = document.getElementById('user-input');

    assistant.addEventListener('click', toggleAIChat);
    closeBtn.addEventListener('click', toggleAIChat);
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function toggleAIChat() {
    const chat = document.getElementById('ai-chat');
    chat.classList.toggle('visible');
    APP.state.aiAssistantActive = chat.classList.contains('visible');
    
    if (APP.state.aiAssistantActive) {
        document.getElementById('user-input').focus();
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addMessage(message, 'user');
    input.value = '';
    
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'ai');
    }, 500);
}

function addMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function enhanceAIResponses() {
    const originalAI = window.getAIResponse || function() {
        return APP.config.language === 'ar' ? 
               'لم أفهم سؤالك. اكتب "مساعدة" للتعرف على الأوامر المتاحة.' : 
               'I did not understand. Type "help" for available commands.';
    };

    window.getAIResponse = function(message) {
        const lowerMsg = message.toLowerCase();
        
        // الأوامر الأساسية
        if (/مساعدة|help/.test(lowerMsg)) {
            return APP.config.language === 'ar' ?
                   `الأوامر المتاحة:
- "موسيقى": التحكم بالمشغل الموسيقي
- "الأسرار": عرض الأوامر الخفية
- "اللغة": تغيير لغة الواجهة` :
                   `Available commands:
- "music": Control music player
- "secrets": Show hidden commands
- "language": Change interface language`;
        }
        
        if (/موسيقى|music/.test(lowerMsg)) {
            toggleMusicCommand();
            return APP.config.language === 'ar' ?
                   'تم تفعيل مشغل الموسيقى. يمكنك فتحه من الزر في الأسفل.' :
                   'Music player enabled. You can open it from the button below.';
        }
        
        if (/الأسرار|secrets/.test(lowerMsg)) {
            return APP.config.language === 'ar' ?
                   `الأوامر الخفية:
- "المطور": معلومات عن المطور
- "إعادة تحميل": تحديث الصفحة` :
                   `Hidden commands:
- "developer": Developer info
- "reload": Refresh page`;
        }
        
        // الأوامر الخفية
        if (/المطور|developer/.test(lowerMsg)) {
            return APP.config.language === 'ar' ?
                   'المطور: أحمد\nالتخصص: تطوير الويب\nالمهارات: JavaScript, Python, React' :
                   'Developer: Ahmed\nSpecialty: Web Development\nSkills: JavaScript, Python, React';
        }
        
        if (/إعادة تحميل|reload/.test(lowerMsg)) {
            setTimeout(() => location.reload(), 1000);
            return APP.config.language === 'ar' ? 'جاري إعادة تحميل الصفحة...' : 'Reloading page...';
        }
        
        return originalAI(message);
    };
}

function toggleMusicCommand() {
    const toggleBtn = document.getElementById('music-toggle');
    toggleBtn.style.display = 'block';
    showNotification(
        APP.config.language === 'ar' ? 
        'تم تفعيل مشغل الموسيقى' : 
        'Music player enabled',
        'success'
    );
}

// ====== نظام الإشعارات ======
function showNotification(message, type = 'info') {
    if (!APP.config.notifications) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ====== نظام الأصوات ======
function initSoundSystem() {
    APP.sounds = {
        toggle: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arrow-whoosh-1491.mp3'),
        notification: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3'),
        click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3')
    };
}

function playSound(type) {
    if (!APP.config.sounds || !APP.sounds[type]) return;
    
    try {
        APP.sounds[type].currentTime = 0;
        APP.sounds[type].play();
    } catch (e) {
        console.error('Sound error:', e);
    }
}

// ====== نظام التحليلات ======
function initAnalyticsSystem() {
    if (!APP.config.analytics) return;
    
    // تسجيل زيارة جديدة
    recordVisit();
    
    // تتبع الأحداث
    document.addEventListener('click', trackClickEvents);
    window.addEventListener('beforeunload', sendAnalyticsData);
}

function recordVisit() {
    APP.data.visitors.total++;
    
    // تسجيل معلومات الجهاز
    const deviceType = getDeviceType();
    APP.data.visitors.devices[deviceType] = (APP.data.visitors.devices[deviceType] || 0) + 1;
    
    // تسجيل الوقت
    APP.data.visitors.lastVisit = new Date().toISOString();
    
    // حفظ البيانات
    localStorage.setItem('visitorsData', JSON.stringify(APP.data.visitors));
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
        return /Tablet|iPad/i.test(ua) ? 'tablet' : 'mobile';
    }
    return 'desktop';
}

function trackClickEvents(e) {
    // يمكنك تتبع العناصر المهمة التي يتم النقر عليها
}

function sendAnalyticsData() {
    // في الواقع التطبيق، هنا يتم إرسال البيانات إلى الخادم
    console.log('Sending analytics data:', APP.data.visitors);
}

// ====== نظام وضع التركيز ======
function initFocusMode() {
    const focusBtn = document.createElement('button');
    focusBtn.id = 'focus-toggle';
    focusBtn.className = 'app-control-btn';
    focusBtn.innerHTML = '<i class="fas fa-eye"></i>';
    focusBtn.title = APP.config.language === 'ar' ? 'وضع التركيز' : 'Focus mode';
    
    focusBtn.addEventListener('click', () => {
        toggleFocusMode();
        playSound('click');
    });

    document.body.appendChild(focusBtn);
}

function toggleFocusMode() {
    APP.state.focusMode = !APP.state.focusMode;
    document.body.classList.toggle('focus-mode');
    
    showNotification(
        APP.config.language === 'ar' ?
        `وضع التركيز ${APP.state.focusMode ? 'مفعل' : 'معطل'}` :
        `Focus mode ${APP.state.focusMode ? 'enabled' : 'disabled'}`,
        APP.state.focusMode ? 'success' : 'info'
    );
}

// ====== نظام الاختصارات ======
function initShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Alt+M لفتح/إغلاق الموسيقى
        if (e.ctrlKey && e.altKey && e.key === 'm') {
            toggleMusicPlayer();
        }
        
        // Ctrl+Alt+A لفتح/إغلاق المساعد
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            toggleAIChat();
        }
    });
}

// ====== نظام الإضافات ======
function initPluginSystem() {
    APP.config.plugins = {
        enabled: [],
        available: []
    };
    
    // يمكنك إضافة واجهة لتحميل الإضافات هنا
}

// ====== تهيئة التطبيق ======
function initializeApp() {
    // حقن الأنماط الأساسية
    injectCoreStyles();
    
    // تهيئة الأنظمة
    initLanguageSystem();
    initThemeSystem();
    initSoundSystem();
    initMusicSystem();
    initAIAssistant();
    initAnalyticsSystem();
    initFocusMode();
    initShortcuts();
    initPluginSystem();
    
    // تحديث الواجهة حسب اللغة
    updateLanguage();
    
    // إشعار البدء
    showNotification(
        APP.config.language === 'ar' ?
        'تم تحميل التطبيق بنجاح!' :
        'App loaded successfully!',
        'success'
    );
}

// ====== حقن الأنماط الأساسية ======
function injectCoreStyles() {
    const styles = `
    /* أنماط التحكم الأساسية */
    .app-control-btn {
        position: fixed;
        top: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    
    .app-control-btn:hover {
        transform: scale(1.1);
    }
    
    #lang-toggle { right: 20px; }
    #theme-toggle { right: 70px; }
    #focus-toggle { right: 120px; }
    
    /* أنماط مشغل الموسيقى */
    .music-player {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        background: var(--card-bg);
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
    }
    
    .player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .player-controls {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 15px 0;
    }
    
    .player-controls button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .track-info {
        display: flex;
        gap: 15px;
        align-items: center;
    }
    
    #track-cover {
        width: 60px;
        height: 60px;
        border-radius: 5px;
        object-fit: cover;
    }
    
    .progress-container {
        width: 100%;
        height: 5px;
        background: rgba(255,255,255,0.1);
        border-radius: 5px;
        margin: 10px 0;
        cursor: pointer;
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
        color: rgba(255,255,255,0.7);
    }
    
    .volume-control {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 15px;
    }
    
    .volume-control input {
        flex-grow: 1;
    }
    
    .music-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    
    .music-toggle-btn.active {
        background: var(--secondary-color);
    }
    
    /* أنماط المساعد الذكي */
    .ai-assistant {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: var(--ai-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .ai-chat {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: var(--card-bg);
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        display: none;
        flex-direction: column;
    }
    
    .ai-chat.visible {
        display: flex;
    }
    
    .chat-header {
        background: var(--ai-color);
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .chat-messages {
        flex-grow: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .message {
        padding: 10px 15px;
        border-radius: 15px;
        max-width: 80%;
    }
    
    .user-message {
        align-self: flex-end;
        background: var(--primary-color);
        color: white;
    }
    
    .ai-message {
        align-self: flex-start;
        background: var(--hover-color);
    }
    
    .chat-input {
        display: flex;
        padding: 10px;
        background: var(--hover-color);
    }
    
    .chat-input input {
        flex-grow: 1;
        padding: 10px;
        border: none;
        border-radius: 20px;
        background: var(--bg-color);
        color: var(--text-color);
    }
    
    .chat-input button {
        background: var(--ai-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-left: 10px;
        cursor: pointer;
    }
    
    /* أنماط الإشعارات */
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 30px;
        color: white;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    }
    
    .notification.info {
        background: var(--primary-color);
    }
    
    .notification.success {
        background: var(--success-color);
    }
    
    .notification.error {
        background: var(--error-color);
    }
    
    .notification.fade-out {
        animation: fadeOut 0.5s ease forwards;
    }
    
    @keyframes slideIn {
        from { bottom: -50px; opacity: 0; }
        to { bottom: 20px; opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    /* وضع التركيز */
    .focus-mode {
        --bg-color: #f5f7fa;
        --text-color: #333;
        --card-bg: #ffffff;
        --hover-color: #f0f2f5;
    }
    
    .focus-mode .card {
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .focus-mode .ai-assistant,
    .focus-mode .music-toggle-btn {
        opacity: 0.7;
    }
    
    /* متغيرات الألوان */
    :root {
        --primary-color: #4a6bff;
        --secondary-color: #ff6b4a;
        --success-color: #2ecc71;
        --error-color: #e74c3c;
        --ai-color: #3498db;
        --bg-color: #1a1a1a;
        --text-color: #e0e0e0;
        --card-bg: #2d2d2d;
        --hover-color: #3d3d3d;
    }
    
    [data-theme="light"] {
        --primary-color: #3a5bff;
        --secondary-color: #ff5b3a;
        --success-color: #27ae60;
        --error-color: #c0392b;
        --ai-color: #2980b9;
        --bg-color: #f5f7fa;
        --text-color: #333;
        --card-bg: #ffffff;
        --hover-color: #f0f2f5;
    }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// ====== بدء تشغيل التطبيق ======
document.addEventListener('DOMContentLoaded', initializeApp);
