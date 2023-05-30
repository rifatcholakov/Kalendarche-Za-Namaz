if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.error('service worker not registered', err))
}

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/time.json");
    const prayerTimeTable = await response.json();

    const userDateInfo = getCurrentUserDate();

    const currentMonthPrayerTable = prayerTimeTable[userDateInfo.currentMonth];
    const currentDatePrayerTable = currentMonthPrayerTable[userDateInfo.currentDate]
    
    renderCurrentDate(userDateInfo);
    renderPrayers(currentDatePrayerTable);
});

function renderCurrentDate(userDateInfo) {
    const currentDate = document.querySelector("#current-date")
    currentDate.textContent = `${userDateInfo.currentDate}/${userDateInfo.currentMonth}/${userDateInfo.currentYear}`;
}

function renderPrayers(prayerTimes) {
    const down = document.querySelector("#down");
    const sunrise = document.querySelector("#sunrise");
    const dhuhr = document.querySelector("#dhuhr");
    const asr = document.querySelector("#asr");
    const maghrib = document.querySelector("#maghrib");
    const isha = document.querySelector("#isha");

    down.textContent = prayerTimes.down;
    sunrise.textContent = prayerTimes.sunrise;
    dhuhr.textContent = prayerTimes.dhuhr;
    asr.textContent = prayerTimes.asr;
    maghrib.textContent = prayerTimes.maghrib;
    isha.textContent = prayerTimes.isha;
}

function getCurrentUserDate() {
    const currentUserTimeAsTimeStamp = Date.now();
    const fullDate = new Date(currentUserTimeAsTimeStamp);
    const currentMonth = fullDate.getMonth();
    const currentDate = fullDate.getDate();
    const currentYear = fullDate.getFullYear();

    return {
        fullDate,
        currentYear,
        currentMonth,
        currentDate
    }
}

function calculateNightPrayer() {
    
}