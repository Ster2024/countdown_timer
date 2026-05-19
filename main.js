(function(){ 'use strict';
  let timerId = null;

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

  // Improved timing: align updates to 250ms ticks using Date.now() and setTimeout to reduce drift
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }

  const tick = () => {
    const remainingMs = Math.max(0, countToDate - Date.now());
    const secondsRemaining = Math.max(0, Math.ceil(remainingMs / 1000));

    if (secondsRemaining <= 0) {
      updateTimerDisplay(0, initialMinutes);
      timerId = null;
      finishTimer();
      return;
    }

    updateTimerDisplay(secondsRemaining, initialMinutes);

    // Schedule next update aligned to the 250ms tick boundary
    const delay = 250 - (Date.now() % 250) || 250;
    timerId = setTimeout(tick, delay);
  };

  // Start the tick loop immediately
  tick();
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
  // Guard against missing elements
  if (!flipCard) return;
  const topHalf = flipCard.querySelector(".top");
  const bottomHalf = flipCard.querySelector(".bottom");
  const topFlip = flipCard.querySelector(".top-flip");
  const bottomFlip = flipCard.querySelector(".bottom-flip");
  if (!topHalf || !bottomHalf || !topFlip || !bottomFlip) return;
  
  const startNumber = parseInt(topHalf.textContent, 10) || 0;
  if (newNumber === startNumber) return;

  // If a flip is already in progress on this card, short-circuit to a safe final state
  if (flipCard.classList.contains('flipping')) {
    topHalf.textContent = String(newNumber);
    bottomHalf.textContent = String(newNumber);
    topFlip.textContent = String(newNumber);
    bottomFlip.textContent = String(newNumber);
    flipCard.classList.remove('flipping');
    return;
  }

  // Set numbers for animation
  topFlip.textContent = String(startNumber);
  bottomFlip.textContent = String(newNumber);

  // Trigger animation
  flipCard.classList.add("flipping");

  const onTopFlipEnd = (e) => {
    if (e.target !== topFlip) return;
    topHalf.textContent = String(newNumber);
    bottomHalf.textContent = String(newNumber);
    flipCard.classList.remove("flipping");
    topFlip.removeEventListener("animationend", onTopFlipEnd);
  };

  // Use once option where supported and also remove in handler for compatibility
  if (typeof topFlip.addEventListener === 'function') {
    try {
      topFlip.addEventListener("animationend", onTopFlipEnd, { once: true });
    } catch (e) {
      // older browsers may not support options object
      topFlip.addEventListener("animationend", onTopFlipEnd);
    }
  }
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
  if (timerId) { clearTimeout(timerId); timerId = null; }
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

// Bind UI events after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const beginBtn = document.getElementById('beginButton');
  if (beginBtn) beginBtn.addEventListener('click', startTimer);
  const playBtn = document.getElementById('playAudioButton');
  if (playBtn) playBtn.addEventListener('click', playAudio);
});

})(); // end module wrapper

