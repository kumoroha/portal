/* ==========================================================================
   script.js - Portal Page Core Logic (Power-Saving Edition)
   ========================================================================== */

// --- テーマ切り替えのロジック ---
const btnLight = document.getElementById('btnThemeLight');
const btnDark = document.getElementById('btnThemeDark');
const body = document.body;

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'light') {
        btnLight.classList.add('active');
        btnDark.classList.remove('active');
    } else {
        btnDark.classList.add('active');
        btnLight.classList.remove('active');
    }
}

// 初期設定の適用（未保存の場合はデフォルトでダークモードを適用）
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

btnLight.addEventListener('click', () => setTheme('light'));
btnDark.addEventListener('click', () => setTheme('dark'));

// --- スマート検索＆URL直接判定ロジック ---
document.getElementById('searchForm').addEventListener('submit', function(e) {
    const input = this.querySelector('.search-input');
    const query = input.value.trim();

    if (!query) {
        e.preventDefault();
        window.open('https://www.google.com', '_blank');
        return;
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

    if (urlPattern.test(query)) {
        e.preventDefault();
        let targetUrl = query;
        if (!/^https?:\/\//i.test(query)) {
            targetUrl = 'https://' + query;
        }
        window.open(targetUrl, '_blank');
        input.value = '';
    }
});

const filteredQuotes = quotesDb.filter(q => !q.text.startsWith('__'));

function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.style.opacity = 0;
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.innerText = filteredQuotes[randomIndex].text;
        quoteDisplay.style.opacity = 1;
    }, 250);
}

document.getElementById('quoteDisplay').addEventListener('click', displayRandomQuote);
displayRandomQuote();

// --- リアルタイムデジタルクロック ---
let dayProgressCounter = 0; 

function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = weekdays[now.getDay()];

    document.getElementById('clockTime').innerText = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clockDate').innerText = `${year}/${month}/${date} (${dayOfWeek})`;

    if (dayProgressCounter === 0 || dayProgressCounter >= 180) {
        calculateDayProgress(now);
        dayProgressCounter = 1; 
    } else {
        dayProgressCounter++;
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- 動的カレンダー生成 & 前後月切り替え ---
const currentCalendarDate = new Date(); 

function generateCalendar() {
    const now = new Date();
    const targetYear = currentCalendarDate.getFullYear();
    const targetMonth = currentCalendarDate.getMonth();

    const displayMonth = String(targetMonth + 1).padStart(2, '0');
    document.getElementById('calendarLink').innerText = `${targetYear}年 ${displayMonth}月`;

    const calendarGrid = document.getElementById('calendarGrid');
    const existingDays = calendarGrid.querySelectorAll('.day');
    existingDays.forEach(day => day.remove());

    const firstDayIndex = new Date(targetYear, targetMonth, 1).getDay(); 
    const lastDate = new Date(targetYear, targetMonth + 1, 0).getDate(); 

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day', 'empty');
        calendarGrid.appendChild(emptyCell);
    }

    for (let date = 1; date <= lastDate; date++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.innerText = date;

        if (date === now.getDate() && targetMonth === now.getMonth() && targetYear === now.getFullYear()) {
            dayCell.classList.add('today');
        }

        calendarGrid.appendChild(dayCell);
    }
}

document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    generateCalendar();
});

document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    generateCalendar();
});

document.getElementById('calendarLink').addEventListener('click', function(e) {
    currentCalendarDate.setTime(new Date().getTime());
    generateCalendar();
});

generateCalendar();

// --- Year Progress ---
function calculateYearProgress() {
    const now = new Date();
    const year = now.getFullYear();
    
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    
    const progress = (now - startOfYear) / (endOfYear - startOfYear);
    const percentage = (progress * 100).toFixed(2);
    
    document.getElementById('progressYearText').innerText = `${year} Progress`;
    document.getElementById('progressPercent').innerText = `${percentage}%`;
    document.getElementById('progressBarFill').style.width = `${percentage}%`;
}
calculateYearProgress();
setInterval(calculateYearProgress, 3600000);

// --- Day Progress ---
function calculateDayProgress(now) {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const totalSecondsInDay = 24 * 60 * 60; 
    
    const passedSeconds = (now - startOfDay) / 1000;
    const percentage = (passedSeconds / totalSecondsInDay * 100).toFixed(2);
    
    document.getElementById('progressDayPercent').innerText = `${percentage}%`;
    document.getElementById('progressBarDayFill').style.width = `${percentage}%`;
}

// --- 一言ガラスメモ ---
const memoTextarea = document.getElementById('quickMemo');
memoTextarea.value = localStorage.getItem('portal_quick_memo') || '';
memoTextarea.addEventListener('input', () => {
    localStorage.setItem('portal_quick_memo', memoTextarea.value);
});

/* ==========================================================================
   拡張子図鑑のデータ駆動 ＆ 高速検索フィルター機能
   ========================================================================== */

// アコーディオンの開閉状態を管理するグローバル変数
let isExtOpen = false;

// 拡張子図鑑を生成・更新する関数
function renderExtensionEncyclopedia(filterKeyword = '') {
    const gridContainer = document.getElementById('extGrid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ''; // 一旦クリア
    const keyword = filterKeyword.toLowerCase().trim();

    // 検索ワードがある場合は、拡張子(ext)か説明文(desc)に含まれているものだけを絞り込む
    const filteredDb = extensionsDb.filter(item => {
        return item.ext.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
    });

    // 該当するものが1つもない場合は「見つかりません」を表示
    if (filteredDb.length === 0) {
        const noResult = document.createElement('div');
        noResult.style.cssText = "grid-column: 1 / -1; color: var(--text-muted); text-align: center; padding: 24px 0; font-size: 0.95rem;";
        noResult.textContent = "一致する拡張子が見つかりませんでした。";
        gridContainer.appendChild(noResult);
        return;
    }

    const ul = document.createElement('ul');
    // 🚨 古い class="link-list" の影響を完全に断ち切るため、クラス名を無効化するか外します
    ul.className = "ext-dictionary-grid"; 
    
    // 👇 !important を付与して、CSSファイル側の古い設定を絶対に寄せ付けない無敵の3カラム命令にします
    ul.style.cssText = "display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 12px 24px !important; font-size: 0.95rem !important; color: var(--text-muted) !important; line-height: 1.6 !important; width: 100% !important; grid-column: 1 / -1 !important; list-style: none !important; padding: 0 !important; margin: 0 !important;";
    
    filteredDb.forEach(item => {
        const li = document.createElement('li');
        li.style.cssText = "margin-bottom: 0 !important; list-style: none !important; padding: 0 !important;";
        li.innerHTML = `<strong style="color: var(--text-main); font-size: 1.05rem;">${item.ext}</strong> - ${item.desc}`;
        ul.appendChild(li);
    });
    
    gridContainer.appendChild(ul);

    // 検索中（文字が入っている時）かつ図鑑が閉じている場合は、自動で中身を展開
    if (keyword.length > 0 && !isExtOpen) {
        forceOpenAccordion();
    }
}

// アコーディオンを外部から強制的に開く処理
function forceOpenAccordion() {
    const extContent = document.getElementById('extContent');
    const extToggleIcon = document.getElementById('extToggleIcon');
    if (!extContent || !extToggleIcon) return;

    isExtOpen = true;
    extContent.style.maxHeight = extContent.scrollHeight + "px";
    extContent.style.marginTop = "16px";
    extToggleIcon.style.transform = "rotate(180deg)";
}

// プルダウンおよび検索イベントの初期化ロジック
function initExtensionAccordion() {
    const extHeader = document.getElementById('extHeader');
    const extContent = document.getElementById('extContent');
    const extToggleIcon = document.getElementById('extToggleIcon');
    const extSearchInput = document.getElementById('extSearchInput');
    
    if (!extHeader || !extContent || !extToggleIcon || !extSearchInput) return;

    // ヘッダーがクリックされた時の開閉処理
    extHeader.addEventListener('click', (e) => {
        // 検索窓の中身がクリックされた時は、アコーディオンを閉じないようにガード
        if (e.target === extSearchInput) return;

        isExtOpen = !isExtOpen;
        if (isExtOpen) {
            extContent.style.maxHeight = extContent.scrollHeight + "px";
            extContent.style.marginTop = "16px";
            extToggleIcon.style.transform = "rotate(180deg)";
        } else {
            extContent.style.maxHeight = "0";
            extContent.style.marginTop = "0";
            extToggleIcon.style.transform = "rotate(0deg)";
            extSearchInput.value = ''; // 閉じたときは検索をリセット
            renderExtensionEncyclopedia(); 
        }
    });

    // 検索窓に文字が入力されるたびにリアルタイムでフィルターをかける
    extSearchInput.addEventListener('input', (e) => {
        const word = e.target.value;
        renderExtensionEncyclopedia(word);
        
        if (isExtOpen) {
            extContent.style.maxHeight = extContent.scrollHeight + "px";
        }
    });
}

// 初期実行
renderExtensionEncyclopedia();
initExtensionAccordion();
