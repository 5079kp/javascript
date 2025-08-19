let nextdate = new Date("2025-12-31T00:00:00").getTime();

function calc() {
    let now = new Date().getTime();
    let remaningTime = nextdate - now;

    let days = Math.floor(remaningTime / (1000 * 60 * 60 * 24));
    let hours = Math.floor((remaningTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((remaningTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remaningTime % (1000 * 60)) / 1000);

    if (remaningTime >= 0) {
        document.getElementById("day").textContent = `${days}d`;
        document.getElementById("hours").textContent = `${hours}h`;
        document.getElementById("mins").textContent = `${minutes}m`;
        document.getElementById("sec").textContent = `${seconds}s`;
        document.getElementById("text2").textContent =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        clearInterval(timerInterval);
        document.getElementById("text2").textContent = "EXPIRED";
    }
}

calc();
let timerInterval = setInterval(calc, 1000);

// Quote Rotator
let quotes = [
    "“Be yourself; everyone else is already taken.”",
    "“Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.”",
    "“So many books, so little time.”",
    "“A room without books is like a body without a soul.”",
    "“You know you're in love when you can't fall asleep because reality is finally better than your dreams.”"
];

let textBox = document.getElementById("text");

function getquote() {
    let value = Math.floor(Math.random() * quotes.length);
    textBox.style.opacity = 0; // fade out
    setTimeout(() => {
        textBox.textContent = quotes[value];
        textBox.style.opacity = 1; // fade in
    }, 500);
}

getquote();
setInterval(getquote, 10000);
