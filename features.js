/**
 * ملف المميزات الإضافية - الإصدار v4
 * المميزات الجديدة:
 * 1- نظام مساعد ذكي متقدم بأوامر سرية
 * 2- مشغل موسيقى متكامل مع زر ذكي
 * 3- نظام جمع معلومات الزوار المتقدم
 * 4- لوحة تحكم مطورة
 * 5- مميزات أمان وتحسين أداء
 */

// ====== تهيئة المتغيرات العامة ======
const APP = {
    config: {
        debugMode: false,
        adminPassword: "123456" // كلمة سر المطور (يمكن تغييرها)
    },
    user: {
        isAdmin: false,
        deviceInfo: {}
    },
    music: {
        player: null,
        currentSong: 0,
        isPlaying: false,
        volume: 0.7,
        songs: [
            {
                title: "نشيد هادئ",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                cover: "https://via.placeholder.com/150/3498db/FFFFFF?text=Music1"
            },
            {
                title: "أغنية سريعة",
                src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                cover: "https://via.placeholder.com/150/e74c3c/FFFFFF?text=Music2"
            }
        ]
    },
    secrets: {
        commands: {
            'الأسرار': { 
                action: 'showSecrets', 
                description: 'عرض جميع الأوامر السرية',
                adminOnly: false
            },
            'المطور': { 
                action: 'showDevInfo', 
                description: 'معلومات عن المطور',
                adminOnly: false
            },
            'تحديث': { 
                action: 'refreshApp', 
                description: 'إعادة تحميل الصفحة',
                adminOnly: false
            },
            'معلوماتي': { 
                action: 'showMyInfo', 
                description: 'عرض معلومات جهازك',
                adminOnly: false
            },
            'المشرف': { 
                action: 'adminLogin', 
                description: 'وضع المشرف (تطلب كلمة سر)',
                adminOnly: true
            },
            'المستخدمون': { 
                action: 'showVisitors', 
                description: 'عرض بيانات الزوار (للمشرف فقط)',
                adminOnly: true
            }
        }
    }
};

// ====== تنفيذ عند تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    // جمع معلومات الجهاز
    collectDeviceInfo();
    
    // تهيئة الأنظمة
    initMusicSystem();
    enhanceChatAI();
    initVisitorSystem();
    createControlPanel();
    
    // إشعار البدء
    showNotification('مرحباً بك في النسخة المطورة! اكتب "مساعدة" لرؤية الأوامر', 'var(--primary-color)');
    
    // حقن الأنماط
    injectStyles();
});

// ====== نظام جمع معلومات الجهاز ======
function collectDeviceInfo() {
    const userAgent = navigator.userAgent;
    const screen = window.screen;
    
    APP.user.deviceInfo = {
        // معلومات النظام
        os: getOS(),
        browser: getBrowser(),
        engine: getEngine(),
        
        // معلومات الجهاز
        deviceType: getDeviceType(),
        cpuCores: navigator.hardwareConcurrency || 'غير معروف',
        memory: navigator.deviceMemory || 'غير معروف',
        
        // معلومات الشاشة
        screenSize: `${screen.width}x${screen.height}`,
        colorDepth: `${screen.colorDepth} بت`,
        orientation: screen.orientation ? screen.orientation.type : 'غير معروف',
        
        // معلومات الشبكة
        connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: `${navigator.connection.downlink} Mbps`,
            rtt: `${navigator.connection.rtt} ms`
        } : 'غير معروف',
        
        // معلومات إضافية
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || 'غير مفعل'
    };
    
    console.log('تم جمع معلومات الجهاز:', APP.user.deviceInfo);
}

function getOS() {
    const ua = navigator.userAgent;
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac/.test(ua)) return 'MacOS';
    if (/Linux/.test(ua)) return 'Linux';
    if (/Android/.test(ua)) return 'Android';
    if (/iOS|iPhone|iPad|iPod/.test(ua)) return 'iOS';
    return 'غير معروف';
}

function getBrowser() {
    const ua = navigator.userAgent;
    if (/Firefox/.test(ua)) return 'Firefox';
    if (/Chrome/.test(ua)) return 'Chrome';
    if (/Safari/.test(ua)) return 'Safari';
    if (/Edge/.test(ua)) return 'Edge';
    if (/Opera|OPR/.test(ua)) return 'Opera';
    return 'غير معروف';
}

function getEngine() {
    const ua = navigator.userAgent;
    if (/AppleWebKit/.test(ua)) return 'WebKit';
    if (/Gecko/.test(ua)) return 'Gecko';
    if (/Trident/.test(ua)) return 'Trident';
    if (/Blink/.test(ua)) return 'Blink';
    return 'غير معروف';
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad|iPod/.test(ua)) {
        return /Tablet|iPad/.test(ua) ? 'جهاز لوحي' : 'هاتف ذكي';
    }
    return 'كمبيوتر';
}

// ====== نظام الموسيقى المحسن ======
function initMusicSystem() {
    try {
        // إنشاء عناصر واجهة المستخدم
        createMusicUI();
        
        // تهيئة مشغل الصوت
        APP.music.player = new Audio();
        APP.music.player.volume = APP.music.volume;
        
        // تحميل أول أغنية
        loadSong(0);
        
        console.log('نظام الموسيقى جاهز');
    } catch (error) {
        console.error('خطأ في نظام الموسيقى:', error);
        showErrorNotification('تعذر تحميل مشغل الموسيقى');
    }
}

function createMusicUI() {
    const musicUI = `
    <div class="music-panel" id="music-panel" style="display:none;">
        <div class="panel-header">
            <h3><i class="fas fa-music"></i> مشغل الموسيقى</h3>
            <button id="close-music"><i class="fas fa-times"></i></button>
        </div>
        <div class="player-container">
            <img src="${APP.music.songs[0].cover}" id="music-cover" class="music-cover">
            <div class="player-controls">
                <div id="music-title" class="music-title">${APP.music.songs[0].title}</div>
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
        <div class="volume-control">
            <i class="fas fa-volume-down"></i>
            <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="${APP.music.volume}">
            <i class="fas fa-volume-up"></i>
        </div>
    </div>
    
    <button id="music-launcher" class="music-launcher-btn">
        <i class="fas fa-music"></i>
    </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', musicUI);
    
    // أحداث المشغل
    document.getElementById('play-btn').addEventListener('click', togglePlay);
    document.getElementById('prev-btn').addEventListener('click', prevSong);
    document.getElementById('next-btn').addEventListener('click', nextSong);
    document.getElementById('volume-slider').addEventListener('input', changeVolume);
    document.getElementById('close-music').addEventListener('click', hideMusicPanel);
    document.getElementById('music-launcher').addEventListener('click', toggleMusicPanel);
}

function toggleMusicPanel() {
    const panel = document.getElementById('music-panel');
    if (panel.style.display === 'none' || !panel.style.display) {
        showMusicPanel();
    } else {
        hideMusicPanel();
    }
}

function showMusicPanel() {
    const panel = document.getElementById('music-panel');
    panel.style.display = 'block';
    positionMusicPanel();
}

function hideMusicPanel() {
    document.getElementById('music-panel').style.display = 'none';
}

function positionMusicPanel() {
    const panel = document.getElementById('music-panel');
    const launcher = document.getElementById('music-launcher');
    const launcherRect = launcher.getBoundingClientRect();
    
    panel.style.position = 'fixed';
    panel.style.bottom = '80px';
    panel.style.right = '20px';
    panel.style.zIndex = '1001';
}

// ... (بقية دوال نظام الموسيقى من الإصدار السابق)

// ====== المساعد الذكي المتقدم ======
function enhanceChatAI() {
    try {
        // حفظ الدالة الأصلية
        const originalAI = window.getAIResponse || function() { 
            return "المساعد جاهز لمساعدتك. اكتب 'مساعدة' لرؤية الأوامر المتاحة."; 
        };
        
        // استبدال الدالة
        window.getAIResponse = function(message) {
            const lowerMsg = message.toLowerCase().trim();
            
            // أمر المساعدة
            if (/مساعدة|help|commands/.test(lowerMsg)) {
                return showHelp();
            }
            
            // التحقق من الأوامر السرية
            for (const [cmd, info] of Object.entries(APP.secrets.commands)) {
                if (lowerMsg.includes(cmd.toLowerCase())) {
                    if (info.adminOnly && !APP.user.isAdmin) {
                        return "هذا الأمر يحتاج صلاحيات مشرف. اكتب 'المشرف' للدخول كمسؤول.";
                    }
                    return executeCommand(info.action, message);
                }
            }
            
            // الرد العادي
            return originalAI(message);
        };
        
        console.log('تم تحميل المساعد الذكي المتقدم');
    } catch (error) {
        console.error('خطأ في تحميل المساعد الذكي:', error);
    }
}

function showHelp() {
    let helpText = "الأوامر المتاحة:\n";
    
    // الأوامر العادية
    helpText += "- 'مساعدة': عرض هذه القائمة\n";
    helpText += "- 'معلوماتي': عرض معلومات جهازك\n";
    helpText += "- 'الأسرار': عرض الأوامر السرية\n";
    
    // الأوامر السرية غير المخفية
    for (const [cmd, info] of Object.entries(APP.secrets.commands)) {
        if (!info.adminOnly && cmd !== 'الأسرار') {
            helpText += `- '${cmd}': ${info.description}\n`;
        }
    }
    
    // إذا كان مستخدم مسؤول
    if (APP.user.isAdmin) {
        helpText += "\nأوامر المشرف:\n";
        for (const [cmd, info] of Object.entries(APP.secrets.commands)) {
            if (info.adminOnly) {
                helpText += `- '${cmd}': ${info.description}\n`;
            }
        }
    }
    
    return helpText;
}

function executeCommand(action, fullMessage) {
    switch(action) {
        case 'showSecrets':
            return listAllSecrets();
            
        case 'showDevInfo':
            return "👨‍💻 المطور: أحمد\n📧 البريد: example@example.com\n💼 التخصص: تطوير الويب والتطبيقات";
            
        case 'refreshApp':
            setTimeout(() => location.reload(), 1500);
            return "جاري إعادة تحميل التطبيق...";
            
        case 'showMyInfo':
            return showDeviceInfo();
            
        case 'adminLogin':
            return handleAdminLogin(fullMessage);
            
        case 'showVisitors':
            return showVisitorsData();
            
        default:
            return "أمر غير معروف";
    }
}

function listAllSecrets() {
    let secretsList = "🔒 الأوامر السرية:\n";
    for (const [cmd, info] of Object.entries(APP.secrets.commands)) {
        if (!info.adminOnly) {
            secretsList += `- '${cmd}': ${info.description}\n`;
        }
    }
    return secretsList;
}

function showDeviceInfo() {
    const info = APP.user.deviceInfo;
    let deviceInfo = "📱 معلومات جهازك:\n";
    
    deviceInfo += `- نوع الجهاز: ${info.deviceType}\n`;
    deviceInfo += `- نظام التشغيل: ${info.os}\n`;
    deviceInfo += `- المتصفح: ${info.browser}\n`;
    deviceInfo += `- محرك المتصفح: ${info.engine}\n`;
    deviceInfo += `- المعالج: ${info.cpuCores} نواة\n`;
    deviceInfo += `- الذاكرة: ${info.memory}GB\n`;
    deviceInfo += `- دقة الشاشة: ${info.screenSize}\n`;
    deviceInfo += `- اللغة: ${info.language}\n`;
    deviceInfo += `- المنطقة الزمنية: ${info.timezone}`;
    
    return deviceInfo;
}

function handleAdminLogin(message) {
    const password = message.split(' ')[1] || prompt('أدخل كلمة سر المشرف:');
    
    if (password === APP.config.adminPassword) {
        APP.user.isAdmin = true;
        return "✅ تم الدخول كمسؤول بنجاح. الآن يمكنك استخدام أوامر المشرف.";
    } else {
        return "❌ كلمة السر غير صحيحة. الوصول مرفوض.";
    }
}

// ====== نظام بيانات الزوار ======
function initVisitorSystem() {
    try {
        APP.visitors = JSON.parse(localStorage.getItem('visitorsData')) || [];
        recordNewVisit();
        console.log('نظام الزوار جاهز');
    } catch (error) {
        console.error('خطأ في نظام الزوار:', error);
    }
}

function recordNewVisit() {
    const visit = {
        timestamp: new Date().toISOString(),
        device: APP.user.deviceInfo,
        ip: 'جاري الجلب...',
        location: 'جاري الجلب...'
    };
    
    // جلب معلومات IP والموقع
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            visit.ip = data.ip || 'غير معروف';
            visit.location = `${data.city || 'غير معروف'}, ${data.country_name || 'غير معروف'}`;
            
            // حفظ البيانات
            APP.visitors.push(visit);
            localStorage.setItem('visitorsData', JSON.stringify(APP.visitors));
        })
        .catch(() => {
            visit.ip = 'غير متاح';
            visit.location = 'غير متاح';
            APP.visitors.push(visit);
            localStorage.setItem('visitorsData', JSON.stringify(APP.visitors));
        });
}

function showVisitorsData() {
    if (!APP.user.isAdmin) return "❌ تحتاج صلاحيات مشرف لرؤية هذه المعلومات.";
    
    if (APP.visitors.length === 0) return "لا توجد بيانات زوار مسجلة بعد.";
    
    let visitorsText = `👥 إجمالي الزوار: ${APP.visitors.length}\n\n`;
    visitorsText += "آخر 5 زيارات:\n";
    
    const lastVisits = APP.visitors.slice(-5).reverse();
    lastVisits.forEach((visit, index) => {
        visitorsText += `\n${index + 1}. ${new Date(visit.timestamp).toLocaleString('ar-EG')}\n`;
        visitorsText += `- الجهاز: ${visit.device.deviceType} (${visit.device.os})\n`;
        visitorsText += `- الموقع: ${visit.location}\n`;
        visitorsText += `- IP: ${visit.ip}\n`;
    });
    
    return visitorsText;
}

// ====== لوحة التحكم المطورة ======
function createControlPanel() {
    const panelHTML = `
    <div class="control-panel" id="control-panel">
        <button class="panel-btn" id="device-info-btn" title="معلومات جهازك">
            <i class="fas fa-mobile-alt"></i>
        </button>
        <button class="panel-btn" id="music-toggle-btn" title="المشغل الموسيقي">
            <i class="fas fa-music"></i>
        </button>
        ${APP.user.isAdmin ? `
        <button class="panel-btn admin-btn" id="visitors-btn" title="بيانات الزوار">
            <i class="fas fa-users"></i>
        </button>
        ` : ''}
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHTML);
    
    // أحداث الأزرار
    document.getElementById('device-info-btn').addEventListener('click', () => {
        const info = showDeviceInfo();
        showNotification(info, 'var(--info-color)');
    });
    
    document.getElementById('music-toggle-btn').addEventListener('click', toggleMusicPanel);
    
    if (APP.user.isAdmin) {
        document.getElementById('visitors-btn').addEventListener('click', () => {
            const visitorsInfo = showVisitorsData();
            showNotification(visitorsInfo, 'var(--admin-color)');
        });
    }
}

// ====== نظام الإشعارات المحسن ======
function showNotification(message, color = 'var(--primary-color)') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.backgroundColor = color;
    
    // إذا كان النص متعدد الأسطر
    if (message.includes('\n')) {
        const lines = message.split('\n');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            p.style.margin = '5px 0';
            notification.appendChild(p);
        });
    } else {
        notification.textContent = message;
    }
    
    // إضافة زر إغلاق للإشعارات الطويلة
    if (message.length > 100 || message.includes('\n')) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.className = 'notification-close';
        closeBtn.addEventListener('click', () => notification.remove());
        notification.appendChild(closeBtn);
    }
    
    document.body.appendChild(notification);
    
    // إخفاء الإشعار تلقائياً بعد 5 ثواني (ما لم يكن طويلاً)
    if (message.length <= 100 && !message.includes('\n')) {
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

function showErrorNotification(message) {
    showNotification(message, 'var(--error-color)');
}

// ====== حقن الأنماط المطلوبة ======
function injectStyles() {
    const styles = `
    :root {
        --primary-color: #4a6bff;
        --secondary-color: #ff6b4a;
        --success-color: #2ecc71;
        --error-color: #e74c3c;
        --info-color: #3498db;
        --admin-color: #9b59b6;
        --text-color: #333;
        --bg-color: #f5f7fa;
        --card-bg: #ffffff;
    }
    
    /* أنماط مشغل الموسيقى */
    .music-panel {
        background: var(--card-bg);
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        padding: 15px;
        width: 300px;
        max-width: 90%;
        z-index: 1001;
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .panel-header h3 {
        margin: 0;
        font-size: 1.2rem;
        color: var(--primary-color);
    }
    
    .panel-header button {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .player-container {
        display: flex;
        gap: 15px;
        align-items: center;
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
    }
    
    .time-display {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: #666;
        margin: 5px 0;
    }
    
    .control-buttons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 15px 0 10px;
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
    }
    
    .control-btn:hover {
        background: rgba(0,0,0,0.05);
    }
    
    .play-btn.playing {
        background: var(--primary-color);
        color: white;
    }
    
    .volume-control {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
    }
    
    .volume-control input[type="range"] {
        flex: 1;
    }
    
    /* زر تشغيل الموسيقى */
    .music-launcher-btn {
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
    }
    
    .music-launcher-btn:hover {
        transform: scale(1.1);
    }
    
    /* لوحة التحكم */
    .control-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    }
    
    .panel-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        transition: all 0.2s ease;
    }
    
    .panel-btn:hover {
        transform: translateY(-3px);
    }
    
    .admin-btn {
        background: var(--admin-color);
    }
    
    /* الإشعارات المخصصة */
    .custom-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 90%;
        width: max-content;
        max-width: 500px;
        padding: 15px 25px;
        border-radius: 12px;
        color: white;
        z-index: 2000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.4s ease;
        text-align: right;
        line-height: 1.6;
    }
    
    .notification-close {
        position: absolute;
        top: 5px;
        left: 5px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    @keyframes slideIn {
        from { bottom: -50px; opacity: 0; }
        to { bottom: 20px; opacity: 1; }
    }
    
    /* التنسيق العام */
    body {
        font-family: 'Tajawal', sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        background: var(--bg-color);
    }
    
    .card {
        margin: 15px 0;
        padding: 20px;
        background: var(--card-bg);
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.08);
    }
    
    /* تعديلات للوضع الداكن */
    body.dark-theme {
        --text-color: #f0f0f0;
        --bg-color: #1a1a1a;
        --card-bg: #2d2d2d;
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
    const progressPercent = (APP.music.player.currentTime / APP.music.player.duration) * 100;
    document.getElementById('music-progress').style.width = `${progressPercent}%`;
    document.getElementById('current-time').textContent = formatTime(APP.music.player.currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
