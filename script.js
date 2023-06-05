if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.error('service worker not registered', err))
}

document.addEventListener("DOMContentLoaded", async () => {
    let selectedCity = localStorage.getItem("selectedCity");
    const selectedCityElement = document.querySelector("#selected-city");
    
    if (!selectedCity) {
        selectedCity = selectedCityElement.options[selectedCityElement.selectedIndex].value;
    }

    selectedCityElement.value = selectedCity;

    const prayerTimeTable = await getTimeForSelectedCity(selectedCity);

    const swiperInstance = new Swiper('#swiper', {
        direction: 'vertical',
        scrollbar: {
            draggable: true,
            el: '.swiper-scrollbar',
        },
        mousewheel: true,
    });

    selectedCityElement.addEventListener("change", (event) => changeTimeToSelectedCity(event, swiperInstance));
    renderPrayerSlides(prayerTimeTable, swiperInstance);
});

async function changeTimeToSelectedCity(event, swiperInstance) {
    const element = event.target;
    const selectedCity = element.options[element.selectedIndex].value;
    localStorage.setItem("selectedCity", selectedCity);

    const prayerTimeTable = await getTimeForSelectedCity(selectedCity);

    swiperInstance.removeAllSlides()
    renderPrayerSlides(prayerTimeTable, swiperInstance);
}

function renderPrayerSlides(prayerTimeTable, swiperInstance) {
    const currentFullDate = getCurrentUserDate();
    const allDatesContainingPrayersForCurrentMonth = prayerTimeTable[currentFullDate.getMonth() + 1];
    const currentDayPrayer = allDatesContainingPrayersForCurrentMonth[currentFullDate.getDate()];
    const currentDaySlideTemplate = getPrayerTemplate(currentDayPrayer, currentFullDate, true);
    swiperInstance.appendSlide(currentDaySlideTemplate);

    let daysAfterCurrentDate = 1;
    let nextFullDate = getNextDate(currentFullDate, daysAfterCurrentDate);

    while (
        (prayerTimeTable[nextFullDate.getMonth() + 1])
        || (prayerTimeTable[nextFullDate.getMonth() + 1]?.[nextFullDate.getDate()])
    ) {
        const allDatesContainingPrayersForTheMonth = prayerTimeTable[nextFullDate.getMonth() + 1];
        const prayersForTheDay = allDatesContainingPrayersForTheMonth[nextFullDate.getDate()];

        const slideTemplate = getPrayerTemplate(prayersForTheDay, nextFullDate);
        swiperInstance.appendSlide(slideTemplate);

        nextFullDate = getNextDate(currentFullDate, daysAfterCurrentDate)
    }
}

async function getTimeForSelectedCity(selectedCity) {
    const response = await fetch(`/${selectedCity}-time.json`);
    const prayerTimeTable = await response.json();

    return prayerTimeTable;
}

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
    <div class="swiper-slide">
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
    </div>
    `;
}