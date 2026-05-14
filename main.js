let timerInterval;

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.add('hidden');
  });
  document.getElementById(viewId).classList.remove('hidden');
}

function startTimer() {
  const selectedTitleValue = document.getElementById("titleSelect").value;
  const countdownInput = document.getElementById("countdownInput");
  const countdownTimerValue = parseInt(countdownInput.value);

  if (!countdownTimerValue || countdownTimerValue <= 0) {
    alert("Please enter a valid countdown time in minutes.");
    return;
  }

  let titleText = "";
  if (selectedTitleValue === "Title1") {
    titleText = "Meeting starts in";
  } else if (selectedTitleValue === "Title2") {
    titleText = "Meeting resumes in";
  }

  document.getElementById('title_msg').textContent = titleText;
  
  const countToDate = new Date().getTime() + (countdownTimerValue * 60 * 1000);
  const initialMinutes = countdownTimerValue;

  switchView('timer-view');

  timerInterval = setInterval(() => {
    const currentDate = new Date().getTime();
    const timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000);

    if (timeBetweenDates <= 0) {
      clearInterval(timerInterval);
      finishTimer();
      return;
    }

    updateTimerDisplay(timeBetweenDates, initialMinutes);
  }, 250);
}

function updateTimerDisplay(time, initialMinutes) {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60);
  
  const allCards = document.querySelectorAll(".flip-card");
  
  // Color logic
  if (initialMinutes >= 5) {
    if (time <= 60) {
      allCards.forEach(card => {
        card.classList.remove("warning");
        card.classList.add("critical");
      });
    } else if (time <= 120) {
      allCards.forEach(card => {
        card.classList.add("warning");
        card.classList.remove("critical");
      });
    } else {
      allCards.forEach(card => {
        card.classList.remove("warning");
        card.classList.remove("critical");
      });
    }
  }

  // Update each digit using the optimized flip logic
  flip(document.querySelector("[data-minutes-tens]"), Math.floor(minutes / 10));
  flip(document.querySelector("[data-minutes-ones]"), minutes % 10);
  flip(document.querySelector("[data-seconds-tens]"), Math.floor(seconds / 10));
  flip(document.querySelector("[data-seconds-ones]"), seconds % 10);
}

function flip(flipCard, newNumber) {
  const topHalf = flipCard.querySelector(".top");
  const bottomHalf = flipCard.querySelector(".bottom");
  const topFlip = flipCard.querySelector(".top-flip");
  const bottomFlip = flipCard.querySelector(".bottom-flip");
  
  const startNumber = parseInt(topHalf.textContent);
  if (newNumber === startNumber) return;

  // Set numbers for animation
  topFlip.textContent = startNumber;
  bottomFlip.textContent = newNumber;

  // Trigger animation
  flipCard.classList.add("flipping");
  
  topFlip.onanimationend = () => {
    topHalf.textContent = newNumber;
    flipCard.classList.remove("flipping");
    bottomHalf.textContent = newNumber;
  };
}

function finishTimer() {
  switchView('finish-view');
}

function playAudio() {
  const audio = document.getElementById('finish-audio');
  audio.currentTime = 0;
  audio.play().catch(e => console.log("Audio playback failed:", e));
}

function resetApp() {
  clearInterval(timerInterval);
  const audio = document.getElementById('finish-audio');
  audio.pause();
  audio.currentTime = 0;
  
  // Reset timer digits to 0 and remove color classes
  document.querySelectorAll('.flip-card').forEach(card => {
    card.classList.remove('warning', 'critical');
    card.querySelectorAll('.top, .bottom').forEach(el => el.textContent = '0');
  });
  
  switchView('setup-view');
}
