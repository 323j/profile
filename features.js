/**
 * ملف المميزات الإضافية لصفحة الملف الشخصي
 * الإصدار 1.0
 * يحتوي على مميزات جديدة:
 * 1- مشغل أغاني متطور
 * 2- ردود إضافية للمساعد الذكي
 * 3- ميزة جمع بيانات الزوار
 * 4- زر تشغيل الأغاني الجديد
 */

// ========== مشغل الأغاني المحسن ==========
function initEnhancedMusicPlayer() {
    const musicPlayer = document.createElement('div');
    musicPlayer.className = 'audio-player';
    musicPlayer.id = 'enhanced-music-player';
    musicPlayer.innerHTML = `
        <div class="player-header">
            <h3 class="player-title"><i class="fas fa-music"></i> مشغل الأغاني</h3>
            <button class="toggle-player" id="toggle-music-player"><i class="fas fa-minus"></i></button>
        </div>
        <div class="player-controls">
            <button class="control-button" id="prev-song"><i class="fas fa-step-backward"></i></button>
            <button class="control-button" id="play-pause"><i class="fas fa-play"></i></button>
            <button class="control-button" id="next-song"><i class="fas fa-step-forward"></i></button>
        </div>
        <div class="progress-container-audio">
            <div class="progress-bar-audio" id="music-progress"></div>
        </div>
        <div class="time-display">
            <span id="current-time">00:00</span>
            <span id="duration">00:00</span>
        </div>
        <div class="volume-control">
            <i class="fas fa-volume-down"></i>
            <input type="range" min="0" max="100" value="50" class="volume-slider" id="volume-slider">
            <i class="fas fa-volume-up"></i>
        </div>
        <div class="playlist" id="music-playlist">
            <div class="playlist-item active" data-src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">أغنية 1</div>
            <div class="playlist-item" data-src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3">أغنية 2</div>
            <div class="playlist-item" data-src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3">أغنية 3</div>
        </div>
    `;
    document.body.appendChild(musicPlayer);

    // زر تشغيل الأغاني الجديد
    const musicButton = document.createElement('div');
    musicButton.className = 'ai-assistant music-button';
    musicButton.id = 'music-button';
    musicButton.innerHTML = '<i class="fas fa-music"></i>';
    musicButton.style.right = '90px';
    musicButton.style.backgroundColor = 'var(--audio-color)';
    document.body.appendChild(musicButton);

    // متغيرات مشغل الأغاني
    const audio = new Audio();
    let currentSongIndex = 0;
    let isPlaying = false;
    const songs = Array.from(document.querySelectorAll('.playlist-item'));
    
    // تحميل الأغنية
    function loadSong(index) {
        currentSongIndex = index;
        const song = songs[index];
        audio.src = song.getAttribute('data-src');
        
        // تحديث الواجهة
        songs.forEach(s => s.classList.remove('active'));
        song.classList.add('active');
        
        // عند تحميل البيانات
        audio.addEventListener('loadedmetadata', () => {
            document.getElementById('duration').textContent = formatTime(audio.duration);
        });
        
        if (isPlaying) audio.play();
    }
    
    // تشغيل/إيقاف
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play();
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    }
    
    // التنسيق الزمني
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // تحديث شريط التقدم
    function updateProgress() {
        const progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById('music-progress').style.width = `${progress}%`;
        document.getElementById('current-time').textContent = formatTime(audio.currentTime);
    }
    
    // ضبط موضع التشغيل
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }
    
    // الأحداث
    document.getElementById('play-pause').addEventListener('click', togglePlay);
    document.getElementById('prev-song').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) audio.play();
    });
    document.getElementById('next-song').addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) audio.play();
    });
    document.getElementById('volume-slider').addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
    document.getElementById('music-progress').parentElement.addEventListener('click', setProgress);
    document.getElementById('toggle-music-player').addEventListener('click', () => {
        document.getElementById('enhanced-music-player').classList.toggle('collapsed');
    });
    document.getElementById('music-button').addEventListener('click', () => {
        document.getElementById('enhanced-music-player').classList.toggle('open');
    });
    
    // النقر على الأغاني في القائمة
    songs.forEach((song, index) => {
        song.addEventListener('click', () => {
            loadSong(index);
            if (isPlaying) audio.play();
        });
    });
    
    // أحداث الصوت
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        audio.play();
    });
    
    // تحميل أول أغنية
    loadSong(0);
}

// ========== ردود إضافية للمساعد الذكي ==========
function enhanceAIResponses() {
    // استبدال دالة getAIResponse الأصلية
    window.getAIResponse = function(message) {
        const lowerMessage = message.toLowerCase();
        
        // كلمات سرية لعرض بيانات الزوار
        if (lowerMessage.includes('داتا') || lowerMessage.includes('بيانات') || lowerMessage.includes('data')) {
            showVisitorData();
            return 'لقد قمت بفتح نافذة بيانات الزوار السرية. يمكنك رؤية المعلومات التي تم جمعها.';
        }
        
        // ردود إضافية
        if (lowerMessage.includes('أغاني') || lowerMessage.includes('موسيقى') || lowerMessage.includes('اغاني')) {
            return 'يمكنك تشغيل الأغاني من خلال مشغل الأغاني في الزاوية اليسرى السفلية. يحتوي المشغل على عدة أغاني يمكنك الاختيار منها.';
        }
        
        if (lowerMessage.includes('مساعدة') || lowerMessage.includes('مساعده')) {
            return `يمكنني مساعدتك في:
1- معرفة معلومات عن صاحب الملف (اسأل عن المهارات أو الخبرات)
2- تشغيل الأغاني (اكتب "أغاني")
3- عرض معلومات الخصوصية (اكتب "خصوصية")
4- عرض بيانات الزوار (اكتب "داتا")
5- أي استفسار آخر وسأحاول مساعدتك`;
        }
        
        if (lowerMessage.includes('مرحبا') || lowerMessage.includes('السلام')) {
            return 'وعليكم السلام ورحمة الله وبركاته! كيف يمكنني مساعدتك اليوم؟ اكتب "مساعدة" لرؤية الأوامر المتاحة.';
        } 
        
        // الرد الافتراضي إذا لم يتطابق مع أي شيء
        return 'آسف، لم أفهم سؤالك. اكتب "مساعدة" لرؤية الأوامر المتاحة أو اسأل عن شيء محدد.';
    };
}

// ========== ميزة جمع بيانات الزوار ==========
function initVisitorDataCollection() {
    // عنصر لعرض بيانات الزوار
    const visitorDataPanel = document.createElement('div');
    visitorDataPanel.className = 'privacy-info';
    visitorDataPanel.id = 'visitor-data-panel';
    visitorDataPanel.innerHTML = `
        <div class="privacy-header">
            <h3 class="privacy-title"><i class="fas fa-database"></i> بيانات الزوار</h3>
            <button class="close-privacy" id="close-visitor-data">&times;</button>
        </div>
        <div class="privacy-content" id="visitor-data-content">
            <div class="privacy-item">
                <span class="privacy-label"><i class="fas fa-users"></i> إجمالي الزوار</span>
                <div class="privacy-value" id="total-visitors">0</div>
            </div>
            <div class="privacy-item">
                <span class="privacy-label"><i class="fas fa-clock"></i> زمن الزيارة</span>
                <div class="privacy-value" id="visitors-time">لا توجد بيانات</div>
            </div>
            <div class="privacy-item">
                <span class="privacy-label"><i class="fas fa-globe"></i> الدول</span>
                <div class="privacy-value" id="visitors-countries">لا توجد بيانات</div>
            </div>
            <div class="privacy-item">
                <span class="privacy-label"><i class="fas fa-desktop"></i> الأجهزة</span>
                <div class="privacy-value" id="visitors-devices">لا توجد بيانات</div>
            </div>
            <div class="privacy-warning">
                <i class="fas fa-exclamation-triangle"></i> هذه المعلومات تستخدم لأغراض إحصائية فقط
            </div>
        </div>
    `;
    document.body.appendChild(visitorDataPanel);
    
    // إغلاق نافذة البيانات
    document.getElementById('close-visitor-data').addEventListener('click', () => {
        document.getElementById('visitor-data-panel').classList.remove('open');
    });
    
    // بيانات الزوار (محاكاة للتخزين - في الواقع يجب استخدام قاعدة بيانات)
    let visitorsData = JSON.parse(localStorage.getItem('visitorsData')) || {
        total: 0,
        countries: {},
        devices: {},
        times: []
    };
    
    // زيادة عدد الزوار عند التحميل
    visitorsData.total++;
    localStorage.setItem('visitorsData', JSON.stringify(visitorsData));
    
    // جلب معلومات الزائر الحالي
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            // تحديث بيانات الدول
            const country = data.country_name || 'غير معروف';
            visitorsData.countries[country] = (visitorsData.countries[country] || 0) + 1;
            
            // تحديث بيانات الأجهزة
            const userAgent = navigator.userAgent;
            let deviceType = 'كمبيوتر';
            if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
                deviceType = 'هاتف';
                if (/Tablet|iPad/i.test(userAgent)) deviceType = 'جهاز لوحي';
            }
            visitorsData.devices[deviceType] = (visitorsData.devices[deviceType] || 0) + 1;
            
            // تحديث أوقات الزيارة
            const now = new Date();
            visitorsData.times.push(now.toISOString());
            
            // حفظ البيانات المحدثة
            localStorage.setItem('visitorsData', JSON.stringify(visitorsData));
        })
        .catch(() => {
            console.log('تعذر جلب معلومات الموقع');
        });
}

// عرض بيانات الزوار
function showVisitorData() {
    const visitorsData = JSON.parse(localStorage.getItem('visitorsData')) || {
        total: 0,
        countries: {},
        devices: {},
        times: []
    };
    
    // تحديث الواجهة
    document.getElementById('total-visitors').textContent = visitorsData.total;
    
    // عرض الدول
    const countriesList = Object.entries(visitorsData.countries)
        .map(([country, count]) => `${country}: ${count}`)
        .join(', ') || 'لا توجد بيانات';
    document.getElementById('visitors-countries').textContent = countriesList;
    
    // عرض الأجهزة
    const devicesList = Object.entries(visitorsData.devices)
        .map(([device, count]) => `${device}: ${count}`)
        .join(', ') || 'لا توجد بيانات';
    document.getElementById('visitors-devices').textContent = devicesList;
    
    // عرض أوقات الزيارة
    const lastVisit = visitorsData.times.length > 0 ? 
        new Date(visitorsData.times[visitorsData.times.length - 1]).toLocaleString('ar-EG') : 
        'لا توجد بيانات';
    document.getElementById('visitors-time').textContent = lastVisit;
    
    // عرض النافذة
    document.getElementById('visitor-data-panel').classList.add('open');
}

// ========== تهيئة جميع المميزات ==========
function initAllFeatures() {
    initEnhancedMusicPlayer();
    enhanceAIResponses();
    initVisitorDataCollection();
    
    // إضافة إشعار بعد التحميل
    setTimeout(() => {
        addNotification('تم تحميل المميزات الجديدة بنجاح!', 'var(--primary-color)');
        addNotification('اكتب "مساعدة" في المساعد الذكي لرؤية الأوامر الجديدة', 'var(--ai-color)');
    }, 3000);
}

// تنفيذ عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', initAllFeatures);
