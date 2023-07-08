const menu = document.querySelector(`.menu`);
const actions = document.getElementById(`actions`);
const feedback = document.getElementById(`feedback`);
const feedbackButton = document.querySelector(`.feedback-button`);
const start = document.querySelector(`.start`);
const groupLevel = document.querySelector(`.group-level`);
const lessonList = document.querySelector(`.lessons-list`);

// TODO LocalStorage should update upon adding new group ✅
// TODO GetLocalStorage should be dynamic ✅

//**************************************** */
//* Root Methods

const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const removeFromArr = function (arr, el) {
  const index = arr.indexOf(el);
  arr.splice(index, 1);
};

//! Important
const setLocalStorage = function (arr, key) {
  localStorage.setItem(key, JSON.stringify(arr));
};

// const getLocalStorage = function (key) {
//   return JSON.parse(localStorage.getItem(key));
// };

const getLocalStorageGroups = function () {
  const data = JSON.parse(localStorage.getItem("groups"));

  if (!data) return;

  groups = data;

  renderGroups();
};

const getLocalStorageLessons = function () {
  const data = JSON.parse(localStorage.getItem("lessons"));

  if (!data) return;

  lessonsArr = data;
};

const getLocalStoragePastLessons = function () {
  const data = JSON.parse(localStorage.getItem("pastLessons"));

  if (!data) return;

  pastLessonsArr = data;
};

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

const printStudentsFromObj = function (students) {
  let studentsString = ``;
  for (let s of students) {
    studentsString += `${s.name} <br>`;
  }
  return studentsString;
};

const printDays = function (days) {
  let lessonDays = ``;
  for (let day of days) {
    lessonDays += `${day}<br>`;
  }
  return lessonDays;
};

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

function getLessonDate(el) {
  let dates = [];

  for (let day of el.days) {
    dates.push(Date.parse(`next ${day}`).toString(`m`));
  }
  return dates;
}

// * GROUP CLASS PROTOTYPE
let groups = [];
class groupCL {
  groupId = uid().slice(0, 5);

  constructor(location, level, students, days, hours, link) {
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

    setLocalStorage(groups, `groups`);
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
}

// * LESSON CONSTRUCTOR
let lessonsArr = [];

class lessonCl {
  rowId = uid().slice(0, 8);

  constructor(location, level, students, days, hours, date, status) {
    this.location = location;
    this.level = level;
    this.students = students;
    this.days = days;
    this.hours = hours;
    this.date = date;
    this.status = status;

    this.addToArr = function () {
      lessonsArr.push(this);
    };
    this.addToArr();

    setLocalStorage(lessonsArr, `lessons`);
  }
}
//********************************************
// * MOCK GROUPS
// const group1 = new groupCL(
//   1,
//   `On-Site`,
//   `Pre-Intermediate`,
//   [`Aysel`, `Ceyhun`, `Elvin`, `Norman`],
//   [`Tuesday`, `Thursday`],
//   `18:30`,
//   `https://classroom.google.com/u/0/c/NTQ4MzYwMDQzODI1`
// );

// const group2 = new groupCL(
//   2,
//   `Online`,
//   `Intermediate`,
//   [`Mike`, `Aaron`, `Elvina`, `Berke`],
//   [`Monday`, `Wednesday`, `Friday`],
//   `11:00`,
//   `https://classroom.google.com/u/0/c/NTU2MTIxNjYyMDAz`
// );

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

// ********************************************
// * USER DATA - STUDENTS
// ********************************************

let users = [];
class userCl {
  id = uid();
  // loosers = [];

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
  `Tyrell Nailer`,
  `7.000.000`,
  `Beginner`,
  `t-the-rex@gmail.com`,
  `dinos`
);
const student3 = new userCl(
  `Mason Shwarz`,
  `70`,
  `Pre-Intermediate`,
  `terminator@gmail.com`,
  `iwillbeback`
);
const student4 = new userCl(
  `Jason White`,
  `33`,
  `Elementary`,
  `JSON@gmail.com`,
  `jason.json`
);
const student5 = new userCl(
  `Natan White`,
  `39`,
  `Intermediate`,
  `nwite@gmail.com`,
  `whitey`
);
const student6 = new userCl(
  `Walter Black`,
  `56`,
  `Upper-Intermediate`,
  `blawck@gmail.com`,
  `walblck`
);
const student7 = new userCl(
  `Paul Kleen`,
  `22`,
  `Pre-Inter`,
  `kleenP@gmail.com`,
  `cleanyopnis`
);

// ********************************************
// *STUDENTS - SEARCHBAR
const searchBar = document.querySelector(`.searchbar`);
const userCards = document.querySelector(`.user-cards`);

// & Search Results - YT Version
const displayUser = (userObjects) => {
  clearList(userCards);

  const htmlString = userObjects
    .map((user) => {
      return `
    <li class="card flex flex-space-between" data-id="${user.id}">
      <div class="flex-column">
        <span>${user.name}</span>
        <span class="font-sm">${user.level}</span>
      </div>
    </li>`;
    })
    .join(``);

  userCards.insertAdjacentHTML(`beforeend`, htmlString);

  if (userObjects.length === 0) noResults();
};

const clearList = function (list) {
  list.innerHTML = "";
};

const noResults = function () {
  const errorMsg = `
    <li class="card">
      No results found. Sorry!
    </li>`;

  userCards.insertAdjacentHTML(`beforeend`, errorMsg);
};

// * CARD INTERACTIVITY
const addedStudentsList = document.querySelector(`.added-students`);

let newUsers = [];
const getObjectOnClick = function (cards) {
  for (let card of cards) {
    card.addEventListener(`click`, function (e) {
      const currentRow = e.currentTarget;

      // Add remove button
      const removeBtn = document.createElement("i");
      removeBtn.classList.add(`ph`, `ph-x`, `remove-student`);
      currentRow.append(removeBtn);

      // Print to html
      addedStudentsList.insertAdjacentElement(`beforeend`, currentRow);

      // Get user obj
      const selectedUser = users.find(
        (user) => user.id === e.currentTarget.dataset.id
      );

      newUsers.push(selectedUser);
    });
  }
};

// * Search functionality
searchBar.addEventListener(`keyup`, function (e) {
  const searchString = e.target.value.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchString) ||
      user.level.toLowerCase().includes(searchString)
    );
  });

  displayUser(filteredUsers);
  if (filteredUsers === undefined) noResults();

  if (!searchString.length > 0) clearList(userCards);

  // * Getting User Obj
  const cards = document.querySelectorAll(`.card`);
  getObjectOnClick(cards);
});

// * Search Results
const removeStudent = document.querySelectorAll(`.remove-student`);

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
  let location = capitalizeFirstLetter(loc);
  let level = lvltext;
  let students = newUsers;
  let days = checkedBoxes;
  let hours = groupTime;
  let link = "https://classroom.google.com/u/0/c/NjA5NTEyMTI2OTM5";

  new groupCL(location, level, students, days, hours, link);
};

// ************************************************
//* Editing the HTML
// ************************************************

//* GROUPS TAB - DATA

const groupsTableContent = document.querySelector(`.mygroups-table-content`);
const renderGroups = function () {
  let groupsRowContent;
  for (let g of groups) {
    // let lessonDays = ``;
    // for (let d of g.days) {
    //   lessonDays += `${d}<br>`;
    // }
    groupsRowContent = `
  <li class="group--${g.groupId} table-row table-grid groups-grid">
    <p class="lesson-id">${g.groupId}</p>
    <p class="group-level">${g.level}</p>
    <p class="location ${getLocation(g)}">${g.location}</p>
    <p>${printStudentsFromObj(g.students)}</p>
    <p class="lesson-days">${printDays(g.days)}</p>
    <p class="lesson-time">${g.hours}</p>
    <p class="classroom"><a class="link" href="${
      g.link
    }"target="_blank"><i class="ph ph-chalkboard"></i></a></p>
  </li>`;

    groupsTableContent.insertAdjacentHTML(`beforeend`, groupsRowContent);
  }

  // &Try the map method
  // const htmlString = userObjects
  //   .map((user) => {
  //     return `
  // <li class="card flex flex-space-between" data-id="${user.id}">
  //   <div class="flex-column">
  //     <span>${user.name}</span>
  //     <span class="font-sm">${user.level}</span>
  //   </div>
  // </li>`;
  //   })
  //   .join(``);
};

// //* Print New Group

const renderNewGroup = function () {
  let groupsRowContent;
  let lastGroup = groups[groups.length - 1];

  // let lessonDays = ``;
  // for (let d of lastGroup.days) {
  //   lessonDays += `${d}<br>`;
  // }
  groupsRowContent = `
  <li class="group--${lastGroup.groupId} table-row table-grid groups-grid">
    <p class="lesson-id">${lastGroup.groupId}</p>
    <p class="group-level">${lastGroup.level}</p>
    <p class="location ${getLocation(lastGroup)}">${lastGroup.location}</p>
    <p>${printStudentsFromObj(lastGroup.students)}</p>
    <p class="lesson-days">${printDays(lastGroup.days)}</p>
    <p class="lesson-time">${lastGroup.hours}</p>
    <p class="classroom"><a class="link" href="${
      lastGroup.link
    }"target="_blank"><i class="ph ph-chalkboard"></i></a></p>
  </li>`;

  groupsTableContent.insertAdjacentHTML(`beforeend`, groupsRowContent);
};

let lessonRows = [];

//* LESSON TAB - DATA
const lessonsTableContent = document.querySelector(`.lessons-list`);
const createLessonObj = function () {
  if (groups)
    for (let gr of groups) {
      for (let i = 0; i < gr.days.length; i++) {
        new lessonCl(
          gr.location,
          gr.level,
          gr.students,
          gr.days,
          gr.hours,
          getLessonDate(gr)[i],
          `To be held`,
          lessonsArr.length
        );
      }
    }
};

// * PRINTING LESSONS TO HTML
let lessonsRowContent;
const renderLessons = function () {
  for (let i = 0; i < lessonsArr.length; i++) {
    lessonsRowContent = `
    <li class="table-row lesson-row table-grid" data-id="${
      lessonsArr[i].rowId
    }">
  <p class="lesson-id">${i}</p>
      <p class="group-level">${lessonsArr[i].level}</p>
      <p class="location ${getLocation(lessonsArr[i])}">${
      lessonsArr[i].location
    }</p>
      <p>${printStudentsFromObj(lessonsArr[i].students)}</p>
      <p class="lesson-date">${lessonsArr[i].date}</p>
      <p class="lesson-time">${lessonsArr[i].hours}</p>
      ${getStatus(lessonsArr[i])}
    </li>`;

    lessonsTableContent.insertAdjacentHTML(`beforeend`, lessonsRowContent);
  }
  lessonRows = document.querySelectorAll(`.lesson-row`);
};

createLessonObj();

// & The storage is parsed and the lessons are printed
getLocalStorageLessons();
if (lessonsArr.length !== 0) renderLessons();

sortList(lessonList);

// * CREATING NEW LESSONS FROM NEW GROUPS

newGroupConfirm.addEventListener(`click`, () => {
  newGroup(),
    createLessonObj(),
    renderNewGroup,
    sortList(lessonList),
    location.reload(true);
});

// & Getting and rendering groups
if (groups) getLocalStorageGroups();
getLocalStorageLessons();

// ****************************************************************

// **************************************
// *Popup Menu
// **************************************
// let rows = document.querySelectorAll(`.lesson-row`);

const popupOpen = function () {
  actions.classList.add(`popup-open`);
};

const popupClose = function () {
  actions.classList.remove(`popup-open`);
};

for (let row of lessonRows) {
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

const cancel = function () {
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
  pastLessonsList.insertAdjacentElement(`beforeend`, lessonRow);

  // Add object to new arr
  pastLessonsArr.push(lessonObj);

  // Remove object from lessons arr
  removeFromArr(lessonsArr, lessonObj);
};

let selectedRow;
let statusId;
let selectedObj;

for (let i = 0; i < lessonRows.length; i++) {
  lessonRows[i].addEventListener(`click`, function (event) {
    // Selecting the target row
    selectedRow = event.currentTarget;

    // Selecting the status of the current click target
    statusId = event.currentTarget.querySelector(`.lesson-status`);

    // Selected object
    console.log(event.currentTarget.dataset.id);
    console.log(lessonsArr);

    const selectedLesson = lessonsArr.find(
      (lesson) => lesson.rowId === event.currentTarget.dataset.id
    );
    selectedObj = selectedLesson;
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
