//#region - Variables go there

let colors = ['rgba(255,0,136,1)', 'rgba(255,238,0,1)', 'rgba(0,157,255,1)', 'rgba(0,208,255,1)']

//days & evnts arrays, days array is made form events array
let events = [];
let days = [];

// Toggle between Period Date & conception date visualisation
let toggleState;
if (localStorage.getItem('toggle')) {
  toggleState = localStorage.getItem('toggle');
} else {
  toggleState = 'period';
}

//sort events in events list view by type or by date
let eventsSort;
if (localStorage.getItem('sort')) {
  eventsSort = localStorage.getItem('sort');
} else {
  eventsSort = 'type';
}

//Wheel statuses, zoom / scrolling.
let zoomState = false;
let isScrolling = false;
let movement = 0;

// Wheel parameters
let wheelSize;
let outer;
let WheelPosition;
let wheelRotation = 0;
let previousTouch;

// Event constructor
class Event {
  constructor(description, start, end, rank, short) {
    this.description = description;
    this.start = start;
    this.end = end;
    this.rank = rank;
    this.short = short;
  }
}

//Day constructor
class Day {
  constructor(number, event1, r1, event2, r2, event3, r3, event4, r4) {
    this.number = number;
    this.event1 = event1;
    this.r1 = r1;
    this.event2 = event2;
    this.r2 = r2;
    this.event3 = event3;
    this.r3 = r3;
    this.event4 = event4;
    this.r4 = r4;
  }
}

//On load date definitions, if no local storage
let periodDate = new Date();
periodDate.setHours(0);
periodDate.setMinutes(0);
periodDate.setSeconds(0);
periodDate.setMilliseconds(0);
if (localStorage.getItem('start')) { periodDate = new Date(parseInt(localStorage.getItem('start'))) };
let conceptionDate = new Date();
calculateConceptionDate();
let currentDate = new Date();

//date format, same for all
const datesfr = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "short", day: "numeric" });

//#region  - Variables for QuerySelector

const html = document.querySelector('html');

//main divs
const body = document.querySelector('body');
const main = document.querySelector('#main');
const topDiv = document.querySelector('#top');
const center = document.querySelector('#center');
const bottomDiv = document.querySelector('#bottom');

//top div
const conceptionDateField = document.querySelector('#conceptionDateField');
const conceptionDateSearch = document.querySelector('#conceptionDateSearch');
const conceptionDateIcon = document.querySelector('#conceptionDateIcon');
const periodDateIcon = document.querySelector('#periodDateIcon');

//Wheel div
const wheel = document.querySelector('#wheel');
const wheelValue = document.querySelector('#wheelValue');
const wheelBlur = document.querySelector('#wheel-blur');
const movingWheel = document.querySelector('#moving-wheel');
const fixedWheel = document.querySelector('#fixed-wheel');
const zoom = document.querySelector('#zoom');
const periodWheelIcon = document.querySelector('#period-wheel-icon')
const spermWheelIcon = document.querySelector('#sperm-wheel-icon')
const babyWheelIcon = document.querySelector('#baby-wheel-icon')

//Scroll buttons under wheel
const fastLeft = document.querySelector('#fastLeft');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const fastRight = document.querySelector('#fastRight');

//Current Date div
const currentDateDiv = document.querySelector('#currentDate');
const currentDateIcon = document.querySelector('#currentDateIcon');
const currentDateField = document.querySelector('#currentDateField');
const currentDateSearch = document.querySelector('#currentDateSearch');

//Fixed text containers in bottom div
const eventPeriod = document.querySelector('#event-period');
const eventConception = document.querySelector('#event-conception');
const eventBirth = document.querySelector('#event-birth');

//Popup divs
const eventsDiv = document.querySelector('#events-div');
const closeEventsDiv = document.querySelector('#closeEventsDiv');
const sortEvents = document.querySelector('#sortEvents');
const eventsList = document.querySelector('#events-list');
const easterEgg = document.querySelector('#easter-egg');
const closeEasterEgg = document.querySelector('#closeEasterEgg');
const credits = document.querySelector('#credits');
const closeCredits = document.querySelector('#closeCredits');

//#endregion

let term;
calculateTerm();

//#endregion 

//#region - Responsiveness go there

//Onload event, logics start + onload responsiveness
window.onload = function () {
  if (toggleState === 'conception') {
    periodDateIcon.style.border = 'none';
    conceptionDateIcon.style.border = 'solid 1px white';
    periodDateField.style.display = 'none';
    conceptionDateField.style.display = 'flex';
  }
  resizeBackground();
  checkFlex();
  setTimeout(eventsWrap, 0);
  outer = Math.max(wheel.clientWidth, wheel.clientHeight);
  wheelSize = 2 * outer; //2*outer
  WheelPosition = `${wheel.clientWidth / 2 - wheelSize / 1.5}px`; //-size/1.5
  populateEvents();
}

//Resize event
window.onresize = function () {
  if (document.querySelector('#ui-datepicker-div')) {
    document.querySelector('#ui-datepicker-div').style.display = 'none';
  }
  resizeBackground();
  checkFlex();
  outer = Math.max(wheel.clientWidth, wheel.clientHeight);
  if (center.style.display === 'none') {
  }
  else if (zoomState === false) {
    easterEgg.style.display = 'none';
    credits.style.display = 'none';
    eventsDiv.style.display = 'none';
    center.style.display = 'flex';
    topDiv.style.display = 'flex';
    currentDateDiv.style.display = 'flex';
    bottomDiv.style.display = 'flex';
    wheelSize = 2 * outer; //2*outer
    WheelPosition = `${wheel.clientWidth / 2 - wheelSize / 1.5}px`; //-size/1.5
  } else {
    easterEgg.style.display = 'none';
    credits.style.display = 'none';
    eventsDiv.style.display = 'none';
    center.style.display = 'flex';
    currentDateDiv.style.display = 'none';
    topDiv.style.display = 'flex';
    currentDateDiv.style.display = 'flex';
    wheelSize = 1 * outer; //2*outer
    if (wheel.clientWidth < wheel.clientHeight) {
      WheelPosition = `${wheel.clientWidth - wheelSize}px`; //-size/1.5
    } else {
      WheelPosition = `${wheel.clientWidth / 2 - wheelSize / 2}px`; //-size/1.5
    }
  }
  drawWheel();
}

//resize - Mobile
window.onorientationchange = function () {
  if (document.querySelector('#ui-datepicker-div')) {
    document.querySelector('#ui-datepicker-div').style.display = 'none';
  }
  resizeBackground();
  checkFlex();
  outer = Math.max(wheel.clientWidth, wheel.clientHeight);
  if (center.style.display === 'none') {
  }
  else if (zoomState === false) {
    easterEgg.style.display = 'none';
    credits.style.display = 'none';
    eventsDiv.style.display = 'none';
    center.style.display = 'flex';
    topDiv.style.display = 'flex';
    currentDateDiv.style.display = 'flex';
    bottomDiv.style.display = 'flex';
    wheelSize = 2 * outer; //2*outer
    WheelPosition = `${wheel.clientWidth / 2 - wheelSize / 1.5}px`; //-size/1.5
  } else {
    easterEgg.style.display = 'none';
    credits.style.display = 'none';
    eventsDiv.style.display = 'none';
    center.style.display = 'flex';
    currentDateDiv.style.display = 'none';
    topDiv.style.display = 'flex';
    currentDateDiv.style.display = 'flex';
    wheelSize = 1 * outer; //2*outer
    if (wheel.clientWidth < wheel.clientHeight) {
      WheelPosition = `${wheel.clientWidth - wheelSize}px`; //-size/1.5
    } else {
      WheelPosition = `${wheel.clientWidth / 2 - wheelSize / 2}px`; //-size/1.5
    }
  }
  drawWheel();
}

//Adjust background to fill entire window
function resizeBackground() {
  if (window.innerHeight / window.innerWidth > 1371 / 1028) {
    html.style.backgroundSize = `auto ${window.innerHeight}px`;
  } else {
    html.style.backgroundSize = `${window.innerWidth}px auto`;
  }
}

//Switches from landscape to portrait mode around a screen ratio of 0.9
function checkFlex() {
  if (window.innerHeight / window.innerWidth > 0.9) {
    main.style.flexDirection = 'column';
    topDiv.style.flexDirection = 'row';
    currentDateDiv.style.flexDirection = 'row';
    periodDateField.style.flexDirection = 'row';
    conceptionDateField.style.flexDirection = 'row';
    currentDateField.style.flexDirection = 'row';
    bottomDiv.style.minHeight = '25vh';
    center.style.marginLeft = '0px';
    center.style.marginRight = '0px';
    for (let i = 0; i < document.querySelectorAll('.container').length; i++) {
      document.querySelectorAll('.container')[i].style.flexDirection = 'column';
    }
  } else {
    main.style.flexDirection = 'row';
    topDiv.style.flexDirection = 'column';
    currentDateDiv.style.flexDirection = 'column';
    periodDateField.style.flexDirection = 'column';
    conceptionDateField.style.flexDirection = 'column';
    currentDateField.style.flexDirection = 'column';
    bottomDiv.style.minWidth = '25vh';
    center.style.marginTop = '0px';
    center.style.marginBottom = '0px';
    for (let i = 0; i < document.querySelectorAll('.container').length; i++) {
      document.querySelectorAll('.container')[i].style.flexDirection = 'row';
    }
  }
}

//Wraps events text in bottom div in landscape mode
function eventsWrap() {
  if (window.innerHeight / window.innerWidth > 0.9) {
    for (let i = 0; i < document.querySelectorAll('.eventTitle').length; i++) {
      const field = document.querySelectorAll('.eventTitle')[i];
      field.innerHTML = field.textContent.replace('\n', ' ');
    }
  } else {
    for (let i = 0; i < document.querySelectorAll(' .eventTitle').length; i++) {
      const field = document.querySelectorAll('.eventTitle')[i];
      field.innerHTML = field.textContent.replace(' ', '\n');
    }
  }
}

//#endregion

//#region - Envent listeners go there

//Date pickers events
conceptionDateSearch.onclick = setPeriodDate;
conceptionDateField.onclick = setPeriodDate;
periodDateField.onclick = setPeriodDate;

currentDateSearch.onclick = setCurrentDate;
currentDateField.onclick = setCurrentDate;

currentDateIcon.onclick = function () {
  currentDate = new Date();
  if (currentDate.valueOf() - periodDate.valueOf() < 0) {
    periodDate = new Date(currentDate.valueOf());
    calculateConceptionDate();
  }
  update();
  rotateWheel(term);
}

//Wheel Zoom mode events
zoom.onclick = function () {
  if (zoomState === false) {
    zoomState = true;
    bottomDiv.style.display = 'none';
    wheelValue.style.display = 'none';
    zoom.style.backgroundImage = 'url(images/zoomOut.png)';
    outer = Math.max(wheel.clientWidth, wheel.clientHeight);
    wheelSize = 1 * outer; //2*outer
    if (wheel.clientWidth < wheel.clientHeight) {
      WheelPosition = `${wheel.clientWidth - wheelSize}px`;
    } else {
      WheelPosition = `${wheel.clientWidth / 2 - wheelSize / 2}px`;
    }
    drawWheel();
  } else {
    zoomState = false;
    bottomDiv.style.display = 'flex';
    wheelValue.style.display = 'flex';
    zoom.style.backgroundImage = 'url(images/zoomIn.png)';
    outer = Math.max(wheel.clientWidth, wheel.clientHeight);
    wheelSize = 2 * outer; //2*outer
    WheelPosition = `${wheel.clientWidth / 2 - wheelSize / 1.5}px`;
    drawWheel();
  }
}

//Enters & quits Events List popup mode
bottomDiv.onclick = function () {
  populateEventsList();
  center.style.display = 'none';
  bottomDiv.style.display = 'none';
  currentDateDiv.style.display = 'none';
  eventsDiv.style.display = 'flex';
}

closeEventsDiv.onclick = function () {
  center.style.display = 'flex';
  bottomDiv.style.display = 'flex';
  currentDateDiv.style.display = 'flex';
  eventsDiv.style.display = 'none';

}

//Switches sorting mode of Events List popup
sortEvents.onclick = function () {
  if (eventsSort === 'type') {
    eventsSort = 'date';
    localStorage.setItem('sort', 'date');
  } else {
    eventsSort = 'type';
    localStorage.setItem('sort', 'type');
  }
  sortEventsList();
  populateEventsList();
}

//Easter egg popup
document.querySelector('header').onclick = function () {
  center.style.display = 'none';
  bottomDiv.style.display = 'none';
  currentDateDiv.style.display = 'none';
  topDiv.style.display = 'none';
  credits.style.display = 'none';
  eventsDiv.style.display = 'none';
  easterEgg.style.display = 'flex';
}

closeEasterEgg.onclick = function () {
  center.style.display = 'flex';
  topDiv.style.display = 'flex';
  currentDateDiv.style.display = 'flex';
  easterEgg.style.display = 'none';
  if (zoomState === false) {
    bottomDiv.style.display = 'flex';
  }
}

//Credits popup
document.querySelector('footer').onclick = function () {
  center.style.display = 'none';
  bottomDiv.style.display = 'none';
  currentDateDiv.style.display = 'none';
  topDiv.style.display = 'none';
  easterEgg.style.display = 'none';
  eventsDiv.style.display = 'none';
  credits.style.display = 'flex';
}

closeCredits.onclick = function () {
  center.style.display = 'flex';
  currentDateDiv.style.display = 'flex';
  topDiv.style.display = 'flex';
  credits.style.display = 'none';
  if (zoomState === false) {
    bottomDiv.style.display = 'flex';
  }
}

//#region - Wheel scrollbar events, desktop & mobile

fastLeft.onclick = function () {
  currentDateChange(-7);
}
left.onclick = function () {
  currentDateChange(-1);
}
right.onclick = function () {
  currentDateChange(1);
}
fastRight.onclick = function () {
  currentDateChange(7);
}

let wait;
let scroll;

fastLeft.onmousedown = function () {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(-7);
    }, 50);
  }, 200)
}
fastLeft.onmouseup = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}
fastLeft.onmouseout = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}

fastLeft.ontouchstart = function (e) {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(-7);
    }, 50);
  }, 200)
  e.preventDefault();
}
fastLeft.ontouchend = function () {
  clearTimeout(wait);
  clearInterval(scroll);
  currentDateChange(-7);
}

left.onmousedown = function () {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(-1);
    }, 50);
  }, 200)
}
left.onmouseup = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}
left.onmouseout = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}


left.ontouchstart = function (e) {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(-1);
    }, 50);
  }, 200)
  e.preventDefault();
}
left.ontouchend = function () {
  clearTimeout(wait);
  clearInterval(scroll);
  currentDateChange(-1);
}

right.onmousedown = function () {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(1);
    }, 50);
  }, 200)
}
right.onmouseup = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}
right.onmouseout = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}

right.ontouchstart = function (e) {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(1);
    }, 50);
  }, 200)
  e.preventDefault();
}
right.ontouchend = function () {
  clearTimeout(wait);
  clearInterval(scroll);
  currentDateChange(1);
}

fastRight.onmousedown = function () {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(7);
    }, 50);
  }, 200)
}
fastRight.onmouseup = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}
fastRight.onmouseout = function () {
  clearTimeout(wait);
  clearInterval(scroll);
}

fastRight.ontouchstart = function (e) {
  wait = setTimeout(function () {
    scroll = setInterval(function () {
      currentDateChange(7);
    }, 50);
  }, 200)
  e.preventDefault();
}
fastRight.ontouchend = function () {
  clearTimeout(wait);
  clearInterval(scroll);
  currentDateChange(7);
}
//#endregion

//Period / Conception dates view Toggle events

conceptionDateIcon.onclick = toggle;
periodDateIcon.onclick = toggle;

//#region - Wheel scroll events, desktop...

fixedWheel.onmousedown = function () {
  isScrolling = true;
  movement = 0;
}

fixedWheel.onmousemove = function (e) {
  if (isScrolling === true) {

    let result = 0;

    if (e.offsetX < wheelSize / 2 && e.offsetY < wheelSize / 2) {
      result = e.movementX - e.movementY;
    } else if (e.offsetX >= wheelSize / 2 && e.offsetY < wheelSize / 2) {
      result = e.movementX + e.movementY;
    } else if (e.offsetX >= wheelSize / 2 && e.offsetY >= wheelSize / 2) {
      result = -e.movementX + e.movementY;
    } else {
      result = -e.movementX - e.movementY;
    };
    movement = movement + result;
    rotateWheel(term - movement / wheelSize * 100);
  }
}

fixedWheel.onmouseup = function () {
  isScrolling = false;
  wheelRotation = ((Math.round(wheelRotation)) + 294) % 294;
  currentDate = new Date(periodDate.valueOf() + (wheelRotation) * 1000 * 60 * 60 * 24 + 1000 * 60 * 60);
  update();
  rotateWheel(term);
};

fixedWheel.onmouseout = function () {
  if (isScrolling === true) {
    isScrolling = false;
    wheelRotation = ((Math.round(wheelRotation)) + 294) % 294;
    currentDate = new Date(periodDate.valueOf() + (wheelRotation) * 1000 * 60 * 60 * 24 + 1000 * 60 * 60);
    update();
    rotateWheel(term);
  }
};
//#endregion

//#region  - Wheel scroll events, mobile...

wheel.ontouchstart = function () {
  isScrolling = true;
  movement = 0;
  previousTouch = undefined;
}

fixedWheel.ontouchmove = function (e) {
  e.preventDefault();
  if (isScrolling === true) {

    let result = 0;

    const touch = e.touches[0];
    if (previousTouch) {
      e.movementX = touch.pageX - previousTouch.pageX;
      e.movementY = touch.pageY - previousTouch.pageY;
    }
    else {
      e.movementX = 0;
      e.movementY = 0;
    };
    previousTouch = touch;

    let bcr = e.target.getBoundingClientRect();

    if (e.targetTouches[0].clientX - bcr.x < wheelSize / 2 && e.targetTouches[0].clientY - bcr.y < wheelSize / 2) {
      result = e.movementX - e.movementY;
    } else if (e.targetTouches[0].clientX - bcr.x >= wheelSize / 2 && e.targetTouches[0].clientY - bcr.y < wheelSize / 2) {
      result = e.movementX + e.movementY;
    } else if (e.targetTouches[0].clientX - bcr.x >= wheelSize / 2 && e.targetTouches[0].clientY - bcr.y >= wheelSize / 2) {
      result = -e.movementX + e.movementY;
    } else {
      result = -e.movementX - e.movementY;
    };

    movement = movement + result;
    rotateWheel(term - movement / wheelSize * 100);
  }
}

wheel.ontouchend = function () {
  isScrolling = false;
  wheelRotation = ((Math.round(wheelRotation)) + 294) % 294;
  currentDate = new Date(periodDate.valueOf() + wheelRotation * 1000 * 60 * 60 * 24 + 1000 * 60 * 60);
  update();
  rotateWheel(term);
};

//#endregion

//#endregion

//#region  - Functions go there

//Fills Events array from CSV "database"
function populateEvents() {
  fetch('events.csv')
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      const array = text.split('\n');
      for (let i = 0; i < array.length; i++) {
        const subArray = array[i].split(';');
        newEvent = new Event(subArray[0], subArray[1], subArray[2], subArray[3], subArray[4]);
        events.push(newEvent);
      }

    }).then(populateDays)
    .then(update)
    .then(checkFlex)
    .then(eventsWrap)
    .then(drawWheel)
    .then(rotateWheel(term))
}

//Fills Events list from events array
function populateEventsList() {

  sortEventsList();
  eventsList.innerHTML = '';

  let linebreak = document.createElement('p');
  linebreak.innerHTML = ' ';
  eventsList.appendChild(linebreak);

  let periodContainer = document.createElement('div');
  periodContainer.setAttribute('class', 'container');
  periodContainer.style.display = 'flex';
  periodContainer.style.justifyContent = 'center';
  periodContainer.style.color = 'white';
  let periodEventP = document.createElement('p');
  let periodDateP = document.createElement('p');
  let periodLinebreak = document.createElement('p');
  periodEventP.innerHTML = 'Date des dernières règles: ';
  periodDateP.innerHTML = `${datesfr.format(periodDate)}`;
  periodLinebreak.innerHTML = ' ';
  periodContainer.appendChild(periodEventP);
  periodContainer.appendChild(periodDateP);
  eventsList.appendChild(periodContainer);
  eventsList.appendChild(periodLinebreak);

  let conceptionContainer = document.createElement('div');
  conceptionContainer.setAttribute('class', 'container');
  conceptionContainer.style.display = 'flex';
  conceptionContainer.style.justifyContent = 'center';
  conceptionContainer.style.color = 'white';
  let conceptionEventP = document.createElement('p');
  let conceptionDateP = document.createElement('p');
  let conceptionLinebreak = document.createElement('p');
  conceptionEventP.innerHTML = 'Date de conception: ';
  conceptionDateP.innerHTML = `${datesfr.format(conceptionDate)}`;
  conceptionLinebreak.innerHTML = ' ';
  conceptionContainer.appendChild(conceptionEventP);
  conceptionContainer.appendChild(conceptionDateP);
  eventsList.appendChild(conceptionContainer);
  eventsList.appendChild(conceptionLinebreak);

  let birthContainer = document.createElement('div');
  birthContainer.setAttribute('class', 'container');
  birthContainer.style.display = 'flex';
  birthContainer.style.justifyContent = 'center';
  birthContainer.style.color = 'white';
  let birthEventP = document.createElement('p');
  let birthDateP = document.createElement('p');
  let birthLinebreak = document.createElement('p');
  birthEventP.innerHTML = 'Terme théorique: ';
  birthDateP.innerHTML = `${datesfr.format(new Date(periodDate.valueOf() + 287 * 1000 * 60 * 60 * 24 + 1000 * 60 * 60))}`;
  birthLinebreak.innerHTML = ' ';
  birthContainer.appendChild(birthEventP);
  birthContainer.appendChild(birthDateP);
  eventsList.appendChild(birthContainer);
  eventsList.appendChild(birthLinebreak);

  for (let i = 1; i < events.length; i++) {

    let container = document.createElement('div');
    eventsList.appendChild(container);
    container.setAttribute('class', 'container');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.color = `${colors[events[i].rank - 1]}`

    let eventStartDate = new Date(periodDate.valueOf() + parseInt(events[i].start) * 1000 * 60 * 60 * 24 + 1000 * 60 * 60);
    let eventEndDate = new Date(periodDate.valueOf() + parseInt(events[i].end) * 1000 * 60 * 60 * 24 + 1000 * 60 * 60);

    let event = document.createElement('p');
    event.innerHTML = `${events[i].description}: `;
    container.appendChild(event);

    let date = document.createElement('p');
    date.innerHTML = `du ${datesfr.format(eventStartDate).split(' ')[0]} ${datesfr.format(eventStartDate).split(' ')[1]} au ${datesfr.format(eventEndDate).split(' ')[0]} ${datesfr.format(eventEndDate).split(' ')[1]}`;
    container.appendChild(date);

    let linebreak = document.createElement('p');
    linebreak.innerHTML = ' ';
    eventsList.appendChild(linebreak);
  }
  checkFlex();
}

//Sorts events list depending on sorting mode chosen
function sortEventsList() {
  if (eventsSort === 'type') {
    events.sort(function (a, b) {
      return a.start - b.start;
    })

    events.sort(function (a, b) {
      return a.rank - b.rank;
    })
  } else {
    events.sort(function (a, b) {
      return a.start - b.start;
    })
  }
}

//Fills days array from Events array
function populateDays() {
  for (let i = 0; i < 294; i++) {
    const day = new Day();
    days.push(day);
  }

  for (let j = 0; j < 294; j++) {
    days[j].number = j + 1;
  }

  for (let k = 1; k < events.length; k++) {
    for (let l = parseInt(events[k].start); l < parseInt(events[k].end); l++) {
      if (parseInt(events[k].rank) === 1) {
        days[l].event1 = events[k].description;
        days[l].r1 = parseInt(events[k].end) - l;
      } else if (parseInt(events[k].rank) === 2) {
        days[l].event2 = events[k].description;
        days[l].r2 = parseInt(events[k].end) - l;
      } else if (parseInt(events[k].rank) === 3) {
        days[l].event3 = events[k].description;
        days[l].r3 = parseInt(events[k].end) - l;
      } else {
        days[l].event4 = events[k].description;
        days[l].r4 = parseInt(events[k].end) - l;
      }
    }
  }
}

//Toggles betwen Period date / Conception date view mode
function toggle() {
  if (toggleState === 'conception') {
    localStorage.setItem('toggle', 'period');
    toggleState = 'period';
    periodDateIcon.style.border = 'solid 1px white';
    conceptionDateIcon.style.border = 'none';
    periodDateField.style.display = 'flex';
    conceptionDateField.style.display = 'none';

  } else {
    localStorage.setItem('toggle', 'conception');
    toggleState = 'conception';
    periodDateIcon.style.border = 'none';
    conceptionDateIcon.style.border = 'solid 1px white';
    periodDateField.style.display = 'none';
    conceptionDateField.style.display = 'flex';
  }
}

//Datepicker for both Period Date & Conception date, depending on each other
function setPeriodDate() {

  if (toggleState === 'period') {
    $('#conceptionDateField').datepicker('dialog', periodDate, onSelect);
    $('#conceptionDateSearch').datepicker('dialog', periodDate, onSelect);
    function onSelect(text, instance) {
      periodDate.setDate(parseInt(instance.currentDay));
      periodDate.setMonth(instance.currentMonth);
      periodDate.setFullYear(instance.currentYear);
      periodDate.setHours(0);
      periodDate.setMinutes(0);
      periodDate.setSeconds(0);
      periodDate.setMilliseconds(0);
      //store in memory
      localStorage.setItem('start', periodDate.valueOf());
      if (currentDate.valueOf() - periodDate.valueOf() < 0) {
        currentDate = new Date(periodDate.valueOf());
      }
      calculateConceptionDate();
      populateEventsList();
      update();
      drawWheel();
      rotateWheel(term);
    }
  } else if (toggleState === 'conception') {
    $('#periodDateField').datepicker('dialog', conceptionDate, onSelect);
    $('#conceptionDateSearch').datepicker('dialog', conceptionDate, onSelect);
    function onSelect(text, instance) {
      conceptionDate.setDate(parseInt(instance.currentDay));
      conceptionDate.setMonth(instance.currentMonth);
      conceptionDate.setFullYear(instance.currentYear);
      conceptionDate.setHours(0);
      conceptionDate.setMinutes(0);
      conceptionDate.setSeconds(0);
      conceptionDate.setMilliseconds(0);
      calculatePeriodDate();
      //store in memory
      localStorage.setItem('start', periodDate.valueOf());
      if (currentDate.valueOf() - periodDate.valueOf() < 0) {
        currentDate = new Date(periodDate.valueOf());
      }
      populateEventsList();
      update();
      drawWheel();
      rotateWheel(term);
    }
  }
}

//Datepicker for Current Date
function setCurrentDate() {

  $('#currentDateField').datepicker('dialog', currentDate, onSelect);
  $('#currentDateSearch').datepicker('dialog', currentDate, onSelect);
  function onSelect(text, instance) {
    currentDate.setDate(parseInt(instance.currentDay));
    currentDate.setMonth(instance.currentMonth);
    currentDate.setFullYear(instance.currentYear);
    if (currentDate.valueOf() - periodDate.valueOf() < 0) {
      periodDate = new Date(currentDate.valueOf());
    }
    calculateConceptionDate();
    update();
    rotateWheel(term);
  }
}

//Calculate dates from scrollbar buttons events
function currentDateChange(days) {
  currentDate.setHours(1);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  if (term + days < 0) {
    currentDate = new Date(currentDate.valueOf() + (294 + days) * 1000 * 60 * 60 * 24);
    update();
    rotateWheel(term);
  } else if (term + days > 293) {
    currentDate = new Date(currentDate.valueOf() + (days - 294) * 1000 * 60 * 60 * 24);
    update();
    rotateWheel(term);
  } else {
    currentDate = new Date(currentDate.valueOf() + days * 1000 * 60 * 60 * 24);
    update();
    rotateWheel(term);
  }
}

//Calculates term from Period Date & Current Date
function calculateTerm() {

  let value;
  let difference = (currentDate - currentDate.getTimezoneOffset()) - (periodDate - periodDate.getTimezoneOffset());

  if (Math.sign(Math.floor((difference) / (1000 * 60 * 60 * 24))) < 0) {
    value = 0;
    wheelBlur.style.display = 'none';
  } else if (Math.floor((difference) / (1000 * 60 * 60 * 24)) >= 294) {
    value = (Math.floor((difference) / (1000 * 60 * 60 * 24)));
    wheelBlur.style.display = 'block';
  } else {
    value = (Math.floor((difference) / (1000 * 60 * 60 * 24)));
    wheelBlur.style.display = 'none';
  }
  term = value;
}

//Calculates Conception date from Period date, 14 days gap forwards
function calculateConceptionDate() {
  conceptionDate = new Date(periodDate.valueOf() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60);
  conceptionDate.setHours(0);
  conceptionDate.setMinutes(0);
  conceptionDate.setSeconds(0);
  conceptionDate.setMilliseconds(0);
}

//Calculates Period date from Conception date, 14 days gap backwards
function calculatePeriodDate() {
  periodDate = new Date(conceptionDate.valueOf() - 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60);
  periodDate.setHours(0);
  periodDate.setMinutes(0);
  periodDate.setSeconds(0);
  periodDate.setMilliseconds(0);
}

//Displays either Period Date or Cuonception date in top div
function displayPeriodDate() {
  if (datesfr.format(conceptionDate).split(' ')[0] === '1') {
    document.querySelector('#conceptionDateField .day').innerHTML = ' ' + datesfr.format(conceptionDate).split(' ')[0] + 'er ';
  } else {
    document.querySelector('#conceptionDateField .day').innerHTML = ' ' + datesfr.format(conceptionDate).split(' ')[0] + ' ';
  }

  document.querySelector('#conceptionDateField .month').innerHTML = ' ' + datesfr.format(conceptionDate).split(' ')[1] + ' ';
  document.querySelector('#conceptionDateField .year').innerHTML = ' ' + datesfr.format(conceptionDate).split(' ')[2] + ' ';

  if (datesfr.format(periodDate).split(' ')[0] === '1') {
    document.querySelector('#periodDateField .day').innerHTML = ' ' + datesfr.format(periodDate).split(' ')[0] + 'er ';
  } else {
    document.querySelector('#periodDateField .day').innerHTML = ' ' + datesfr.format(periodDate).split(' ')[0] + ' ';
  }

  document.querySelector('#periodDateField .month').innerHTML = ' ' + datesfr.format(periodDate).split(' ')[1] + ' ';
  document.querySelector('#periodDateField .year').innerHTML = ' ' + datesfr.format(periodDate).split(' ')[2] + ' ';

}

//Displays Current Date in current date div
function displayCurrentDate() {
  if (datesfr.format(currentDate).split(' ')[0] === '1') {
    document.querySelector('#currentDateField .day').innerHTML = ' ' + datesfr.format(currentDate).split(' ')[0] + 'er ';
  }
  else {
    document.querySelector('#currentDateField .day').innerHTML = ' ' + datesfr.format(currentDate).split(' ')[0] + ' ';
  }

  document.querySelector('#currentDateField .month').innerHTML = ' ' + datesfr.format(currentDate).split(' ')[1] + ' ';
  document.querySelector('#currentDateField .year').innerHTML = ' ' + datesfr.format(currentDate).split(' ')[2] + ' ';

}

//Displays term in term (scrollbar under wheel div)
function displayTerm() {
  let termMonth = Math.ceil(term / 30);
  const termWeek = Math.floor(term / 7);
  const termDays = term % 7;
  if (termMonth === 1 || termMonth === 0) {
    termMonth = 1;
    document.querySelectorAll('#wheelValueField p')[0].innerHTML = `${termMonth}er mois`;
  } else {
    document.querySelectorAll('#wheelValueField p')[0].innerHTML = `${termMonth}ème mois`;
  }

  if (termDays === 1) {
    document.querySelectorAll('#wheelValueField p')[1].innerHTML = `${termWeek} sem. et ${termDays} jour`;
  } else {
    document.querySelectorAll('#wheelValueField p')[1].innerHTML = `${termWeek} sem. et ${termDays} jours`;
  }
}

//Display events text in bottom div
function displayEvents() {

  if (term === 0) {
    eventPeriod.style.display = 'block';
    eventConception.style.display = 'none';
    eventBirth.style.display = 'none';
    document.querySelector('#event0').style.display = 'none';
  } else if (term === 14) {
    eventPeriod.style.display = 'none';
    eventConception.style.display = 'block';
    eventBirth.style.display = 'none';
    document.querySelector('#event0').style.display = 'none';
  } else if (term === 287) {
    eventPeriod.style.display = 'none';
    eventConception.style.display = 'none';
    eventBirth.style.display = 'block';
    document.querySelector('#event0').style.display = 'none';
  } else {
    eventPeriod.style.display = 'none';
    eventConception.style.display = 'none';
    eventBirth.style.display = 'none';
    document.querySelector('#event0').style.display = 'none';
  }

  if (term > 294) {
    document.querySelector('#event0').style.display = 'flex';
    document.querySelector('#event1').style.display = 'none';
    document.querySelector('#event2').style.display = 'none';
    document.querySelector('#event3').style.display = 'none';
    document.querySelector('#event4').style.display = 'none';
  } else {
    if (days[term].event1 === undefined && days[term].event2 === undefined && days[term].event3 === undefined && days[term].event4 === undefined && term !== 0 && term !== 14 && term !== 287) {
      document.querySelector('#event0').style.display = 'flex';
      document.querySelector('#event1').style.display = 'none';
      document.querySelector('#event2').style.display = 'none';
      document.querySelector('#event3').style.display = 'none';
      document.querySelector('#event4').style.display = 'none';
    } else {
      if (days[term].event1 === undefined || days[term].r1 === 0) {
        document.querySelector('#event1').style.display = "none";
      } else {
        document.querySelector('#event1').style.display = "";
        document.querySelector('#event0').style.display = "none";
        document.querySelector('#event1 .eventTitle').innerHTML = days[term].event1;


        if (days[term].r1 > 6) {
          if (days[term].r1 % 7 === 1) {
            document.querySelector('#event1 .daysLeft').innerHTML = `${Math.floor(days[term].r1 / 7)} sem. et ${days[term].r1 % 7} jour`;
          } else if (days[term].r1 % 7 === 0) {
            document.querySelector('#event1 .daysLeft').innerHTML = `${Math.floor(days[term].r1 / 7)} sem.`;
          } else {
            document.querySelector('#event1 .daysLeft').innerHTML = `${Math.floor(days[term].r1 / 7)} sem. et ${days[term].r1 % 7} jours`;
          }
        } else {
          if (days[term].r1 === 1) {
            document.querySelector('#event1 .daysLeft').innerHTML = 'Dernier jour';
          } else {
            document.querySelector('#event1 .daysLeft').innerHTML = `${days[term].r1} jours`;
          }
        }


      }
      if (days[term].event2 === undefined || days[term].r2 === 0) {
        document.querySelector('#event2').style.display = "none";
      } else {
        document.querySelector('#event2').style.display = "";
        document.querySelector('#event0').style.display = "none";
        document.querySelector('#event2 .eventTitle').innerHTML = days[term].event2;
        if (days[term].r2 > 6) {
          if (days[term].r2 % 7 === 1) {
            document.querySelector('#event2 .daysLeft').innerHTML = `${Math.floor(days[term].r2 / 7)} sem. et ${days[term].r2 % 7} jour`;
          } else if (days[term].r2 % 7 === 0) {
            document.querySelector('#event2 .daysLeft').innerHTML = `${Math.floor(days[term].r2 / 7)} sem.`;
          } else {
            document.querySelector('#event2 .daysLeft').innerHTML = `${Math.floor(days[term].r2 / 7)} sem. et ${days[term].r2 % 7} jours`;
          }
        } else {
          if (days[term].r2 === 1) {
            document.querySelector('#event2 .daysLeft').innerHTML = 'Dernier jour';
          } else {
            document.querySelector('#event2 .daysLeft').innerHTML = `${days[term].r2} jours`;
          }
        }
      }
      if (days[term].event3 === undefined || days[term].r3 === 0) {
        document.querySelector('#event3').style.display = "none";
      } else {
        document.querySelector('#event3').style.display = "";
        document.querySelector('#event0').style.display = "none";
        document.querySelector('#event3 .eventTitle').innerHTML = days[term].event3;
        if (days[term].r3 > 6) {
          if (days[term].r3 % 7 === 1) {
            document.querySelector('#event3 .daysLeft').innerHTML = `${Math.floor(days[term].r3 / 7)} sem. et ${days[term].r3 % 7} jour`;
          } else if (days[term].r3 % 7 === 0) {
            document.querySelector('#event3 .daysLeft').innerHTML = `${Math.floor(days[term].r3 / 7)} sem.`;
          } else {
            document.querySelector('#event3 .daysLeft').innerHTML = `${Math.floor(days[term].r3 / 7)} sem. et ${days[term].r3 % 7} jours`;
          }
        } else {
          if (days[term].r3 === 1) {
            document.querySelector('#event3 .daysLeft').innerHTML = 'Dernier jour';
          } else {
            document.querySelector('#event3 .daysLeft').innerHTML = `${days[term].r3} jours`;
          }
        }
      }
      if (days[term].event4 === undefined || days[term].r4 === 0) {
        document.querySelector('#event4').style.display = "none";
      } else {
        document.querySelector('#event4').style.display = "";
        document.querySelector('#event0').style.display = "none";
        document.querySelector('#event4 .eventTitle').innerHTML = days[term].event4;
        if (days[term].r4 > 6) {
          if (days[term].r4 % 7 === 1) {
            document.querySelector('#event4 .daysLeft').innerHTML = `${Math.floor(days[term].r4 / 7)} sem. et ${days[term].r4 % 7} jour`;
          } else if (days[term].r4 % 7 === 0) {
            document.querySelector('#event4 .daysLeft').innerHTML = `${Math.floor(days[term].r4 / 7)} sem.`;
          } else {
            document.querySelector('#event4 .daysLeft').innerHTML = `${Math.floor(days[term].r4 / 7)} sem. et ${days[term].r4 % 7} jours`;
          }
        } else {
          if (days[term].r4 === 1) {
            document.querySelector('#event4 .daysLeft').innerHTML = 'Dernier jour';
          } else {
            document.querySelector('#event4 .daysLeft').innerHTML = `${days[term].r4} jours`;
          }
        }
      }
    }
  }

  checkFlex();
  eventsWrap();
  eventsWrap();
}

//Converts days to radians
function daysToRad(days) {
  return (days / 294 * 2 * Math.PI);
}

//Draws wheel from events array
function drawWheel() {

  //Variables de la roue
  movingWheel.width = movingWheel.height = wheelSize;
  fixedWheel.width = fixedWheel.height = wheelSize;
  movingWheel.style.left = WheelPosition;
  fixedWheel.style.left = WheelPosition;

  const ctxM = movingWheel.getContext('2d');
  const ctxF = fixedWheel.getContext('2d');
  const fontSize = wheelSize / 48;
  ctxM.font = `${fontSize}px montserrat`;
  ctxM.textAlign = 'center';

  ctxM.translate(wheelSize / 2, wheelSize / 2);
  ctxM.rotate(-Math.PI / 2);
  ctxF.translate(wheelSize / 2, wheelSize / 2);
  ctxF.rotate(-Math.PI / 2);

  //Triangle "0" sur roue fixe
  ctxF.save();
  ctxF.rotate(Math.PI / 2);
  ctxF.fillStyle = 'white';
  ctxF.beginPath();
  ctxF.moveTo(0.7 * fontSize, -wheelSize / 2.01);
  ctxF.lineTo(0, -wheelSize / 2.09);
  ctxF.lineTo(-0.7 * fontSize, -wheelSize / 2.01);
  ctxF.fill();
  ctxF.restore();

  //Cercle au centre de la roue (fixe)
  ctxF.fillStyle = 'white';
  ctxF.beginPath();
  ctxF.arc(0, 0, 0.2 * fontSize, 0, 2 * Math.PI);
  ctxF.fill();

  //Trait matérialisant le "0"
  ctxF.save();
  ctxF.rotate(Math.PI / 2)
  ctxF.strokeStyle = 'white';
  ctxF.moveTo(0, 0);
  ctxF.lineTo(0, -(wheelSize / 2 - 4.7 * fontSize));
  ctxF.stroke();
  ctxF.restore();

  //plage couleur fond mois impairs
  for (let i = 0; i < 5; i++) {
    ctxM.fillStyle = 'rgba(35,53,74,0.4)';
    ctxM.beginPath();
    ctxM.arc(0, 0, wheelSize / 2.1, daysToRad(2 * i * 30), daysToRad(2 * i * 30 + 30), false);
    ctxM.lineTo(0, 0);
    ctxM.fill();
  }
  //plage couleur fond mois pairs
  for (let i = 0; i < 4; i++) {
    ctxM.fillStyle = 'rgba(35,53,74,0.6)';
    ctxM.beginPath();
    ctxM.arc(0, 0, wheelSize / 2.1, daysToRad(2 * i * 30 + 30), daysToRad(2 * i * 30 + 60), false);
    ctxM.lineTo(0, 0);
    ctxM.fill();
  }
  // plage couleur fond dernier mois
  ctxM.fillStyle = 'rgba(35,53,74,0.6)';
  ctxM.beginPath();
  ctxM.arc(0, 0, wheelSize / 2.1, daysToRad(270), daysToRad(294), false);
  ctxM.lineTo(0, 0);
  ctxM.fill();

  // ligne "0" sur roue mobile.
  ctxM.save();
  ctxM.rotate(Math.PI / 2);
  ctxM.strokeStyle = 'rgba(188,208,240,0.4)';
  ctxM.beginPath();
  ctxM.moveTo(0, 0);
  ctxM.lineTo(0, -(wheelSize / 2 - 8 * fontSize));
  ctxM.stroke();
  ctxM.restore();

  //Icônes sur roue mobile

  let imgSize = Math.floor(1.5 * fontSize);

  periodWheelIcon.width = periodWheelIcon.height = wheelSize;
  periodWheelIcon.style.left = WheelPosition;
  periodWheelIcon.style.backgroundSize = `${imgSize}px`;
  periodWheelIcon.style.backgroundPosition = `top ${6 * fontSize}px center`;

  spermWheelIcon.width = spermWheelIcon.height = wheelSize;
  spermWheelIcon.style.left = WheelPosition;
  spermWheelIcon.style.backgroundSize = `${imgSize}px`;
  spermWheelIcon.style.backgroundPosition = `top ${6 * fontSize}px center`;
  spermWheelIcon.style.transform = `rotate(${14 / 294}turn)`;

  babyWheelIcon.width = babyWheelIcon.height = wheelSize;
  babyWheelIcon.style.left = WheelPosition;
  babyWheelIcon.style.backgroundSize = `${imgSize}px`;
  babyWheelIcon.style.backgroundPosition = `top ${6 * fontSize}px center`;
  babyWheelIcon.style.transform = `rotate(${-7 / 294}turn)`;

  for (let i = 0; i < 42; i++) {

    let day;
    if (datesfr.format(new Date(periodDate.valueOf() + 7 * i * 24 * 1000 * 60 * 60 + 1000 * 60 * 60)).split(' ')[0] === '1') {
      day = `${datesfr.format(new Date(periodDate.valueOf() + 7 * i * 24 * 1000 * 60 * 60 + 1000 * 60 * 60)).split(' ')[0]}er`
    } else {
      day = `${datesfr.format(new Date(periodDate.valueOf() + 7 * i * 24 * 1000 * 60 * 60 + 1000 * 60 * 60)).split(' ')[0]}`
    }
    let month = `${datesfr.format(new Date(periodDate.valueOf() + 7 * i * 24 * 1000 * 60 * 60 + 1000 * 60 * 60)).split(' ')[1]}`


    ctxM.save();
    ctxM.rotate(Math.PI / 2 + daysToRad(i * 7));
    ctxM.translate(0, -(wheelSize / 2 - 4.5 * fontSize));
    ctxM.fillStyle = 'rgba(188,208,240,0.4)';
    ctxM.font = `${0.8 * fontSize}px montserrat`;
    ctxM.textAlign = 'center';
    ctxM.fillText(i, 0, 0);
    ctxM.restore();

    ctxM.save();
    ctxM.rotate(Math.PI / 2 + daysToRad(i * 7));
    ctxM.translate(0, -(wheelSize / 2 - 2.5 * fontSize));
    ctxM.font = `${fontSize}px montserrat`;
    ctxM.fillStyle = 'rgba(188,208,240)';
    ctxM.textAlign = 'center';
    ctxM.fillText(day, 0, 0);
    ctxM.restore();

    ctxM.save();
    ctxM.rotate(Math.PI / 2 + daysToRad(i * 7));
    ctxM.translate(0, -(wheelSize / 2 - 3.5 * fontSize));
    ctxM.fillStyle = 'rgba(188,208,240)';
    ctxM.textAlign = 'center';
    ctxM.fillText(month, 0, 0);
    ctxM.restore();

    ctxM.save();
    ctxM.strokeStyle = 'rgba(188,208,240)';
    ctxM.rotate(Math.PI / 2 + daysToRad(i * 7));
    ctxM.beginPath();
    ctxM.moveTo(0, wheelSize / 2.13);
    ctxM.lineTo(0, wheelSize / 2.1);
    ctxM.stroke();
    ctxM.restore();

  }

  for (let i = 0; i < 294; i++) {
    ctxM.save();
    ctxM.strokeStyle = 'rgba(188,208,240,0.5)';
    ctxM.rotate(Math.PI / 2 + daysToRad(i));
    ctxM.beginPath();
    ctxM.moveTo(0, wheelSize / 2.11);
    ctxM.lineTo(0, wheelSize / 2.1);
    ctxM.stroke();
    ctxM.restore();
  }

  for (let i = 1; i < events.length; i++) {
    if (events[i].rank === '1') {
      ctxM.strokeStyle = 'rgba(255,0,136,0.9)';
      ctxM.lineWidth = 1.5 * fontSize;
      ctxM.beginPath();
      ctxM.arc(0, 0, wheelSize / 2.3 - 3 * fontSize, daysToRad(events[i].start), daysToRad(events[i].end), false);
      ctxM.stroke();

      ctxM.save();
      ctxM.rotate(Math.PI / 2 + daysToRad(events[i].start) + daysToRad(4));
      ctxM.translate(0, -(wheelSize / 2.3 - 3 * fontSize))
      ctxM.fillStyle = 'rgba(188,208,240)';
      ctxM.textBaseline = 'middle';
      ctxM.fillText(`${events[i].short}`, 0, 0)
      ctxM.restore();

    } else if (events[i].rank === '2') {
      ctxM.strokeStyle = 'rgba(255,238,0,0.9)';
      ctxM.lineWidth = 1.5 * fontSize;
      ctxM.beginPath();
      ctxM.arc(0, 0, wheelSize / 2.3 - 5 * fontSize, daysToRad(events[i].start), daysToRad(events[i].end), false);
      ctxM.stroke();

      ctxM.save();
      ctxM.rotate(Math.PI / 2 + daysToRad(events[i].start) + daysToRad(4));
      ctxM.translate(0, -(wheelSize / 2.3 - 5 * fontSize))
      ctxM.fillStyle = 'rgba(9,20,38)';
      ctxM.textBaseline = 'middle';
      ctxM.fillText(`${events[i].short}`, 0, 0)
      ctxM.restore();

    } else if (events[i].rank === '3') {
      ctxM.strokeStyle = 'rgba(0,157,255,0.9)';
      ctxM.lineWidth = 1.5 * fontSize;
      ctxM.beginPath();
      ctxM.arc(0, 0, wheelSize / 2.3 - 7 * fontSize, daysToRad(events[i].start), daysToRad(events[i].end), false);
      ctxM.stroke();

      ctxM.save();
      ctxM.rotate(Math.PI / 2 + daysToRad(events[i].start) + daysToRad(4));
      ctxM.translate(0, -(wheelSize / 2.3 - 7 * fontSize))
      ctxM.fillStyle = 'rgba(188,208,240)';
      ctxM.textBaseline = 'middle';
      ctxM.fillText(`${events[i].short}`, 0, 0)
      ctxM.restore();

    } else {
      ctxM.strokeStyle = 'rgba(0,208,255,0.9)';
      ctxM.lineWidth = 1.5 * fontSize;
      ctxM.beginPath();
      ctxM.arc(0, 0, wheelSize / 2.3 - 9 * fontSize, daysToRad(events[i].start), daysToRad(events[i].end), false);
      ctxM.stroke();

      ctxM.save();
      ctxM.rotate(Math.PI / 2 + daysToRad(events[i].start) + daysToRad(4));
      ctxM.translate(0, -(wheelSize / 2.3 - 9 * fontSize))
      ctxM.fillStyle = 'rgba(9,20,38)';
      ctxM.textBaseline = 'middle';
      ctxM.fillText(`${events[i].short}`, 0, 0)
      ctxM.restore();

    }
  }
  eventsWrap();
  rotateWheel(term);
}

//Rotates wheel to term
function rotateWheel(days) {
  const rot = -days / 294;
  movingWheel.style.transform = `rotate(${rot}turn)`;
  wheelRotation = days;
  periodWheelIcon.style.transform = `rotate(${rot}turn)`;
  spermWheelIcon.style.transform = `rotate(${rot + 14 / 294}turn)`;
  babyWheelIcon.style.transform = `rotate(${rot - 7 / 294}turn)`;
}

//Updates visualization for all stuff ahead.
function update() {
  calculateTerm();
  displayPeriodDate();
  displayCurrentDate();
  displayTerm();
  displayEvents();
}

//#endregion