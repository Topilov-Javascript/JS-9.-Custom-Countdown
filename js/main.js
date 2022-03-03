const inputContainer = document.getElementById('input-container')
const countdownForm = document.getElementById('countdownForm')
const dateEl = document.getElementById('date-picker')

const countdownEl = document.getElementById('countdown')
const countdownElTitle = document.getElementById('countdown-title')
const countdownBtn = document.getElementById('countdown-button')
const timeElements = document.querySelectorAll('span')

const completeEl = document.getElementById('complete')
const completeElInfo = document.getElementById('complete-info')
const completeBtn = document.getElementById('complete-button')

let countdownTitle = ''
let countdownDate = ''
let countdownValue = Date
let countdownActive
let savedCountdown

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

// Set Date Input Min With Today's Date
const today = new Date().toISOString().split('T')[0]
dateEl.setAttribute('min', today)

// Populate Countdown / Complete UI
function updateDOM () {
  countdownActive = setInterval(() => {
    //Get timestamp in locale
    var tDate = new Date()
    //Convert timestamp in GMT/UTC format
    var timeZone = tDate.getTimezoneOffset() / -60

    const now = new Date().getTime()
    const distance = countdownValue - now - timeZone * 60 * 60 * 1000

    const days = Math.floor(distance / day)
    const hours = Math.floor((distance % day) / hour)
    const minutes = Math.floor((distance % hour) / minute)
    const seconds = Math.floor((distance % minute) / second)

    // Hide Input
    inputContainer.hidden = true

    // If the countdown has ended, show complete
    if (distance <= 0) {
      countdownEl.hidden = true
      clearInterval(countdownActive)
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`
      completeEl.hidden = false
    } else {
      // Else, show the countdown in progress
      // Populate Countdown
      countdownElTitle.textContent = `${countdownTitle}`
      timeElements[0].textContent = `${days}`
      timeElements[1].textContent = `${hours}`
      timeElements[2].textContent = `${minutes}`
      timeElements[3].textContent = `${seconds}`
      // Hide Complete Element
      completeEl.hidden = true
      // Show Countdown
      countdownEl.hidden = false
    }
  }, second)
}

// Take Values from Form Input
function updateCountdown (e) {
  e.preventDefault()
  countdownTitle = e.srcElement[0].value
  countdownDate = e.srcElement[1].value
  
  // Check for valid date
  if (countdownDate === '') {
    alert('Please select a date for countdown')
  } else {
    savedCountdown = {
      title: countdownTitle,
      date: countdownDate
    }
    localStorage.setItem('countdown', JSON.stringify(savedCountdown))
    // Get number version of current Date, update DOM
    countdownValue = new Date(countdownDate).getTime()
    updateDOM()
  }
}

// Reset All Values
function reset () {
  // Hide Countdown
  countdownEl.hidden = true
  // Hide Complete Element
  completeEl.hidden = true
  // Show Input Container
  inputContainer.hidden = false
  // Stop the countdown
  clearInterval(countdownActive)
  // Reset Values
  countdownTitle = ''
  countdownDate = ''
  // Remove savedCountdown from localStorage
  localStorage.removeItem('countdown')
}

// Restore Previous Countdown from localStorage
function restorePreviousCountdown() {
  // Get Countdown from localStorage if available
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date
    countdownValue = new Date(countdownDate).getTime()
    updateDOM()
  }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown)
countdownBtn.addEventListener('click', reset)
completeBtn.addEventListener('click', reset)

// On Load, check localStorage
restorePreviousCountdown();
