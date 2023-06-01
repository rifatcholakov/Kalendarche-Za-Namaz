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
    
    const nextDate = getNextDate(userDateInfo.fullDate, 1);
    const nextMonthPrayerTable = prayerTimeTable[nextDate.nextMonth];
    const nextDayPrayerTable = nextMonthPrayerTable[nextDate.nextDate];
    renderPrayers(nextDayPrayerTable, nextDate.fullNextDate);
    
    // calculateNightPrayer(currentDatePrayerTable.maghrib, nextDayPrayerTable.sunrise);
});

function renderCurrentDate(userDateInfo) {
    const currentDate = document.querySelector("#current-date")
    currentDate.textContent = `${userDateInfo.currentDate}/${userDateInfo.currentMonth}/${userDateInfo.currentYear}`;
}

function renderPrayers(prayerTimes, date) {
    const allDaysPrayersWrapper = document.querySelector("#all-days-prayers-wrapper");

    if(date) {
        const prayerDateHtml = getPayerDateTemplate(date);
        allDaysPrayersWrapper.insertAdjacentHTML("beforeend", prayerDateHtml);
    }

    ({ down, sunrise, dhuhr, asr, maghrib, isha } = prayerTimes);
    const prayersHtml = getPrayerTemplate(down, sunrise, dhuhr, asr, maghrib, isha);
    
    allDaysPrayersWrapper.insertAdjacentHTML("beforeend", prayersHtml);
}

function getCurrentUserDate() {
    const currentUserTimeAsTimeStamp = Date.now();
    const fullDate = new Date(currentUserTimeAsTimeStamp);
    const currentMonth = fullDate.getMonth() + 1;
    const currentDate = fullDate.getDate();
    const currentYear = fullDate.getFullYear();

    return {
        fullDate,
        currentYear,
        currentMonth,
        currentDate
    }
}

function getNextDate(currentUserDate, daysLater) {
    const currentDate = currentUserDate.getDate();
    const nextDateAsTimeStamp = currentUserDate.setDate(currentDate + daysLater);
    const fullNextDate = new Date(nextDateAsTimeStamp);
    const nextYear = fullNextDate.getFullYear();
    const nextMonth = fullNextDate.getMonth() + 1;
    const nextDate = fullNextDate.getDate();
    
    return {
        fullNextDate,
        nextYear,
        nextMonth,
        nextDate
    };
}

// function calculateNightPrayer(maghribPrayerTime, nextDayFajrPrayerTime) {
//     const [maghribHours, maghribMinutes] = maghribPrayerTime.split(":");
    
//     const maghribTimeAsDate = new Date();
//     maghribTimeAsDate.setHours(maghribHours);
//     maghribTimeAsDate.setMinutes(maghribMinutes);

//     const [nextDayFajrHours, nextDayFajrMinutes] = nextDayFajrPrayerTime.split(":");
//     const fajrTimeAsDate = new Date();
//     fajrTimeAsDate.setDate(fajrTimeAsDate.getDate() + 1);
//     fajrTimeAsDate.setHours(nextDayFajrHours);
//     fajrTimeAsDate.setMinutes(nextDayFajrMinutes);


//     const nightDurationAsTimeStamp = fajrTimeAsDate - maghribTimeAsDate;
//     const lastThirdAsTimeStamp = fajrTimeAsDate - (nightDurationAsTimeStamp / 3);

//     const lastThirdAsDate = new Date(lastThirdAsTimeStamp);
    
//     debugger;
// }

function getPrayerTemplate(down, sunrise, dhuhr, asr, maghrib, isha) {
    return `
    <div class="times-container">
        <p class="prayer">
            <span class="name">Сабах:</span>
            <span data-down id="down" class="time">${down}</span>
        </p>
        <p class="prayer">
            <span class="name">Изгрев:</span>
            <span id="sunrise" class="time">${sunrise}</span>
        </p>
        <p class="prayer">
            <span class="name">Пладнина:</span>
            <span id="dhuhr" class="time">${dhuhr}</span>
        </p>
        <p class="prayer">
            <span class="name">Икинди:</span>
            <span class="time">${asr}</span>
        </p>
        <p class="prayer">
            <span class="name">Акшам:</span>
            <span class="time">${maghrib}</span>
        </p>
        <p class="prayer">
            <span class="name">Еция:</span>
            <span class="time">${isha}</span>
        </p>
    </div>
    `;
}

function getPayerDateTemplate(date) {
    return `<h2 class="date">${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</h2>`
}