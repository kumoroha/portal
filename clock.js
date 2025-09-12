let date = new Date();
let year;
let month;
let day;
let hour;
let min;
let sec;

function showdt() {
    date = new Date();
    timesp.innerHTML = `${years()}/${months()}/${days()} ${hours()}:${minute()}:${second()}`;
}
function years() {
    year = date.getFullYear();
    return year;
}
function months() {
    month = date.getMonth();
    month = month + 1;
    let leng = month.length;
    if (leng == 1) {
        month = `0${month}`;
    }
    return month;
}
function days() {
    day = format(date.getDate());
    return day;
}
function hours() {
    hour = format(date.getHours());
    return hour;
}
function minute() {
    min = format(date.getMinutes());
    return min;
}
function second() {
    sec = format(date.getSeconds());
    return sec;
}
function format(time) {
    return String(time).padStart(2, '0');
}

function youbi() {
    day = date.getDay;
    if (day == 0) {
        let youbi = 'Sun';
    }
    return day;
}