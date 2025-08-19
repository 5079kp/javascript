let countdownInterval; // global so we can clear it if needed

window.onload = () => {
    document.querySelector('#calculate').onclick = calculate;
    document.querySelector('#reset').onclick = resetCountdown;
    document.querySelector('#stop').onclick = stopCountdown;
}

function calculate() {
    const date = document.querySelector('#date').value;
    const time = document.querySelector('#time').value;

    const endTime = new Date(date + " " + time);

    // Clear any previous countdown
    clearInterval(countdownInterval);

    // Start new countdown
    countdownInterval = setInterval(() => calculateTime(endTime), 1000);  
}

function calculateTime(endTime) {
    const currentTime = new Date();

    const days = document.querySelector('#countdown-days');
    const hours = document.querySelector('#countdown-hours');
    const minutes = document.querySelector('#countdown-minutes');
    const seconds = document.querySelector('#countdown-seconds');

    if (endTime > currentTime) {
        const timeLeft = (endTime - currentTime) / 1000; // in seconds

        const d = Math.floor(timeLeft / (24 * 60 * 60));
        const h = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
        const m = Math.floor((timeLeft % (60 * 60)) / 60);
        const s = Math.floor(timeLeft % 60);

        days.innerText = d;
        hours.innerText = h;
        minutes.innerText = m;
        seconds.innerText = s;
    } else {
        clearInterval(countdownInterval);
        resetCountdown();
    }
}

function stopCountdown() {
    clearInterval(countdownInterval);
}

function resetCountdown() {
    clearInterval(countdownInterval);
    document.querySelector('#countdown-days').innerText = 0;
    document.querySelector('#countdown-hours').innerText = 0;
    document.querySelector('#countdown-minutes').innerText = 0;
    document.querySelector('#countdown-seconds').innerText = 0;
}
