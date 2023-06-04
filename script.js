if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.error('service worker not registered', err))
}

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/time.json");
    const prayerTimeTable = await response.json();

    // SLIDER
    var mySwiper = new Swiper('#swiper-container', {
        direction: 'vertical',
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        mousewheel: true,
    });

    // mySwiper.on('slideChange', function () {
    //     console.log('Slide changed');
    // });
    // END

    const currentFullDate = getCurrentUserDate();
    const allDatesContainingPrayersForCurrentMonth = prayerTimeTable[currentFullDate.getMonth() + 1];
    const currentDayPrayer = allDatesContainingPrayersForCurrentMonth[currentFullDate.getDate()];
    const currentDaySlideTemplate = getPrayerTemplate(currentDayPrayer, currentFullDate, true);
    mySwiper.appendSlide(currentDaySlideTemplate);

    let daysAfterCurrentDate = 1;
    let nextFullDate = getNextDate(currentFullDate, daysAfterCurrentDate);

    while (
        (prayerTimeTable[nextFullDate.getMonth() + 1])
        || (prayerTimeTable[nextFullDate.getMonth() + 1]?.[nextFullDate.getDate()])
    ) {
        const allDatesContainingPrayersForTheMonth = prayerTimeTable[nextFullDate.getMonth() + 1];
        const prayersForTheDay = allDatesContainingPrayersForTheMonth[nextFullDate.getDate()];

        const slideTemplate = getPrayerTemplate(prayersForTheDay, nextFullDate);
        mySwiper.appendSlide(slideTemplate);

        nextFullDate = getNextDate(currentFullDate, daysAfterCurrentDate)
    }

});

// function renderCurrentDate(userDateInfo) {
//     const currentDate = document.querySelector("#current-date")
//     currentDate.textContent = `${userDateInfo.currentDate}/${userDateInfo.currentMonth}/${userDateInfo.currentYear}`;
// }

function getCurrentUserDate() {
    const currentUserTimeAsTimeStamp = Date.now();
    const fullDate = new Date(currentUserTimeAsTimeStamp);
    return fullDate;
}

function getNextDate(currentUserDate, daysLater) {
    const currentDate = currentUserDate.getDate();
    const nextDateAsTimeStamp = currentUserDate.setDate(currentDate + daysLater);
    const fullDate = new Date(nextDateAsTimeStamp);
    return fullDate;
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

function getPrayerTemplate(prayerTimes, fullDate, today) {
    ({ down, sunrise, dhuhr, asr, maghrib, isha } = prayerTimes);

    const date = fullDate.getDate();
    const month = fullDate.toLocaleString('bg', { month: 'long' });
    const year = fullDate.getFullYear();

    const isToday = today ? "today" : "hidden";

    return `
    <swiper-slide class="swiper-slide">
    <h2 class="date"><span class="${isToday}">Днес: </span>${date} ${month} ${year}</h2>
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
    </swiper-slide>
    `;
}