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

// --- ジャンル限定ランダム名言・格言データベース ---
const quotesDb = [
    { text: "「ソフトウェアがいかに複雑であっても、それは最終的には単純なものの組み合わせに過ぎない。」", category: "Tech" },
    { text: "「未来を予測する最善の方法は、それを発明することだ。」 — アラン・ケイ", category: "Tech" },
    { text: "「完璧が達成されるのは、何も加えるものがなくなった時ではなく、何も削るものがなくなった時だ。」 — アントワーヌ・ド・サン＝テグジュペリ", category: "Tech" },
    { text: "「Talk is cheap. Show me the code. (口舌は安っぽい。コードを見せろ。)」 — リーナス・トーバルズ", category: "Tech" },
    { text: "「もう誰にも頼らない。誰に分かってもらう必要もない」 — 暁美ほむら（魔法少女まどか☆マギカ）", category: "Anime" },
    { text: "「心配すんなよ、さやか。独りぼっちは、寂しいもんな……。いいよ、一緒にいてやるよ」 — 佐倉杏子（魔法少女まどか☆マギカ）", category: "Anime" },
    { text: "「失ったものを数えちゃいけない。これから何を作るかが大事なんだよ」 — 錦木千束（リコリス・リコイル）", category: "Anime" },
    { text: "「他人に期待するから、裏切られたように感じるのよ。最初から自分一人でやればいいの」 — アリサ・ミハイロヴナ・九条（時々ボソッとロシア語でデレる隣のアーリャさん）", category: "Anime" },
    { text: "「奇跡も、魔法も、あるんだよ」 — 美樹さやか（魔法少女まどか☆マギカ）", category: "Anime" },
    { text: "「もし、フェアな戦いをしているなら、それはあなたの戦術が間違っているということだ」 — デヴィッド・ハックワース（米陸軍大佐）", category: "Military" },
    { text: "「作戦計画は、敵と接触した瞬間に大抵使い物にならなくなる。しかし、計画を立てるプロセスそのものが不可欠なのだ。」 — ヘルムート・フォン・モルトケ", category: "Military" },
    { text: "「最も優れた戦術とは、戦わずして敵を屈服させることである。」 — 孫子" }
];

function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.style.opacity = 0;
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotesDb.length);
        quoteDisplay.innerText = quotesDb[randomIndex].text;
        quoteDisplay.style.opacity = 1;
    }, 250);
}

document.getElementById('quoteDisplay').addEventListener('click', displayRandomQuote);
displayRandomQuote();

// --- リアルタイムデジタルクロック ---
let dayProgressCounter = 0; // 3分間引き用の秒数カウンタ

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

    // 時計の表示更新（1秒ごと）
    document.getElementById('clockTime').innerText = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clockDate').innerText = `${year}/${month}/${date} (${dayOfWeek})`;

    // 初回起動時、または180秒（3分）が経過したタイミングでのみ1日の経過度を計算
    if (dayProgressCounter === 0 || dayProgressCounter >= 180) {
        calculateDayProgress(now);
        dayProgressCounter = 1; // カウントリセット（1秒目）
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

// --- Year Progress （2027年以降も自動対応・1時間ごと更新） ---
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

// --- Day Progress (超省電力仕様・3分に1回駆動) ---
function calculateDayProgress(now) {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const totalSecondsInDay = 24 * 60 * 60; // 86400秒
    
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
