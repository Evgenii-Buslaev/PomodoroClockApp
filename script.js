// getting needed nodes

const chooseBtns = document.querySelector(".choose-buttons");
const chooseShortBtn = document.querySelector(".short-choose");
const chooseLongBtn = document.querySelector(".long-choose");
const chooseBreakShortBtn = document.querySelector(".short-break-choose");
const chooseBreakLongBtn = document.querySelector(".long-break-choose");
const timer = document.querySelector(".timer");
const shortBreakBtn = document.querySelector(".short");
const longBreakBtn = document.querySelector(".long");
const startBtn = document.querySelector(".start");
const finishBtn = document.querySelector(".finish");
const defCycleBtn = document.querySelector(".default");
const body = document.querySelector("body");
const clock = document.querySelector(".clock");
const editBtns = document.querySelector(".edit-buttons");
const breakBtns = document.querySelector(".buttons");

// catching clicks
let obj = {
  start_clicks: 0,
  long_clicks: 0,
};

// variables for duration
let sessionDuration = 25;
let breakDuration = 5;

// catching running interval function
let runningInterval;
let soundTimeOut;

// catching colors
let colors;

// adding state of counting to local storage
if (localStorage.getItem("time")) {
  setTimeout(() => {
    timer.style.opacity = "1";
  }, 1300);
  if (timer.innerText !== "00:00") {
    window.addEventListener("load", () => {
      checkTimer(
        JSON.parse(+localStorage.getItem("time").split(":")[0]),
        JSON.parse(+localStorage.getItem("time").split(":")[1])
      );
    });
  } else {
    localStorage.clear();
  }
} else {
  setTimeout(() => {
    timer.style.opacity = "1";
  }, 0);
}

//function for timers
function timerClock(minutes, seconds = 1) {
  if (!obj.start_clicks) {
    obj.start_clicks = 1;
  }
  let clock = setInterval(() => {
    seconds--;
    if (seconds === 0) {
      if (minutes != 0) {
        minutes--;
        seconds = 59;
      } else {
        timer.innerText = "00:00";
        clearInterval(clock);
        localStorage.clear();
        obj.start_clicks = 0;
        animationColor(
          animatedBtns,
          "rgb(56, 88, 148)",
          "rgb(61, 106, 189)",
          "rgb(120, 159, 231)",
          "rgb(82, 132, 224)"
        );
        soundTimer();
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

    if (!localStorage.getItem("time")) {
      localStorage.setItem("time", timer.innerText);
    } else {
      localStorage.removeItem("time");
      localStorage.setItem("time", timer.innerText);
    }
  }, 1000);

  runningInterval = clock;
}

// checking whether any timer is running already
function checkTimer(minutes, seconds = 1) {
  if (runningInterval) {
    if (obj.start_clicks) {
      let question = confirm(
        "Таймер все ещё запущен. Вы уверены, что хотите перейти к другому?"
      );
      if (question) {
        clearTimeout(soundTimeOut);
        clearInterval(runningInterval);
        return timerClock(minutes, seconds);
      }
    } else {
      return timerClock(minutes, seconds);
    }
  } else {
    return timerClock(minutes, seconds);
  }
}

function defaultCycle() {
  checkTimer(sessionDuration);
  animationColor(
    animatedBtns,
    "rgba(230, 45, 106, 0.692)",
    "rgba(173, 57, 96, 0.692)",
    "rgba(94, 4, 34, 0.692)",
    "rgba(70, 3, 25, 0.692)"
  );
  let promise = new Promise(function (resolve) {
    let checking = setInterval(() => {
      if (timer.innerText === "00:00") {
        resolve();
        promise.then(checkTimer(5));
        animationColor(
          animatedBtns,
          "rgba(0, 150, 50, 0.568)",
          "rgba(7, 207, 74, 0.568)",
          "rgba(4, 94, 34, 0.568)",
          "rgba(1, 48, 17, 0.568)"
        );
        clearInterval(checking);
        setTimeout(() => {
          animationColor(
            animatedBtns,
            "rgb(56, 88, 148)",
            "rgb(61, 106, 189)",
            "rgb(120, 159, 231)",
            "rgb(82, 132, 224)"
          );
        }, 300000);
      }
    }, 100);
  });
}

// events for settings buttons
chooseBreakShortBtn.addEventListener("click", () => {
  breakDuration = 5;
});

chooseBreakShortBtn.addEventListener("click", () => {
  breakDuration = 10;
});

chooseShortBtn.addEventListener("click", () => {
  sessionDuration = 25;
  if (!runningInterval) {
    timer.style.opacity = "0";
    setTimeout(() => {
      timer.style.opacity = "1";
      timer.innerText = "25:00";
    }, 500);
  }
});

chooseLongBtn.addEventListener("click", () => {
  sessionDuration = 50;
  if (!runningInterval) {
    timer.style.opacity = "0";
    setTimeout(() => {
      timer.style.opacity = "1";
      timer.innerText = "50:00";
    }, 500);
  }
});

// events for clock buttons
startBtn.addEventListener("click", () => checkTimer(sessionDuration));
shortBreakBtn.addEventListener("click", () => checkTimer(breakDuration));
longBreakBtn.addEventListener("click", () => checkTimer(breakDuration));

finishBtn.addEventListener("click", () => {
  clearInterval(runningInterval);
  runningInterval = null;
  localStorage.clear();
});

defCycleBtn.addEventListener("click", defaultCycle);

// animated colors

function animationColor(colorBg, colorBtns, colorClock, colorTimer) {
  animatedBtns.forEach((elem) => {
    elem.classList.add("animated");
    elem.style.backgroundColor = colorBtns;
    elem.style.color = "black";
  });

  let headings = document.querySelectorAll("h3");
  for (let i = 0; i < headings.length; i++) {
    headings[i].classList.add = "animated";
    headings[i].style.color = colorClock;
  }

  clock.classList.add("animated");
  clock.style.backgroundColor = colorClock;
  clock.style.boxShadow = `0.5rem 0.5rem 0.5rem ${colorBtns}`;

  body.classList.add("animated");
  body.style.backgroundColor = colorBg;

  timer.classList.add("animated");
  timer.style.color = colorTimer;

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
];

if (localStorage.getItem("colors")) {
  animationColor(...Object.values(JSON.parse(localStorage.getItem("colors"))));
}

startBtn.addEventListener("click", () => {
  animationColor(
    "rgba(230, 45, 106, 0.692)",
    "rgba(173, 57, 96, 0.692)",
    "rgba(94, 4, 34, 0.692)",
    "rgba(70, 3, 25, 0.692)"
  );
});

finishBtn.addEventListener("click", () => {
  animationColor(
    "rgb(56, 88, 148)",
    "rgb(61, 106, 189)",
    "rgb(120, 159, 231)",
    "rgb(82, 132, 224)"
  );
});

shortBreakBtn.addEventListener("click", () => {
  animationColor(
    "rgba(0, 150, 50, 0.568)",
    "rgba(7, 207, 74, 0.568)",
    "rgba(4, 94, 34, 0.568)",
    "rgba(1, 48, 17, 0.568)"
  );
});

longBreakBtn.addEventListener("click", () => {
  animationColor(
    "rgba(0, 150, 50, 0.568)",
    "rgba(7, 207, 74, 0.568)",
    "rgba(4, 94, 34, 0.568)",
    "rgba(1, 48, 17, 0.568)"
  );
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
