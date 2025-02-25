"use strict";

const registerForm = document.getElementById("registerForm");
const inputFirstname = document.querySelector(".inputFirstname");
const inputLastname = document.querySelector(".inputLastname");
const inputEmail = document.querySelector(".inputEmail");
const inputPassword = document.querySelector(".inputPassword");
const registerBtn = document.getElementById("registerBtn");
const registerError = document.querySelector(".registerError");

// URL DEL SERVIDOR BACKEND

const API_URL = "http://localhost:3000/api";

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = inputFirstname.value;
  const lastName = inputLastname.value;
  const email = inputEmail.value;
  const password = inputPassword.value;

  try {
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await response.json();

    if (data.status == "error") {
      registerError.style.display = "block";
      registerError.innerHTML = data.message;
      return;
    }

    location.href = "/login.html";
  } catch (error) {
    console.log(error);
  }
});
