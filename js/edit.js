// script.js

const emailInput = document.getElementById("email");
const emailValidIcon = document.getElementById("email-valid-icon");

emailInput.addEventListener("input", function () {
  if (validateEmail(emailInput.value)) {
    emailValidIcon.style.display = "inline";
  } else {
    emailValidIcon.style.display = "none";
  }
});

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}

const passwordInput = document.getElementById("password");
const passwordValidIcon = document.getElementById("password-valid-icon");

passwordInput.addEventListener("input", function () {
  if (validatePassword(passwordInput.value)) {
    passwordValidIcon.style.display = "inline";
  } else {
    passwordValidIcon.style.display = "none";
  }
});

function validatePassword(password) {
  return password.length >= 6;
}

const form = document.getElementById("edit-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (
    validateEmail(emailInput.value) &&
    validatePassword(passwordInput.value)
  ) {
    alert("Form submitted successfully!");
  } else {
    alert("Please enter valid information.");
  }
});
