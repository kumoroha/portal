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

    // 重複していたエスケープ文字（バックスラッシュ）を完全に修正済み
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

    if (urlPattern.test(query)) {
        e.preventDefault();
        let url = query;
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        window.open(url, '_blank');
    }
});

// --- ランダム名言・格言表示ロジック（パワーセーブ版） ---
let currentQuoteCategory = "Tech"; 

function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (!quoteDisplay) return;

    const filteredQuotes = quotesDb.filter(q => q.category === currentQuoteCategory);
    if (filteredQuotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    
    quoteDisplay.style.opacity = 0;
    setTimeout(() => {
        quoteDisplay.textContent = filteredQuotes[randomIndex].text;
        quoteDisplay.style.opacity = 1;
    }, 200);
}

document.getElementById('quoteDisplay')?.addEventListener('click', () => {
    currentQuoteCategory = (currentQuoteCategory === "Tech") ? "Anime" : "Tech";
    displayRandomQuote();
});

// --- デジタル時計ロジック（省電力・高精度版） ---
function updateClock() {
    const clockTime = document.getElementById('clockTime');
    const clockDate = document.getElementById('clockDate');
    if (!clockTime || !clockDate) return;

    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockTime.textContent = `${hours}:${minutes}:${seconds}`;

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNames[now.getDay()];
    clockDate.textContent = `${yyyy}.${mm}.${dd} [${dayName}]`;

    const msUntilNextSecond = 1000 - now.getMilliseconds();
    setTimeout(updateClock, msUntilNextSecond);
}

// --- カレンダーロジック（ドロップダウン＆ボタン移動対応版） ---
let calDate = new Date();

function renderCalendar() {
    const calGrid = document.getElementById('calendarGrid');
    if (!calGrid) return;

    // ヘッダー部分をドロップダウン用に動的生成
    setupCalendarHeader();

    // グリッドの初期化（曜日ヘッダーはHTML側にあるため、日付セルのみをクリア）
    const days = calGrid.querySelectorAll('.day');
    days.forEach(d => d.remove());

    const year = calDate.getFullYear();
    const month = calDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    // 空白のセルを挿入
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day empty';
        calGrid.appendChild(emptyCell);
    }

    // 日付のセルを挿入
    for (let dayNum = 1; dayNum <= lastDay; dayNum++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        dayCell.textContent = dayNum;

        if (year === today.getFullYear() && month === today.getMonth() && dayNum === today.getDate()) {
            dayCell.classList.add('today');
        }

        calGrid.appendChild(dayCell);
    }
}

// カレンダー上部の年・月選択コントロールのセットアップ
function setupCalendarHeader() {
    if (document.readyState === 'loading') return; // 💡DOM読み込み中の空振りを防ぐ安全装置
    const headerContainer = document.querySelector('.calendar-header-container');
    if (!headerContainer) return;

    // すでにドロップダウンが生成されているか確認
    let selectYear = document.getElementById('calSelectYear');
    let selectMonth = document.getElementById('calSelectMonth');

    // まだ生成されていない、または構造が古い場合はコンテナ内を再構築
    if (!selectYear || !selectMonth) {
        headerContainer.innerHTML = `
            <button class="cal-btn" id="prevMonth">◀</button>
            <div style="display: flex; gap: 6px; align-items: center;">
                <select id="calSelectYear" style="padding: 2px 4px; font-size: 0.95rem; font-weight: bold; border: 1px solid var(--card-border); border-radius: 4px; background: var(--search-bg); color: var(--text-main); outline: none; cursor: pointer;"></select>
                <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: bold;">年</span>
                <select id="calSelectMonth" style="padding: 2px 4px; font-size: 0.95rem; font-weight: bold; border: 1px solid var(--card-border); border-radius: 4px; background: var(--search-bg); color: var(--text-main); outline: none; cursor: pointer;"></select>
                <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: bold;">月</span>
            </div>
            <button class="cal-btn" id="nextMonth">▶</button>
        `;

        selectYear = document.getElementById('calSelectYear');
        selectMonth = document.getElementById('calSelectMonth');

        // 年の選択肢を生成（現在の年から前後5年をループ生成）
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 5; y <= currentYear + 5; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            selectYear.appendChild(opt);
        }

        // 月の選択肢を生成（1〜12月）
        for (let m = 1; m <= 12; m++) {
            const opt = document.createElement('option');
            opt.value = m - 1; // JavaScriptのMonthIndex(0-11)に合わせる
            opt.textContent = m;
            selectMonth.appendChild(opt);
        }

        // ドロップダウン変更時のイベント
        selectYear.addEventListener('change', (e) => {
            calDate.setFullYear(parseInt(e.target.value));
            renderCalendar();
        });

        selectMonth.addEventListener('change', (e) => {
            calDate.setMonth(parseInt(e.target.value));
            renderCalendar();
        });

        // ◀ ▶ ボタンのイベントを再割り当て
        document.getElementById('prevMonth').addEventListener('click', () => {
            calDate.setMonth(calDate.getMonth() - 1);
            renderCalendar();
        });
        document.getElementById('nextMonth').addEventListener('click', () => {
            calDate.setMonth(calDate.getMonth() + 1);
            renderCalendar();
        });

        // Googleカレンダーリンクをカレンダーの「真下」へ移動・整形する処理
        moveCalendarLink();
    }

    // 現在表示中のカレンダーの年月をセレクトボックスに反映
    selectYear.value = calDate.getFullYear();
    selectMonth.value = calDate.getMonth();
}

// 元々上部にあったカレンダーリンクを自動的に回収し、カレンダーの下部にボタン風にして移植する
function moveCalendarLink() {
    if (document.readyState === 'loading') return; // 💡DOM読み込み中の空振りを防ぐ安全装置
    const originalLink = document.querySelector('.calendar-link');
    const calGrid = document.getElementById('calendarGrid');
    
    if (originalLink && calGrid) {
        // すでに移動済みの下部リンクが存在するかチェック
        let bottomLinkContainer = document.getElementById('calBottomLinkContainer');
        if (!bottomLinkContainer) {
            bottomLinkContainer = document.createElement('div');
            bottomLinkContainer.id = 'calBottomLinkContainer';
            bottomLinkContainer.style.marginTop = '16px';
            bottomLinkContainer.style.textAlign = 'center';
            
            // リンクをカードのデザインに馴染む美しい「ボタン風」に整形
            originalLink.style.display = 'inline-block';
            originalLink.style.width = '100%';
            originalLink.style.padding = '8px 12px';
            originalLink.style.fontSize = '0.9rem';
            originalLink.style.fontWeight = '600';
            originalLink.style.textAlign = 'center';
            originalLink.style.textDecoration = 'none';
            originalLink.style.border = '1px solid var(--card-border)';
            originalLink.style.borderRadius = '8px';
            originalLink.style.background = 'var(--bar-bg)';
            originalLink.style.color = 'var(--text-main)';
            originalLink.style.transition = 'all 0.2s ease';
            
            // ホバーエフェクトの制御
            originalLink.addEventListener('mouseenter', () => {
                originalLink.style.borderColor = 'var(--search-focus-border)';
                originalLink.style.background = 'var(--search-bg)';
                originalLink.style.boxShadow = '0 2px 8px var(--search-focus-glow)';
            });
            originalLink.addEventListener('mouseleave', () => {
                originalLink.style.borderColor = 'var(--card-border)';
                originalLink.style.background = 'var(--bar-bg)';
                originalLink.style.boxShadow = 'none';
            });

            // カレンダーグリッドのすぐ後ろ（下）に挿入
            calGrid.parentNode.insertBefore(bottomLinkContainer, calGrid.nextSibling);
            bottomLinkContainer.appendChild(originalLink);
        }
    }
}

// --- 今年（2026年）の経過プログレスバーロジック ---
function updateYearProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressDays = document.getElementById('progressDays');
    if (!progressFill || !progressPercent || !progressDays) return;

    const now = new Date();
    const year = now.getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const totalMs = endOfYear - startOfYear;
    const elapsedMs = now - startOfYear;

    const percent = (elapsedMs / totalMs) * 100;
    progressFill.style.width = percent.toFixed(4) + '%';
    progressPercent.textContent = percent.toFixed(1) + '%';

    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    progressDays.textContent = `${elapsedDays} / ${totalDays} DAYS`;
}

// --- 一言ガラスメモのローカルストレージ保存ロジック ---
function initGlassMemo() {
    const memoTextarea = document.getElementById('memoTextarea');
    if (!memoTextarea) return;

    memoTextarea.value = localStorage.getItem('portal_glass_memo') || '';

    memoTextarea.addEventListener('input', (e) => {
        localStorage.setItem('portal_glass_memo', e.target.value);
    });
}

// --- 拡張子図鑑（アコーディオン）の描画ロジック ---
let isExtOpen = false; 

function renderExtensionEncyclopedia(filterWord = "") {
    const extListContainer = document.getElementById('extListContainer');
    if (!extListContainer) return;

    extListContainer.innerHTML = "";
    const word = filterWord.toLowerCase().trim();

    const filtered = extensionDb.filter(item => {
        return item.ext.toLowerCase().includes(word) || item.desc.toLowerCase().includes(word);
    });

    if (filtered.length === 0) {
        extListContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 20px 0;">一致する拡張子が見つかりません</p>`;
        return;
    }

    filtered.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'ext-item';
        itemDiv.style.padding = '10px 14px';
        itemDiv.style.background = 'rgba(255, 255, 255, 0.02)';
        itemDiv.style.border = '1px solid var(--card-border)';
        itemDiv.style.borderRadius = '8px';
        itemDiv.style.fontSize = '0.9rem';
        itemDiv.style.lineHeight = '1.4';
        itemDiv.style.transition = 'all 0.2s ease';

        itemDiv.innerHTML = `
            <strong style="color: var(--accent-color); font-size: 1.05rem; display: block; margin-bottom: 4px;">${item.ext}</strong>
            <span style="color: var(--text-main); font-size: 0.85rem;">${item.desc}</span>
        `;
        
        extListContainer.appendChild(itemDiv);
    });
}

// プルダウンおよび検索イベントの初期化ロジック
function initExtensionAccordion() {
    const extHeader = document.getElementById('extHeader');
    const extContent = document.getElementById('extContent');
    const extToggleIcon = document.getElementById('extToggleIcon');
    const extSearchInput = document.getElementById('extSearchInput');
    
    if (!extHeader || !extContent || !extToggleIcon || !extSearchInput) return;

    extHeader.addEventListener('click', (e) => {
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
            extSearchInput.value = ''; 
            renderExtensionEncyclopedia(); 
        }
    });

    extSearchInput.addEventListener('input', (e) => {
        const word = e.target.value;
        renderExtensionEncyclopedia(word);
        
        if (isExtOpen) {
            extContent.style.maxHeight = "none";
        }
    });
}

// --- ページ読み込み時の初期化一括実行 ---
window.addEventListener('DOMContentLoaded', () => {
    displayRandomQuote();
    updateClock();
    renderCalendar();
    updateYearProgress();
    initGlassMemo();
    renderExtensionEncyclopedia();
    initExtensionAccordion();
    
    setInterval(updateYearProgress, 60000);
});
