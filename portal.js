document.body.style.display = 'none';
const haikei = document.getElementById('haikei');
let timesp = document.getElementById('time'); //時計表示用
let sentaku = document.getElementById('sentaku');
let searchbox = document.getElementById('searchbox');
document.getElementById('searchbtn');
let yosoku = document.getElementById('yosoku');
let word;
let chhand = 0;
const kanji = document.getElementById('kanji');
const kl = document.getElementById('kanji-l');

new Suggest.Local('searchbox', 'yosoku', list, {dispMax: 10, highlight: true, dispAllKey: true, interval: 200, delim: ''});

let width = window.innerWidth;
if (width <= 1245) {
    if (confirm('画面の横幅が小さいです。表示が崩れる場合がありますが、表示させますか？') == true) {
        document.body.style.display = null;
    } else {
        alert('画面の横幅が小さいため、ページを表示できません。やり直すにはページを再読み込みしてください。');
    }
} else {
    document.body.style.display = null;
}
searchbox.focus();

function search() {
    word = searchbox.value;
    if (sentaku.value == 'search') {
        if (word.includes('https://') || word.includes('http://') || word.includes('file:///')) {
            window.open(word);
        } else if (word != '') {
            window.open(encodeURI(`https://www.google.com/search?q=${word}&ie=UTF-8`));
        } else {
            if (chhand == 0) {
                window.open('https://www.google.com/');
            }
            return;
        }
    } else if (sentaku.value == 'gyotakun' && word != '') {
        window.open(encodeURI(`https://www.google.com/search?q=${word}+site:megalodon.jp&ie=UTF-8`));
    } else if (sentaku.value == 'realtime' && word != '') {
        window.open(`https://search.yahoo.co.jp/realtime/search?ei=UTF-8&p=${word}&rkf=1`);
    } else if (sentaku.value == 'gyotaku' && word != '') {
        window.open(encodeURI(`https://megalodon.jp/pc/main?url=${word}`));
    } else {
        if (chhand == 0) {
            console.log('不正な語句が入力されたようです。入力しなおしてください。');
        }
    }
    searchbox.value = null;
    chhand = 0;
    searchbox.style.borderBottomLeftRadius = 'var(--radius)';
    searchbox.style.borderBottomRightRadius = 'var(--radius)';
}

window.document.onkeydown = function(event) {
    if (event.key === 'Enter') {
        search();
    }
}

searchbox.addEventListener('input', (event) => {
    if (searchbox.value != '') {
        searchbox.style.borderBottomLeftRadius = '0';
        searchbox.style.borderBottomRightRadius = '0';
        yosoku.style.borderTop = '0px';
    } else {
        searchbox.style.borderBottomLeftRadius = 'var(--radius)';
        searchbox.style.borderBottomRightRadius = 'var(--radius)';
    }
});

sentaku.addEventListener('change', (event) => {
    if (sentaku.value == 'tashiro') {
        window.open('田代砲v2/田代砲.html');
        sentaku.value = 'search';
    } else if (sentaku.value == 'realtime') {
        searchbox.placeholder = 'Xのリアルタイム検索';
        chhand = 1;
    } else if (sentaku.value == 'search') {
        searchbox.placeholder = 'Google検索 or URLをプロトコルから直接入力';
        chhand = 1;
    } else if (sentaku.value == 'gyotakun')  {
        searchbox.placeholder = '検索したい文献名を入力';
        chhand = 1;
    } else if (sentaku.value == 'gyotaku') {
        searchbox.placeholder = '検索したい文献URLをプロトコルから直接入力';
        chhand = 1;
    }
});

window.setInterval(showdt ,1000);
window.setInterval(birth ,120000);

function ts() {
    let tcompany = document.getElementById('tcomp').value;
    let trainnumber = document.getElementById('trainid').value;
    let trainalp = document.getElementById('tcode').value;
    window.open(`https://www.google.com/search?q=${tcompany}+${trainnumber}${trainalp}&ie=UTF-8`);
    document.getElementById('trainid') = '';
}

//RSS取得
const URL = 'https://ascii.jp/mac/rss.xml';
const copyr = document.getElementById('c');
let viewXML = (xmlDocument) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlDocument, 'text/xml');
    let rss = doc.documentElement.getElementsByTagName('item');
    for (let i = 0;i < 12;i++) {
        let rssTitle = rss[i].getElementsByTagName('title')[0].textContent;
        let rssLink = rss[i].getElementsByTagName('link')[0].textContent;
        const tagString = `<a href="${rssLink}" target="_blank">${rssTitle}</a><br>`;
        if (i == 0) {
            copyr.insertAdjacentHTML('beforebegin', '<h2 id="ascii">ASCIIのニュース</h2>');
        }
        copyr.insertAdjacentHTML('beforebegin', tagString);
    }
};
fetch(URL)
.then(response => response.text())
.then(xmlData => viewXML(xmlData));

haikei.addEventListener('change', (event) => {
    document.body.style.background = 'none';
    document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    document.body.style.backgroundBlendMode = 'screen';
    document.body.style.backgroundAttachment = 'fixed';
    if (haikei.value == 'rem-zero') {
        document.body.style.backgroundImage = 'url(rem.png)';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = '110%';
    } else if (haikei.value == 'rem') {
        document.body.style.backgroundImage = 'url(rem2.png)';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = '100%';
    //} else if (haikei.value == 'rem-d') {
    //    document.body.style.backgroundImage = 'url(rem2.png), url(rem.png)';
    //    document.body.style.backgroundRepeat = 'no-repeat, no-repeat';
    //    document.body.style.backgroundPosition = 'top, -140px 700px';
    //    document.body.style.backgroundSize = '100%, 120%';
    //    document.body.style.backgroundAttachment = null;
    } else if (haikei.value == 'paint') {
        document.body.style.backgroundImage = 'url(paint_00016.png)';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundColor = null;
        document.body.style.backgroundBlendMode = null;
        document.body.style.backgroundAttachment = null;
    } else if (haikei.value == 'white') {
        document.body.style.backgroundcolor = white;
    } else {
        let rh = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        if (rh == 1) {
            rh = 'b777jp.png';
        } else {
            rh = 'f2wep.png';
        }
        let imgurl = window.prompt('背景に設定するURLを入力してください。\nキャンセルする場合も、「OK」を押してください。\n(エラーの原因となります)', `${rh}`);
        if (imgurl === null) { //もしもの時
            haikei.value = 'paint';
            document.body.style.backgroundImage = 'url(paint_00016.png)';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundColor = null;
            document.body.style.backgroundBlendMode = null;
            document.body.style.backgroundAttachment = null;
        }
        document.body.style.backgroundImage = `url(${imgurl})`;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = '100%';
    }
});

function birth() {
    //month = 2;
    //day = 2
    if (month == 11 && day == 7) {
        timesp.style.color = '#66c8ff';
        timesp.style.textDecoration = 'underline';
        timesp.style.textDecorationColor = '#c0c0c0';
        timesp.style.textDecorationThickness = '5px';
    } else if (month == 2 && day == 2) {
        timesp.style.color = '#95c1ff'
        timesp.style.textDecoration = 'underline';
        timesp.style.textDecorationColor = '#ff9ecc';
        timesp.style.textDecorationThickness = '5px';
    }
}

kanji.addEventListener('input', (event) => {
    kl.textContent = kanji.value;
});