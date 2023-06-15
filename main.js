const menu = document.querySelector(`.menu`);
const actions = document.getElementById(`actions`);
const feedback = document.getElementById(`feedback`);
const feedbackButton = document.querySelector(`.feedback-button`);
const start = document.querySelector(`.start`);
const groupLevel = document.querySelector(`.group-level`);
const lessonList = document.querySelector(`.lessons-list`);

//**************************************** */
//* Root Methods
const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getNum = function (date) {
  return date.match(/\d+/g).join(``);
};

const getWord = function (date) {
  return date.match(/[a-zA-Z]+/g);
};

const datify = function (parsedDate) {
  return new Date(parsedDate);
};

const printStudents = function (students) {
  let studentsString = ``;
  for (let s of students) {
    studentsString += `${s} <br>`;
  }
  return studentsString;
};
//**************************************** */

//* Sorting Rows
const sortList = function (list) {
  var list, i, switching, b, shouldSwitch;
  // list = document.querySelector(`.lessons-list`);
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("LI");
    // Loop through all list items:
    for (i = 0; i < b.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;

      x = b[i].querySelector(`.lesson-date`);
      y = b[i + 1].querySelector(`.lesson-date`);

      const xDate = x.textContent;
      const yDate = y.textContent;

      let dateCheck = Date.compare(datify(xDate), datify(yDate));

      if (dateCheck === 1) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
};

// **************************************
// *LESSON DATA
// **************************************
// const weekdays = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// const d = new Date();
// let day = weekdays[d.getDay()];
// console.log(day);

// * GROUP CLASS PROTOTYPE
let groups = [];
class groupCL {
  constructor(groupId, location, level, students, days, hours, link) {
    this.groupId = groupId;
    this.location = location;
    this.level = level;
    this.students = students;
    this.days = days;
    this.hours = hours;
    this.link = link;

    this.addToArray = function () {
      groups.push(this);
    };

    this.addToArray();
  }

  // * Group Methods
  online(el) {
    el.querySelector(`.location`).classList.add(`online`);
    el.querySelector(`.location`).classList.remove(`on-site`);
    el.querySelector(`.location`).textContent = this.location;
  }

  onSite(el) {
    el.querySelector(`.location`).classList.add(`on-site`);
    el.querySelector(`.location`).classList.remove(`online`);
    el.querySelector(`.location`).textContent = this.location;
  }

  lessonDate(el) {
    let dates = [];
    for (let day of el.days) {
      dates.push(Date.parse(`next ${day}`).toString(`m`));
    }
    return dates;
  }
}

// * LESSON CONSTRUCTOR
let lessonsArr = [];
let rowIdArr = [];

class lessonCl {
  constructor(
    groupId,
    location,
    level,
    students,
    days,
    hours,
    date,
    status,
    rowId
  ) {
    this.groupId = groupId;
    this.location = location;
    this.level = level;
    this.students = students;
    this.days = days;
    this.hours = hours;
    this.date = date;
    this.status = status;
    this.rowId = rowId;

    this.addToArr = function () {
      lessonsArr.push(this);
      rowIdArr.push(this.rowId);
    };

    this.addToArr();
  }
}

// * MOCK GROUPS
const group1 = new groupCL(
  1,
  `On-Site`,
  `Pre-Intermediate`,
  [`Aysel`, `Ceyhun`, `Elvin`, `Norman`],
  [`Tuesday`, `Thursday`],
  `18:30`,
  `https://classroom.google.com/u/0/c/NTQ4MzYwMDQzODI1`
);

const group2 = new groupCL(
  2,
  `Online`,
  `Intermediate`,
  [`Mike`, `Aaron`, `Elvina`, `Berke`],
  [`Monday`, `Wednesday`, `Friday`],
  `11:00`,
  `https://classroom.google.com/u/0/c/NTU2MTIxNjYyMDAz`
);

const group3 = new groupCL(
  3,
  `On-Site`,
  `Elementary`,
  [`Abu`, `Jordan`, `Kim`, `Jimmy`],
  [`Monday`, `Thursday`],
  `12:00`,
  `https://classroom.google.com/u/0/c/NjAzMjA4NjgxMzcz`
);

const group4 = new groupCL(
  4,
  `Online`,
  `Beginner`,
  [`Eli`, `T-Rex`, `Jeff`, `Ali`],
  [`Monday`, `Friday`],
  `14:30`,
  `https://classroom.google.com/u/0/c/NjA5NTEyMTI2OTM5`
);

//* NEW GROUP BUTTON SETUP
const btnNewGroup = document.querySelector(`.btn-newgroup`);
const newGroupPopup = document.querySelector(`.new-group-popup`);
const newGroupConfirm = document.querySelector(`.new-group-confirm`);

const open = function () {
  newGroupPopup.classList.add(`popup-open`);
};

const close = function () {
  newGroupPopup.classList.remove(`popup-open`);
};

btnNewGroup.addEventListener(`click`, open);

newGroupConfirm.addEventListener(`click`, close);

window.addEventListener(`click`, function (event) {
  if (event.target === newGroupPopup) {
    close();
  }
});

//* CREATE NEW GROUP
const groupLevelSelect = document.querySelector(`.group-level-select`);
const daysCheckbox = document.querySelectorAll(`.lesson-days-checkbox`);

const newGroup = function () {
  let loc = document.querySelector('input[name="lesson-format"]:checked').value;
  let lvltext = groupLevelSelect.options[groupLevelSelect.selectedIndex].text;
  let checkedBoxes = [];
  for (let box of daysCheckbox) {
    if (box.checked) {
      checkedBoxes.push(capitalizeFirstLetter(box.value));
    }
  }
  let groupTime = document.querySelector(".new-group-time").value;

  let groupId = groups.length + 1;
  let location = capitalizeFirstLetter(loc);
  let level = lvltext;
  let students = [`Zuzu`, `Mozu`, `Jozo`, `Doma`];
  let days = checkedBoxes;
  let hours = groupTime;
  let link = "https://classroom.google.com/u/0/c/NjA5NTEyMTI2OTM5";

  let newG = new groupCL(groupId, location, level, students, days, hours, link);
};

// ************************************************
//* Editing the HTML
// ************************************************

//* Methods for groups
const getLocation = function (group) {
  if (group.location === `Online`) {
    return `online`;
  } else {
    return `on-site`;
  }
};

const getStatus = function (group) {
  if (group.status === `To be held`) {
    return `<p class="lesson-status status--tobeheld">To be held</p>`;
  } else if (group.status === `Finished`) {
    return `<p class="lesson-status status--finished">Finished</p>`;
  } else if (group.status === `Cancelled`) {
    return `<p class="lesson-status status--cancelled">Cancelled</p>`;
  } else if (group.status === `Postponed`) {
    return `<p class="lesson-status status--postponed">Postponed</p>`;
  }
};

//* GROUPS TAB - DATA

const groupsTableContent = document.querySelector(`.mygroups-table-content`);
const createGroups = function () {
  let groupsRowContent;
  for (let g of groups) {
    let lessonDays = ``;
    for (let d of g.days) {
      lessonDays += `${d}<br>`;
    }
    groupsRowContent = `
  <li class="group--${g.groupId} table-row table-grid groups-grid">
    <p class="lesson-id">${g.groupId}</p>
    <p class="group-level">${g.level}</p>
    <p class="location ${getLocation(g)}">${g.location}</p>
    <p>${printStudents(g.students)}</p>
    <p class="lesson-days">${lessonDays}</p>
    <p class="lesson-time">${g.hours}</p>
    <p class="classroom"><a class="link" href="${
      g.link
    }"target="_blank"><i class="ph ph-chalkboard"></i></a></p>
  </li>`;

    groupsTableContent.insertAdjacentHTML(`beforeend`, groupsRowContent);
  }
};

createGroups();

//* Print New Group

const printNewGroup = function () {
  let groupsRowContent;
  let lastGroup = groups[groups.length - 1];

  let lessonDays = ``;
  for (let d of lastGroup.days) {
    lessonDays += `${d}<br>`;
  }
  groupsRowContent = `
  <li class="group--${lastGroup.groupId} table-row table-grid groups-grid">
    <p class="lesson-id">${lastGroup.groupId}</p>
    <p class="group-level">${lastGroup.level}</p>
    <p class="location ${getLocation(lastGroup)}">${lastGroup.location}</p>
    <p>${printStudents(lastGroup)}</p>
    <p class="lesson-days">${lessonDays}</p>
    <p class="lesson-time">${lastGroup.hours}</p>
    <p class="classroom"><a class="link" href="${
      lastGroup.link
    }"target="_blank"><i class="ph ph-chalkboard"></i></a></p>
  </li>`;

  groupsTableContent.insertAdjacentHTML(`beforeend`, groupsRowContent);
};

//* LESSON TAB - DATA
const lessonsTableContent = document.querySelector(`.lessons-list`);

for (let gr of groups) {
  for (let i = 0; i < gr.days.length; i++) {
    new lessonCl(
      gr.groupId,
      gr.location,
      gr.level,
      gr.students,
      gr.days,
      gr.hours,
      gr.lessonDate(gr)[i],
      `To be held`,
      lessonsArr.length
    );
  }
}

// * PRINTING LESSONS TO HTML
let lessonsRowContent;
// for (let test of lessonsArr)
for (let i = 0; i < lessonsArr.length; i++) {
  lessonsRowContent = `
    <li class="row-id--${lessonsArr[i].rowId} group--${
    lessonsArr[i].groupId
  } table-row lesson-row table-grid">
      <p class="lesson-id">${lessonsArr[i].groupId}</p>
      <p class="group-level">${lessonsArr[i].level}</p>
      <p class="location ${getLocation(lessonsArr[i])}">${
    lessonsArr[i].location
  }</p>
      <p>${printStudents(lessonsArr[i].students)}</p>
      <p class="lesson-date">${lessonsArr[i].date}</p>
      <p class="lesson-time">${lessonsArr[i].hours}</p>
      ${getStatus(lessonsArr[i])}
    </li>`;

  lessonsTableContent.insertAdjacentHTML(`beforeend`, lessonsRowContent);
}

sortList(lessonList);

//! FUCKING TRICK
//! WE ESTABLISH THE LENGTH OF OLD LESSONSARR HERE
//! AND WE SLICE AFTER THAT LENGTH AND PUSH NEW LESSONS INTO NEW ARR

// * CREATING NEW LESSONS FROM NEW GROUPS
let lessonsArrLength = lessonsArr.length;
let newLessonRowContent;

const createNewLesson = function () {
  let lastGroup = groups[groups.length - 1];

  let newLessonsArr;
  for (let i = 0; i < lastGroup.days.length; i++) {
    new lessonCl(
      lastGroup.groupId,
      lastGroup.location,
      lastGroup.level,
      lastGroup.students,
      lastGroup.days,
      lastGroup.hours,
      lastGroup.lessonDate(lastGroup)[i],
      `To be held`,
      lessonsArr.length
    );
    newLessonsArr = lessonsArr.slice(lessonsArrLength);
  }

  for (let i = 0; i < newLessonsArr.length; i++) {
    newLessonRowContent = `
    <li class="row-id--${newLessonsArr[i].rowId} group--${
      newLessonsArr[i].groupId
    } table-row lesson-row table-grid">
      <p class="lesson-id">${newLessonsArr[i].groupId}</p>
      <p class="group-level">${newLessonsArr[i].level}</p>
      <p class="location ${getLocation(newLessonsArr[i])}">${
      newLessonsArr[i].location
    }</p>
      <p>${printStudents(newLessonsArr[i].students)}</p>
      <p class="lesson-date">${newLessonsArr[i].date}</p>
      <p class="lesson-time">${newLessonsArr[i].hours}</p>
      ${getStatus(newLessonsArr[i])}
    </li>`;

    lessonsTableContent.insertAdjacentHTML(`beforeend`, newLessonRowContent);
  }
};

newGroupConfirm.addEventListener(`click`, () => {
  newGroup(), printNewGroup(), createNewLesson(), sortList(lessonList);
});
// ****************************************************************

// **************************************
// *Popup Menu
// **************************************
const rows = document.querySelectorAll(`.lesson-row`);

const popupOpen = function () {
  actions.classList.add(`popup-open`);
};

const popupClose = function () {
  actions.classList.remove(`popup-open`);
};

for (let row of rows) {
  row.addEventListener(`click`, popupOpen);
}

window.addEventListener(`click`, function (event) {
  if (event.target === actions) {
    popupClose();
  }
});

// **************************************
// *Feedback Menu
// **************************************

const feedbackOpen = function () {
  feedback.classList.add(`popup-open`);
};

const feedbackClose = function () {
  feedback.classList.remove(`popup-open`);
};

feedbackButton.addEventListener(`click`, () => {
  feedbackOpen();
  popupClose();
});

window.addEventListener(`click`, function (event) {
  if (event.target === feedback) {
    feedbackClose();
  }
});

// **************************************
// *Stars
// **************************************

const stars = document.querySelectorAll(`.rating .rating-star`);
// .star-fill

for (let star of stars) {
  star.addEventListener(`mouseover`, () => {
    star.classList.add(`ph-fill`);
  });

  star.addEventListener(`mouseout`, () => {
    star.classList.remove(`ph-fill`);
  });
}

/////////////////////////////////////
// *Dropdown Menu
////////////////////////////////////
/*
const setStatus = document.querySelector(`.set-status`);
const statusMenu = document.querySelector(`.status-menu`);
const dropdown = document.querySelector(`.dropdown`);

const dropdownOpen = function () {
  statusMenu.classList.add(`dropdown-open`);
};

const dropdownClose = function () {
  statusMenu.classList.remove(`dropdown-open`);
};

setStatus.addEventListener(`click`, () => {
  if (statusMenu.classList.contains(`dropdown-open`)) dropdownClose();
  else dropdownOpen();
});
*/

// **************************************
// *Status Menu
// **************************************

const setStatus = document.querySelector(`.set-status`);
const statusMenu = document.getElementById(`status`);

const statusOpen = function () {
  statusMenu.classList.add(`popup-open`);
};

const statusClose = function () {
  statusMenu.classList.remove(`popup-open`);
};

setStatus.addEventListener(`click`, () => {
  statusOpen();
  popupClose();
});

window.addEventListener(`click`, function (event) {
  if (event.target === statusMenu) {
    statusClose();
  }
});

// *Status--Finished
const finishedBtn = document.querySelector(`.finished-btn`);

// *Status--Postponed
const calendarConfirm = document.querySelector(`.calendar-confirm`);
const postponedBtn = document.querySelector(`.postponed-btn`);
const calendarContainer = document.querySelector(`.calendar-container`);

const calendarOpen = function () {
  calendarContainer.classList.add(`popup-open`);
};

const calendarClose = function () {
  calendarContainer.classList.remove(`popup-open`);
};

postponedBtn.addEventListener(`click`, () => {
  calendarOpen();
  statusClose();
  popupClose();
});

window.addEventListener(`click`, function (event) {
  if (event.target === calendarContainer) {
    calendarClose();
  }
});

// *Status--Cancelled

const cancelledBtn = document.querySelector(`.cancelled-btn`);
const cancelConfirm = document.querySelector(`.cancel-confirm`);
const cancelInput = document.querySelector(`#cancel-input`);

const cancelOpen = function () {
  cancelInput.classList.add(`popup-open`);
};

const cancelClose = function () {
  cancelInput.classList.remove(`popup-open`);
};

cancelledBtn.addEventListener(`click`, () => {
  cancelOpen();
  statusClose();
  popupClose();
});

window.addEventListener(`click`, function (event) {
  if (event.target === cancelInput) {
    cancelClose();
  }
});

/******************************/
// *Dynamic Status Change
/******************************/
const lessonRows = document.querySelectorAll(`.lesson-row`);

const finishStatus = function (s, o) {
  s.textContent = `Finished`;

  s.classList.remove(`status--tobeheld`);
  s.classList.remove(`status--postponed`);
  s.classList.remove(`status--cancelled`);

  s.classList.add(`status--finished`);

  o.status = `Finished`;

  statusClose();
  popupClose();
};

const postponeStatus = function (s, o) {
  s.textContent = `Postponed`;

  s.classList.remove(`status--tobeheld`);
  s.classList.remove(`status--cancelled`);
  s.classList.remove(`status--finished`);

  s.classList.add(`status--postponed`);

  o.status = `Postponed`;

  calendarClose();
  statusClose();
  popupClose();
};

const cancelStatus = function (s, o) {
  s.textContent = `Cancelled`;

  s.classList.remove(`status--tobeheld`);
  s.classList.remove(`status--postponed`);
  s.classList.remove(`status--finished`);

  s.classList.add(`status--cancelled`);

  o.status = `Cancelled`;

  cancelClose();
  statusClose();
  popupClose();
};

// Function for moving the lesson row and obj
const pastLessonsList = document.querySelector(`.past-lessons-list`);
let pastLessonsArr = [];
let pastLessonRowContent;

const moveToPast = function (lessonRow, lessonObj) {
  // Add lesson to Past Lessons
  pastLessonRowContent = `
    <li class="row-id--${lessonObj.rowId} group--${
    lessonObj.groupId
  } table-row lesson-row table-grid">
      <p class="lesson-id">${lessonObj.groupId}</p>
      <p class="group-level">${lessonObj.level}</p>
      <p class="location ${getLocation(lessonObj)}">${lessonObj.location}</p>
      <p>${printStudents(lessonObj.students)}</p>
      <p class="lesson-date">${lessonObj.date}</p>
      <p class="lesson-time">${lessonObj.hours}</p>
      ${getStatus(lessonObj)}
    </li>`;

  pastLessonsList.insertAdjacentHTML(`beforeend`, pastLessonRowContent);

  // Remove lesson from main lessons
  lessonRow.remove();

  // Add object to new arr
  pastLessonsArr.push(lessonObj);

  // Remove (dont' remove just make it undefined) object from old arr
  let objIndex = lessonsArr.indexOf(lessonObj);
  lessonsArr[objIndex] = null;

  /* The lessonsArr mutates after removing the obj,
  and the order of things is messed up.
  The problem is in selecting the object by using rowId.
  -- Solved by making the object null without mutating the array
  */
};

let selectedRow;
let statusId;
let selectedRowId;
let selectedObj;

for (let i = 0; i < lessonRows.length; i++) {
  lessonRows[i].addEventListener(`click`, function (event) {
    // Selecting the target row
    selectedRow = event.currentTarget;

    // Selecting the status of the current click target
    statusId = event.currentTarget.querySelector(`.lesson-status`);

    // The row-id of the target
    selectedRowId = getNum(event.currentTarget.classList[0]);

    // The lesson obj targeted row is built from
    selectedObj = lessonsArr[selectedRowId];
  });
}

finishedBtn.addEventListener(`click`, () => {
  finishStatus(statusId, selectedObj);
  moveToPast(selectedRow, selectedObj);
});

calendarConfirm.addEventListener(`click`, () => {
  postponeStatus(statusId, selectedObj);
});

cancelConfirm.addEventListener(`click`, () => {
  cancelStatus(statusId, selectedObj);
  moveToPast(selectedRow, selectedObj);
});

/* ********************************** */
//* SIDE MENU BUTTONS
/* ********************************** */

const tabs = document.querySelectorAll(`.interface`);
const lessonsTab = document.querySelector(`.lessons-page`);
const pastLessonsTab = document.querySelector(`.past-lessons-page`);
const myGroupsTab = document.querySelector(`.mygroups`);

const lessonsBtn = document.querySelector(`.lessons`);
const pastLessonsBtn = document.querySelector(`.past-lessons`);
const groupsBtn = document.querySelector(`.groups`);

const openTab = function (openedTab) {
  openedTab.classList.remove(`hidden`);

  for (let tab of tabs) {
    // Closes any other tab except the current one
    if (tab !== openedTab) {
      tab.classList.add(`hidden`);
    }
  }
};

groupsBtn.addEventListener(`click`, () => {
  openTab(myGroupsTab);
});

pastLessonsBtn.addEventListener(`click`, () => {
  openTab(pastLessonsTab);
});

lessonsBtn.addEventListener(`click`, () => {
  openTab(lessonsTab);
});

// ********************************************
// * USER DATA - STUDENTS
// ********************************************

let users = [];
class userCl {
  constructor(name, age, level, email, password, group) {
    this.name = name;
    this.age = age;
    this.level = level;
    this.email = email;
    this.password = password;
    this.group = group;

    this.addToArray = function () {
      users.push(this);
    };

    this.addToArray();
  }
}

// Mock student objects
const student1 = new userCl(
  `Mike Myers`,
  `29`,
  `Intermediate`,
  `mikeymyers@gmail.com`,
  `mike93`
);

const student2 = new userCl(
  `T-Rex`,
  `7.000.000`,
  `Beginner`,
  `t-the-rex@gmail.com`,
  `dinos`
);

const student3 = new userCl(
  `Arnie`,
  `70`,
  `Pre-Intermediate`,
  `terminator@gmail.com`,
  `iwillbeback`
);

// ********************************************
// *STUDENTS - SEARCHBAR

const searchInput = document.querySelector(`.searchbar`);

const clearButton = document.querySelector(".clear");

clearButton.addEventListener("click", () => {
  // 1. write a function that removes any previous results from the page
});

// creating and declaring a function called "setList"
// setList takes in a param of "results"
const setList = function (results) {
  for (const person of results) {
    // creating a li element for each result item
    const resultItem = document.createElement("li");

    // adding a class to each item of the results
    resultItem.classList.add("result-item");

    // grabbing the name of the current point of the loop and adding the name as the list item's text
    const text = document.createTextNode(person.name);

    // appending the text to the result item
    resultItem.appendChild(text);

    // appending the result item to the list
    list.appendChild(resultItem);
  }
};

searchInput.addEventListener("input", (e) => {
  // inside, we will need to achieve a few things:
  // 1. declare and assign the value of the event's target to a variable AKA whatever is typed in the search bar
  let value = e.target.value;

  // 2. check: if input exists and if input is larger than 0
  if (value && value.trim().length > 0) {
    // 3. redefine 'value' to exclude white space and change input to all lowercase
    value = value.trim().toLowerCase();
    // 4. return the results only if the value of the search is included in the person's name
    // we need to write code (a function for filtering through our data to include the search input value)

    //returning only the results of setList if the value of the search is included in the person's name
    setList(
      users.filter((person) => {
        return person.includes(value);
      })
    );
  } else {
    // 5. return nothing
    // input is invalid -- show an error message or show no results
  }
});
