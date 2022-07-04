const timer = document.querySelector(".timer");
const shortBreakBtn = document.querySelector(".short");
const longBreakBtn = document.querySelector(".long");
const startBtn = document.querySelector(".start");
const finishBtn = document.querySelector(".finish");
const defCycleBtn = document.querySelector(".default");

// catching clicks
let obj = {
  start_clicks: 0,
  long_clicks: 0,
};

// getting running interval function
let runningInterval;

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
  }, 1);

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
  let promise = new Promise(function (resolve) {
    let checking = setInterval(() => {
      if (timer.innerText === "00:00") {
        resolve();
        promise.then(checkTimer(5));
        clearInterval(checking);
      }
    }, 1);
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
