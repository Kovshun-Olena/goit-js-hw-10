console.log("Timer");

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");
const startButton = document.querySelector("[data-start]");
const dateTimePicker = document.querySelector("#datetime-picker");

let userSelectedDate = null;
let timerId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  position: "below",
  
  onClose(selectedDates) {
      console.log(selectedDates[0]);
      const selectedDate = selectedDates[0];
      const now = new Date();
    
    if (selectedDate <= now) {
        startButton.disabled = true;

        iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        });
      
      userSelectedDate = null; // Скидаємо значення
      
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(dateTimePicker, options);

// Обробка натискання кнопки Start
startButton.addEventListener("click", () => {
  
  if (!userSelectedDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please select a valid date first',
      position: 'topRight',
    });
    return;
  }  
  
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      iziToast.success({
        title: 'Timer Finished',
        message: 'The countdown has ended!',
        position: 'topRight',
      });

      dateTimePicker.disabled = false;
      startButton.disabled = true;
      return;
    }

    const timeLeft = convertMs(diff);
    updateTimerUI(timeLeft);
  }, 1000);
});

// Оновлення інтерфейсу
function updateTimerUI({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Форматування з 0
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Перетворення мілісекунд у дні/години/хвилини/секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}
