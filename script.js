// getting needed nodes

const chooseBtns = document.querySelector(".choose-buttons");
const chooseShortBtn = document.querySelector(".short-choose");
const chooseLongBtn = document.querySelector(".long-choose");
const chooseBreakShortBtn = document.querySelector(".short-break-choose");
const chooseBreakLongBtn = document.querySelector(".long-break-choose");
const timer = document.querySelector(".timer");
const breakTimer = document.querySelector(".break");
const shortBreakBtn = document.querySelector(".short");
const longBreakBtn = document.querySelector(".long");
const startBtn = document.querySelector(".start");
const finishBtn = document.querySelector(".finish");
const defCycleBtn = document.querySelector(".default");
const body = document.querySelector("body");
const clock = document.querySelector(".clock");
const editBtns = document.querySelector(".edit-buttons");
const breakBtns = document.querySelector(".buttons");
const pomodoroCont = document.querySelector(".pomodoro-list");
const clearPomodoroElemsBtn = document.querySelector(".clear-button");
const cycleAmount = document.querySelector(".cycle-amount");

// variables for duration
let sessionDuration = 25;
let breakDuration = 5;

// object for catching changes of clock's state
let change = {
  start_clicks: 0,
  long_clicks: 0,
  running_interval: null,
  colors: null,
  rejected_timer: false,
  running_cycle: 25,
  cycles_amount: 0,
  cycle_number: 0,
};

// functions of timer block
// function for timers

function timerClock(minutes, seconds = 1) {
  if (!change.start_clicks) {
    change.start_clicks = 1;
  }
  let clock = setInterval(() => {
    seconds--;
    if (seconds === 0) {
      if (minutes != 0) {
        minutes--;
        seconds = 59;
      } else {
        timer.innerText = "00:00";
        soundTimer();
        clearInterval(clock);
        change.start_clicks = 0;
        animationColor(
          "rgb(56, 88, 148)",
          "rgb(61, 106, 189)",
          "rgb(120, 159, 231)",
          "rgb(82, 132, 224)"
        );
        localStorage.removeItem("time");
        return;
      }
    }
    timer.innerText = `${minutes}:${seconds}`;
    if (minutes.toString().length < 2) {
      timer.innerText = `0${minutes}:${seconds}`;
    }
    if (seconds.toString().length < 2) {
      timer.innerText = `${minutes}:0${seconds}`;
    }
    if (minutes.toString().length < 2 && seconds.toString().length < 2) {
      timer.innerText = `0${minutes}:0${seconds}`;
    }

    if (localStorage.getItem("time")) {
      localStorage.removeItem("time");
      localStorage.setItem("time", timer.innerText);
    } else {
      localStorage.setItem("time", timer.innerText);
    }
  }, 1000);

  change.running_interval = clock;
}

// checking whether any timer is running already
function checkTimer(minutes, seconds = 1) {
  if (change.running_interval) {
    if (change.start_clicks) {
      let question = confirm(
        "Таймер все ещё запущен. Вы уверены, что хотите перейти к другому?"
      );
      if (question) {
        clearInterval(change.running_interval);
        change.rejected_timer = false;
        return timerClock(minutes, seconds);
      } else {
        change.rejected_timer = true;
      }
    } else {
      return timerClock(minutes, seconds);
    }
  } else {
    return timerClock(minutes, seconds);
  }
}

function defaultCycle() {
  checkTimer(change.running_cycle);
  if (change.running_cycle === sessionDuration) {
    breakTimer.innerText = `${breakDuration}:00`;
    // setting 'done' status to previous pomodoro elem
    let loop = document.querySelector("div[number]");
    // check whether loop was ended earlier
    if (loop) {
      let substr = loop.innerText.match(/завершен/gi);
      if (!substr) {
        let doneDate = new Date();
        let h = doneDate.getHours();
        let m = doneDate.getMinutes();
        if (h.toString().length < 2) {
          h = "0" + h;
        }
        if (m.toString().length < 2) {
          m = "0" + m;
        }
        loop.innerHTML += `, завершен в ${h}:${m}.`;
        document.querySelector(
          ".cycle-amount"
        ).innerText = `Общее количество завершенных циклов: ${change.cycles_amount}`;
      }
    }
    animationColor(
      "rgba(230, 45, 106, 0.692)",
      "rgba(173, 57, 96, 0.692)",
      "rgba(94, 4, 34, 0.692)",
      "rgba(70, 3, 25, 0.692)"
    );

    // putting loop element
    change.cycle_number++;
    let n = change.cycle_number;
    let pomodoroElem = document.createElement("div");
    pomodoroElem.classList.add("pomodoro-element");
    pomodoroElem.setAttribute("number", n);
    let date = new Date();
    let hours = date.getHours();
    let mins = date.getMinutes();
    if (hours.toString().length < 2) {
      hours = "0" + hours;
    }
    if (mins.toString().length < 2) {
      mins = "0" + mins;
    }
    pomodoroElem.innerText = `Цикл ${n}: запущен в ${hours}:${mins}`;
    pomodoroCont.prepend(pomodoroElem);
  } else {
    breakTimer.innerText = `${sessionDuration}:00`;
    animationColor(
      "rgba(0, 150, 50, 0.568)",
      "rgba(7, 207, 74, 0.568)",
      "rgba(4, 94, 34, 0.568)",
      "rgba(1, 48, 17, 0.568)"
    );
  }

  // adding loops to localStorage
  localStorage.removeItem("cycles");
  localStorage.setItem("cycles", JSON.stringify(pomodoroCont.innerHTML));
  localStorage.removeItem("cycles_amount");
  localStorage.removeItem("cycle_number");
  localStorage.setItem("cycles_amount", JSON.stringify(change.cycles_amount));
  localStorage.setItem("cycle_number", JSON.stringify(change.cycle_number));

  let checking = setInterval(() => {
    if (timer.innerText == "00:00") {
      if (change.running_cycle === sessionDuration) {
        change.running_cycle = breakDuration;
      } else {
        change.running_cycle = sessionDuration;
        change.cycles_amount++;
      }
      // adding ended loops to localStorage
      localStorage.removeItem("cycles");
      localStorage.setItem("cycles", JSON.stringify(pomodoroCont.innerHTML));
      localStorage.removeItem("cycles_amount");
      localStorage.removeItem("cycle_number");
      localStorage.setItem(
        "cycles_amount",
        JSON.stringify(change.cycles_amount)
      );
      localStorage.setItem("cycle_number", JSON.stringify(change.cycle_number));
      clearInterval(checking);
      return defaultCycle();
    }
  }, 100);
}

function stopTimer() {
  if (change.rejected_timer === false) {
    animationColor(
      "rgb(56, 88, 148)",
      "rgb(61, 106, 189)",
      "rgb(120, 159, 231)",
      "rgb(82, 132, 224)"
    );
  }
  // setting 'done' status to previous pomodoro elem
  let loop = document.querySelectorAll("div[number]");
  if (loop.length >= 1) {
    let substr = loop[0].innerText.match(/завершен/gi);
    if (!substr) {
      let doneDate = new Date();
      let h = doneDate.getHours();
      let m = doneDate.getMinutes();
      if (h.toString().length < 2) {
        h = "0" + h;
      }
      if (m.toString().length < 2) {
        m = "0" + m;
      }
      loop[0].innerHTML += `, завершен в ${h}:${m}.`;
      change.cycles_amount++;
      document.querySelector(
        ".cycle-amount"
      ).innerText = `Общее количество завершенных циклов: ${change.cycles_amount}`;
    }
  }

  localStorage.removeItem("cycles");
  localStorage.setItem("cycles", JSON.stringify(pomodoroCont.innerHTML));
  localStorage.removeItem("cycles_amount");
  localStorage.removeItem("cycle_number");
  localStorage.setItem("cycles_amount", JSON.stringify(change.cycles_amount));
  localStorage.setItem("cycle_number", JSON.stringify(change.cycle_number));
}

// events for settings buttons

chooseBreakShortBtn.addEventListener("click", () => {
  breakDuration = 5;
  if (!change.running_interval) {
    breakTimer.style.opacity = "0";
    setTimeout(() => {
      breakTimer.style.opacity = "1";
      breakTimer.innerText = "5:00";
    }, 500);
  }
});

chooseBreakLongBtn.addEventListener("click", () => {
  breakDuration = 10;
  if (!change.running_interval) {
    breakTimer.style.opacity = "0";
    setTimeout(() => {
      breakTimer.style.opacity = "1";
      breakTimer.innerText = "10:00";
    }, 500);
  }
});

chooseShortBtn.addEventListener("click", () => {
  sessionDuration = 25;
  change.running_cycle = sessionDuration;
  if (!change.running_interval) {
    timer.style.opacity = "0";
    setTimeout(() => {
      timer.style.opacity = "1";
      timer.innerText = "25:00";
    }, 500);
  }
});

chooseLongBtn.addEventListener("click", () => {
  sessionDuration = 50;
  change.running_cycle = sessionDuration;
  if (!change.running_interval) {
    timer.style.opacity = "0";
    setTimeout(() => {
      timer.style.opacity = "1";
      timer.innerText = "50:00";
    }, 500);
  }
});

// events for clock buttons
startBtn.addEventListener("click", () => checkTimer(sessionDuration));
shortBreakBtn.addEventListener("click", () => checkTimer(5));
longBreakBtn.addEventListener("click", () => checkTimer(10));

finishBtn.addEventListener("click", () => {
  clearInterval(change.running_interval);
  change.running_interval = null;
  localStorage.removeItem("time");
});

clearPomodoroElemsBtn.addEventListener("click", () => {
  if (localStorage.getItem("cycles")) {
    localStorage.removeItem("cycles");
  }
  let elem = document.querySelectorAll(".pomodoro-element");
  for (let i = 0; i < elem.length; i++) {
    pomodoroCont.removeChild(elem[i]);
  }
  cycleAmount.innerText = "Общее количество завершенных циклов:0";
  change.cycles_amount = 0;
  change.cycle_number = 0;

  localStorage.removeItem("cycles");
  localStorage.removeItem("cycles_amount");
  localStorage.removeItem("cycle_number");
});

defCycleBtn.addEventListener("click", defaultCycle);

// animated colors

function animationColor(colorBg, colorBtns, colorClock, colorTimer) {
  animatedBtns.forEach((elem) => {
    elem.classList.add("animated");
    elem.style.backgroundColor = colorBtns;
    elem.style.color = "black";
  });

  if (document.querySelectorAll(".default")[1]) {
    document.querySelectorAll(".default")[1].classList.add("animated");
    document.querySelectorAll(".default")[1].style.backgroundColor = colorBtns;
    document.querySelectorAll(".default")[1].style.color = "black";
  }

  let headings = document.querySelectorAll("h3");
  for (let i = 0; i < headings.length; i++) {
    headings[i].classList.add = "animated";
    headings[i].style.color = colorClock;
  }

  let pomodoroElems = document.querySelectorAll(".pomodoro-element");
  for (let i = 0; i < pomodoroElems.length; i++) {
    pomodoroElems[i].classList.add = "animated";
    pomodoroElems[i].style.color = colorClock;
  }

  clock.classList.add("animated");
  clock.style.backgroundColor = colorClock;
  clock.style.boxShadow = `0.5rem 0.5rem 0.5rem ${colorBtns}`;

  body.classList.add("animated");
  body.style.backgroundColor = colorBg;

  timer.classList.add("animated");
  timer.style.color = colorTimer;

  breakTimer.classList.add("animated");
  breakTimer.style.color = colorTimer;

  colors = arguments;

  if (!localStorage.getItem("colors")) {
    localStorage.setItem("colors", JSON.stringify(colors));
  } else {
    localStorage.removeItem("colors");
    localStorage.setItem("colors", JSON.stringify(colors));
  }
}

const animatedBtns = [
  chooseBreakShortBtn,
  chooseBreakLongBtn,
  chooseShortBtn,
  chooseLongBtn,
  shortBreakBtn,
  longBreakBtn,
  startBtn,
  finishBtn,
  defCycleBtn,
  clearPomodoroElemsBtn,
];

if (localStorage.getItem("colors")) {
  animationColor(...Object.values(JSON.parse(localStorage.getItem("colors"))));
}

startBtn.addEventListener("click", () => {
  if (change.rejected_timer === false)
    animationColor(
      "rgba(230, 45, 106, 0.692)",
      "rgba(173, 57, 96, 0.692)",
      "rgba(94, 4, 34, 0.692)",
      "rgba(70, 3, 25, 0.692)"
    );
});

finishBtn.addEventListener("click", stopTimer);

shortBreakBtn.addEventListener("click", () => {
  if (change.rejected_timer === false) {
    animationColor(
      "rgba(0, 150, 50, 0.568)",
      "rgba(7, 207, 74, 0.568)",
      "rgba(4, 94, 34, 0.568)",
      "rgba(1, 48, 17, 0.568)"
    );
  }
});

longBreakBtn.addEventListener("click", () => {
  if (change.rejected_timer === false) {
    animationColor(
      "rgba(0, 150, 50, 0.568)",
      "rgba(7, 207, 74, 0.568)",
      "rgba(4, 94, 34, 0.568)",
      "rgba(1, 48, 17, 0.568)"
    );
  }
});

// sounds
function soundClick() {
  let audio = new Audio();
  audio.src = "Sounds/btn.mp3";
  audio.autoplay = true;
}

function soundTimer() {
  let audio = new Audio();
  audio.src = "Sounds/time-is-up.mp3";
  audio.autoplay = true;
}

chooseBtns.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    soundClick();
  }
});

editBtns.addEventListener("click", soundClick);
breakBtns.addEventListener("click", soundClick);
defCycleBtn.addEventListener("click", soundClick);
clearPomodoroElemsBtn.addEventListener("click", soundClick);

// adding state of clock and list from localStorage to the page
if (localStorage.getItem("time")) {
  setTimeout(() => {
    timer.style.opacity = "1";
  }, 1300);
  if (timer.innerText !== "00:00") {
    window.addEventListener("load", () => {
      defCycleBtn.innerText = "Продолжить";
      timer.innerText = `${localStorage.getItem("time").split(":")[0]}:${
        localStorage.getItem("time").split(":")[1]
      }`;
      defCycleBtn.removeEventListener("click", defaultCycle);

      defCycleBtn.addEventListener("click", () => {
        defCycleBtn.innerText = "Запустить цикл";
        checkTimer(
          JSON.parse(+localStorage.getItem("time").split(":")[0]),
          JSON.parse(+localStorage.getItem("time").split(":")[1])
        );
        let check = setInterval(() => {
          if (timer.innerText === "00:00") {
            defCycleBtn.addEventListener("click", defaultCycle);
            stopTimer();
            clearInterval(check);
          }
          continueTimer.remove();
        }, 100);
      });
      defCycleBtn.before(continueTimer);
    });
  } else {
    localStorage.removeItem("time");
  }
} else {
  setTimeout(() => {
    timer.style.opacity = "1";
  }, 0);
}

if (localStorage.getItem("cycles")) {
  pomodoroCont.innerHTML = JSON.parse(localStorage.getItem("cycles"));
}
if (localStorage.getItem("cycles_amount")) {
  change.cycles_amount = JSON.parse(localStorage.getItem("cycles_amount"));
}
if (localStorage.getItem("cycle_number")) {
  change.cycle_number = JSON.parse(localStorage.getItem("cycle_number"));
}
