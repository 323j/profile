/**
 * ملف المميزات الإضافية - الإصدار v2
 * المميزات الجديدة:
 * 1- نظام موسيقى متكامل مع زر تشغيل في الأسفل
 * 2- مساعد ذكي محسن مع ردود ذكية
 * 3- نظام بيانات الزوار المتقدم
 * 4- واجهة تحكم مطورة
 * 5- دعم الإشعارات الذكية
 */

// ====== تهيئة المتغيرات العامة ======
const APP = {
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
    },
    visitorData: {
        total: 0,
        countries: {},
        devices: {},
        visits: []
    }
};

// ====== تنفيذ عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من التوافق
    if (!isBrowserCompatible()) {
        showErrorNotification('المتصفح غير مدعوم بالكامل');
        return;
    }

    // تهيئة المميزات
    initVisitorSystem();
    initMusicSystem();
    enhanceChatAI();
    addControlPanel();

    // إشعار البدء
    showSuccessNotification('تم تحميل المميزات المتقدمة بنجاح!');
});

// ====== دعم المتصفح ======
function isBrowserCompatible() {
    return window.Promise && 
           window.fetch && 
           window.AudioContext && 
           'volume' in HTMLAudioElement.prototype;
}

// ====== نظام الموسيقى المتكامل ======
function initMusicSystem() {
    try {
        // إنشاء عناصر واجهة المستخدم
        createMusicUI();
        
        // تهيئة مشغل الصوت
        APP.music.player = new Audio();
        APP.music.player.volume = APP.music.volume;
        
        // تحميل أول أغنية
        loadSong(0);
        
        // إعداد الأحداث
        setupMusicEvents();
        
        console.log('نظام الموسيقى جاهز');
    } catch (error) {
        console.error('خطأ في نظام الموسيقى:', error);
        showErrorNotification('تعذر تحميل مشغل الموسيقى');
    }
}

function createMusicUI() {
    const musicUI = `
    <div class="music-controls-bar" id="music-controls-bar">
        <div class="music-info">
            <img src="${APP.music.songs[0].cover}" id="music-cover" class="music-cover">
            <div>
                <div id="music-title" class="music-title">${APP.music.songs[0].title}</div>
                <div class="music-time">
                    <span id="current-time">00:00</span> / <span id="duration">00:00</span>
                </div>
            </div>
        </div>
        <div class="music-buttons">
            <button id="prev-btn" class="music-btn"><i class="fas fa-step-backward"></i></button>
            <button id="play-btn" class="music-btn play-btn"><i class="fas fa-play"></i></button>
            <button id="next-btn" class="music-btn"><i class="fas fa-step-forward"></i></button>
            <div class="volume-control">
                <i class="fas fa-volume-down"></i>
                <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="${APP.music.volume}">
                <i class="fas fa-volume-up"></i>
            </div>
        </div>
        <button id="music-toggle" class="music-toggle-btn"><i class="fas fa-music"></i></button>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', musicUI);
}

function setupMusicEvents() {
    // عناصر التحكم
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressBar = document.getElementById('music-progress');
    const toggleBtn = document.getElementById('music-toggle');
    
    // أحداث الأزرار
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    volumeSlider.addEventListener('input', changeVolume);
    toggleBtn.addEventListener('click', toggleMusicPanel);
    
    // أحداث الصوت
    APP.music.player.addEventListener('timeupdate', updateProgress);
    APP.music.player.addEventListener('ended', nextSong);
    APP.music.player.addEventListener('loadedmetadata', updateSongInfo);
}

function loadSong(index) {
    APP.music.currentSong = index;
    const song = APP.music.songs[index];
    
    APP.music.player.src = song.src;
    document.getElementById('music-title').textContent = song.title;
    document.getElementById('music-cover').src = song.cover;
    
    if (APP.music.isPlaying) {
        APP.music.player.play()
            .then(() => updatePlayButton())
            .catch(e => console.error('خطأ التشغيل:', e));
    }
}

function togglePlay() {
    if (APP.music.isPlaying) {
        APP.music.player.pause();
    } else {
        APP.music.player.play()
            .then(() => {
                APP.music.isPlaying = true;
                updatePlayButton();
            })
            .catch(e => {
                console.error('خطأ التشغيل:', e);
                showErrorNotification('تعذر تشغيل الموسيقى');
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

function changeVolume() {
    APP.music.volume = this.value;
    APP.music.player.volume = APP.music.volume;
}

function updateProgress() {
    const progress = (APP.music.player.currentTime / APP.music.player.duration) * 100;
    document.getElementById('current-time').textContent = formatTime(APP.music.player.currentTime);
}

function updateSongInfo() {
    document.getElementById('duration').textContent = formatTime(APP.music.player.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleMusicPanel() {
    document.getElementById('music-controls-bar').classList.toggle('expanded');
}

// ====== نظام بيانات الزوار ======
function initVisitorSystem() {
    try {
        // تحميل البيانات المحفوظة
        const savedData = localStorage.getItem('visitorData');
        if (savedData) {
            APP.visitorData = JSON.parse(savedData);
        }
        
        // تسجيل الزيارة الجديدة
        recordVisit();
        
        console.log('نظام الزوار جاهز');
    } catch (error) {
        console.error('خطأ في نظام الزوار:', error);
    }
}

function recordVisit() {
    // زيادة العداد
    APP.visitorData.total++;
    
    // جلب معلومات الزائر
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            // تسجيل الدولة
            const country = data.country_name || 'غير معروف';
            APP.visitorData.countries[country] = (APP.visitorData.countries[country] || 0) + 1;
            
            // تسجيل الجهاز
            const device = getDeviceType();
            APP.visitorData.devices[device] = (APP.visitorData.devices[device] || 0) + 1;
            
            // تسجيل وقت الزيارة
            APP.visitorData.visits.push(new Date().toISOString());
            
            // حفظ البيانات
            localStorage.setItem('visitorData', JSON.stringify(APP.visitorData));
        })
        .catch(() => {
            console.log('تعذر جلب بيانات الموقع');
        });
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
        return /Tablet|iPad/i.test(ua) ? 'جهاز لوحي' : 'هاتف ذكي';
    }
    return 'كمبيوتر';
}

function showVisitorData() {
    const data = APP.visitorData;
    const visitorDataHTML = `
    <div class="visitor-data-panel" id="visitor-data-panel">
        <div class="panel-header">
            <h3><i class="fas fa-users"></i> إحصائيات الزوار</h3>
            <button class="close-panel" id="close-visitor-panel"><i class="fas fa-times"></i></button>
        </div>
        <div class="panel-content">
            <div class="data-item">
                <div class="data-label">إجمالي الزوار:</div>
                <div class="data-value">${data.total}</div>
            </div>
            <div class="data-item">
                <div class="data-label">آخر زيارة:</div>
                <div class="data-value">${new Date(data.visits[data.visits.length-1]).toLocaleString('ar-EG')}</div>
            </div>
            <div class="data-item">
                <div class="data-label">أكثر الدول:</div>
                <div class="data-value">${getTopCountries()}</div>
            </div>
            <div class="data-item">
                <div class="data-label">نوع الأجهزة:</div>
                <div class="data-value">${getDevicesStats()}</div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', visitorDataHTML);
    
    // إغلاق اللوحة
    document.getElementById('close-visitor-panel').addEventListener('click', () => {
        document.getElementById('visitor-data-panel').remove();
    });
}

function getTopCountries() {
    const countries = APP.visitorData.countries;
    const sorted = Object.entries(countries).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 3).map(item => `${item[0]} (${item[1]})`).join('، ');
}

function getDevicesStats() {
    const devices = APP.visitorData.devices;
    return Object.entries(devices).map(item => `${item[0]}: ${item[1]}`).join('، ');
}

// ====== المساعد الذكي المحسن ======
function enhanceChatAI() {
    try {
        // حفظ الدالة الأصلية
        const originalAI = window.getAIResponse || function() { return "المساعد غير متاح حالياً"; };
        
        // استبدال الدالة
        window.getAIResponse = function(message) {
            const lowerMsg = message.toLowerCase();
            
            // الأوامر الخاصة
            if (/داتا|بيانات|إحصائيات/.test(lowerMsg)) {
                showVisitorData();
                return "تم عرض إحصائيات الزوار في اللوحة الخاصة";
            }
            
            if (/موسيقى|أغاني|تشغيل/.test(lowerMsg)) {
                return `يمكنك التحكم بالموسيقى من شريط التحكم في الأسفل. الأغاني المتاحة: ${APP.music.songs.map(s => s.title).join('، ')}`;
            }
            
            if (/مساعدة|أوامر|commands/.test(lowerMsg)) {
                return `أوامر المساعد:
- "بيانات": عرض إحصائيات الزوار
- "موسيقى": التحكم بالمشغل الموسيقي
- "مساعدة": عرض هذه القائمة
${originalAI('مساعدة') || ''}`;
            }
            
            // الرد العادي
            return originalAI(message);
        };
        
        console.log('تم تحميل المساعد الذكي المحسن');
    } catch (error) {
        console.error('خطأ في تحميل المساعد الذكي:', error);
    }
}

// ====== لوحة التحكم الإضافية ======
function addControlPanel() {
    const panelHTML = `
    <div class="control-panel" id="control-panel">
        <button class="panel-btn" id="visitor-data-btn" title="بيانات الزوار">
            <i class="fas fa-chart-bar"></i>
        </button>
        <button class="panel-btn" id="music-control-btn" title="التحكم بالموسيقى">
            <i class="fas fa-music"></i>
        </button>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
    
    // أحداث الأزرار
    document.getElementById('visitor-data-btn').addEventListener('click', showVisitorData);
    document.getElementById('music-control-btn').addEventListener('click', () => {
        document.getElementById('music-controls-bar').classList.toggle('expanded');
    });
}

// ====== نظام الإشعارات ======
function showSuccessNotification(message) {
    if (window.addNotification) {
        addNotification(message, 'var(--success-color)');
    } else {
        console.log('إشعار:', message);
    }
}

function showErrorNotification(message) {
    if (window.addNotification) {
        addNotification(message, 'var(--error-color)');
    } else {
        console.error('خطأ:', message);
    }
}

// ====== أنماط CSS المدمجة ======
function injectStyles() {
    const styles = `
    /* أنماط مشغل الموسيقى */
    .music-controls-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--card-bg);
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--hover-color);
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .music-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .music-cover {
        width: 40px;
        height: 40px;
        border-radius: 5px;
    }
    
    .music-title {
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .music-time {
        font-size: 0.8rem;
        opacity: 0.7;
    }
    
    .music-buttons {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .music-btn {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .play-btn.playing {
        color: var(--primary-color);
    }
    
    .volume-control {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .music-toggle-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    
    /* أنماط لوحة بيانات الزوار */
    .visitor-data-panel {
        position: fixed;
        bottom: 60px;
        right: 20px;
        width: 300px;
        background: var(--card-bg);
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        padding: 15px;
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .panel-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .data-item {
        display: flex;
        justify-content: space-between;
    }
    
    .data-label {
        font-weight: bold;
    }
    
    .close-panel {
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
    }
    
    /* أنماط لوحة التحكم */
    .control-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1002;
    }
    
    .panel-btn {
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
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// حقن الأنماط عند التحميل
injectStyles();
