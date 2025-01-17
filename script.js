const meetingMsg = sessionStorage.getItem('selectedTitle');

// Update the content of the <p> element
document.getElementById('title_msg').textContent = meetingMsg;

let timervalue = parseInt(sessionStorage.getItem("countdownTimer"));
if (Number.isNaN(timervalue)){
  timervalue = 1
}
const countToDate = new Date().setMinutes(new Date().getMinutes() + timervalue);

let previousTimeBetweenDates;
const intervalId = setInterval(() => {
  const currentDate = new Date();
  const timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000);
  if (timeBetweenDates < 0) {
    clearInterval(intervalId);
    window.location.href = "end.html";
    return;
  }
  flipAllCards(timeBetweenDates);
  previousTimeBetweenDates = timeBetweenDates;
}, 250);

function flipAllCards(time) {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60) % 60;
  flip(document.querySelector("[data-minutes-tens]"), Math.floor(minutes / 10));
  flip(document.querySelector("[data-minutes-ones]"), minutes % 10);
  flip(document.querySelector("[data-seconds-tens]"), Math.floor(seconds / 10));
  flip(document.querySelector("[data-seconds-ones]"), seconds % 10);
}

function flip(flipCard, newNumber) {
  const topHalf = flipCard.querySelector(".top");
  const startNumber = parseInt(topHalf.textContent);
  if (newNumber === startNumber) return;

  const bottomHalf = flipCard.querySelector(".bottom");
  const topFlip = document.createElement("div");
  topFlip.classList.add("top-flip");
  const bottomFlip = document.createElement("div");
  bottomFlip.classList.add("bottom-flip");

  top.textContent = startNumber;
  bottomHalf.textContent = startNumber;
  topFlip.textContent = startNumber;
  bottomFlip.textContent = newNumber;

  topFlip.addEventListener("animationstart", e => {
    topHalf.textContent = newNumber;
  });
  topFlip.addEventListener("animationend", e => {
    topFlip.remove();
  });
  bottomFlip.addEventListener("animationend", e => {
    bottomHalf.textContent = newNumber;
    bottomFlip.remove();
  });
  flipCard.append(topFlip, bottomFlip);
}
