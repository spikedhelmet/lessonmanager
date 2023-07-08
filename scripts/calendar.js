//* //////////////////////////////////////////////////////////
//* CALENDAR
//* //////////////////////////////////////////////////////////

let calendar = document.querySelector(".calendar");

const month_names = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};

getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

generateCalendar = (month, year) => {
  let calendar_days = calendar.querySelector(".calendar-days");
  let calendar_header_year = calendar.querySelector("#year");

  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  calendar_days.innerHTML = "";

  let currDate = new Date();
  if (month > 11 || month < 0) month = currDate.getMonth();
  if (!year) year = currDate.getFullYear();

  let curr_month = `${month_names[month]}`;
  month_picker.innerHTML = curr_month;
  calendar_header_year.innerHTML = year;

  // get first day of month

  let first_day = new Date(year, month, 1);

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement("div");
    if (i >= first_day.getDay()) {
      day.classList.add("calendar-day-hover");
      day.innerHTML = i - first_day.getDay() + 1;
      day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`;
      if (
        i - first_day.getDay() + 1 === currDate.getDate() &&
        year === currDate.getFullYear() &&
        month === currDate.getMonth()
      ) {
        day.classList.add("curr-date");
      }
    }
    calendar_days.appendChild(day);
  }
};

let month_list = calendar.querySelector(".month-list");

month_names.forEach((e, index) => {
  let month = document.createElement("div");
  month.innerHTML = `<div data-month="${index}">${e}</div>`;
  month.querySelector("div").onclick = () => {
    month_list.classList.remove("show");
    curr_month.value = index;
    generateCalendar(index, curr_year.value);
  };
  month_list.appendChild(month);
});

let month_picker = calendar.querySelector("#month-picker");

month_picker.onclick = () => {
  month_list.classList.add("show");
};

let currDate = new Date();

let curr_month = { value: currDate.getMonth() };
let curr_year = { value: currDate.getFullYear() };

generateCalendar(curr_month.value, curr_year.value);

document.querySelector("#prev-year").onclick = () => {
  --curr_year.value;
  generateCalendar(curr_month.value, curr_year.value);
};

document.querySelector("#next-year").onclick = () => {
  ++curr_year.value;
  generateCalendar(curr_month.value, curr_year.value);
};

//* //////////////////////////////////////////////////////////
//* Calendar to Table Data change
//* //////////////////////////////////////////////////////////

const dateDays = document.querySelectorAll(`.calendar-day-hover`);
const dateMonth = document.querySelector(`.month-picker`);
const lessonDate = document.querySelector(`.lesson-date`);

const lessonTime = document.querySelector(`.lesson-time`);
const timeControl = document.querySelector('input[type="time"]');

let chosenDay;
let chosenDate;
let prevDate;
let oldTime;
let newTime;

for (let row of lessonRows) {
  row.addEventListener(`click`, function (event) {
    // The row-id of the target

    const selectedLesson = lessonsArr.find(
      (lesson) => lesson.rowId === event.currentTarget.dataset.id
    );
    selectedRowObj = selectedLesson;

    // The lesson obj targeted row is built from
    // selectedObj = lessonsArr[selectedRowId];

    // Calendar config
    prevDate = event.currentTarget.querySelector(`.lesson-date`);

    console.log(prevDate);
    for (let day of dateDays) {
      day.addEventListener(`click`, function (event) {
        chosenDay = Number(event.target.textContent);
      });
    }

    // Time Config
    oldTime = event.currentTarget.querySelector(`.lesson-time`);

    // The time settings show regular time as default
    timeControl.value = oldTime.textContent;

    // Change lesson row time to new time
    timeControl.addEventListener(`change`, () => {
      newTime = timeControl.value;
    });

    calendarConfirm.addEventListener(`click`, () => {
      // to only work if user picks a new date
      if (chosenDay !== undefined)
        // Change the date in the row to the new date
        prevDate.textContent = `${dateMonth.textContent} ${chosenDay}`;
      if (newTime !== undefined) oldTime.textContent = newTime;

      // Change the date in the lesson object itself
      selectedObj.date = `${dateMonth.textContent} ${chosenDay}`;

      // Sort the list again to place the postponed lessons correctly
      sortList(lessonList);
    });
  });
}
