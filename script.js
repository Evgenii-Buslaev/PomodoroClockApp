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

// getting running interval function
let runningInterval;
let soundTimeOut;

//function for timers
function timerClock(minutes) {
  if (!obj.start_clicks) {
    obj.start_clicks = 1;
  }
  let seconds = 1;
  let clock = setInterval(() => {
    seconds--;
    if (seconds === 0) {
      if (minutes != 0) {
        minutes--;
        seconds = 59;
      } else {
        timer.innerText = "00:00";
        clearInterval(clock);
        obj.start_clicks = 0;
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
  }, 1000);
  setTimeout(soundTimer, minutes * 60 * 1000);
  soundTimeOut = setTimeout(() => {
    animationColor(
      animatedBtns,
      "rgb(56, 88, 148)",
      "rgb(61, 106, 189)",
      "rgb(120, 159, 231)",
      "rgb(82, 132, 224)"
    );
  }, minutes * 60 * 1000);

  runningInterval = clock;
}

// checking whether any timer is running already
function checkTimer(minutes) {
  if (runningInterval) {
    if (obj.start_clicks) {
      let question = confirm(
        "Таймер все ещё запущен. Вы уверены, что хотите перейти к другому?"
      );
      if (question) {
        clearTimeout(soundTimeOut);
        clearInterval(runningInterval);
        return timerClock(minutes);
      }
    } else {
      return timerClock(minutes);
    }
  } else {
    timerClock(minutes);
  }
}

function defaultCycle() {
  checkTimer(25);
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
      if (timer.innerText === "00:03") {
        soundTimer();
      }
    }, 100);
  });
}

// events for buttons
startBtn.addEventListener("click", () => checkTimer(25));
shortBreakBtn.addEventListener("click", () => checkTimer(5));
longBreakBtn.addEventListener("click", () => checkTimer(10));

finishBtn.addEventListener("click", () => {
  clearInterval(runningInterval);
  runningInterval = null;
});

defCycleBtn.addEventListener("click", defaultCycle);

// animations

function animationColor(array, colorBg, colorBtns, colorClock, colorTimer) {
  array.forEach((elem) => {
    elem.classList.add("animated");
    elem.style.backgroundColor = colorBtns;
    elem.style.color = "black";
  });
  clock.classList.add("animated");
  clock.style.backgroundColor = colorClock;
  clock.style.boxShadow = `0.5rem 0.5rem 0.5rem ${colorBtns}`;

  body.classList.add("animated");
  body.style.backgroundColor = colorBg;

  timer.classList.add("animated");
  timer.style.color = colorTimer;
}

const animatedBtns = [
  shortBreakBtn,
  longBreakBtn,
  startBtn,
  finishBtn,
  defCycleBtn,
];

startBtn.addEventListener("click", () => {
  animationColor(
    animatedBtns,
    "rgba(230, 45, 106, 0.692)",
    "rgba(173, 57, 96, 0.692)",
    "rgba(94, 4, 34, 0.692)",
    "rgba(70, 3, 25, 0.692)"
  );
});

finishBtn.addEventListener("click", () => {
  animationColor(
    animatedBtns,
    "rgb(56, 88, 148)",
    "rgb(61, 106, 189)",
    "rgb(120, 159, 231)",
    "rgb(82, 132, 224)"
  );
});

shortBreakBtn.addEventListener("click", () => {
  animationColor(
    animatedBtns,
    "rgba(0, 150, 50, 0.568)",
    "rgba(7, 207, 74, 0.568)",
    "rgba(4, 94, 34, 0.568)",
    "rgba(1, 48, 17, 0.568)"
  );
});

longBreakBtn.addEventListener("click", () => {
  animationColor(
    animatedBtns,
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

editBtns.addEventListener("click", soundClick);
breakBtns.addEventListener("click", soundClick);
defCycleBtn.addEventListener("click", soundClick);
