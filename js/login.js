"use strict";

const loginForm = document.getElementById("loginForm");
const inputEmail = document.querySelector(".inputEmail");
const inputPassword = document.querySelector(".inputPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.querySelector(".loginError");
const loading = document.querySelector(".loading");

// URL DEL SERVIDOR BACKEND

const API_URL = "https://backend-social-network-yfst.onrender.com/api";

// URL DEL SERVIDOR EN DESARROLLO

// const API_URL = "http://localhost:3000/api";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginError.style.display = "none";
  loading.style.display = "block";

  const email = inputEmail.value;
  const password = inputPassword.value;

  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.token) {
      loginError.style.display = "block";
      loginError.innerHTML = data.message;
      loading.style.display = "none";
      return;
    }

    localStorage.setItem("access_token", data.token);

    document.location.href = "/homepage.html";
  } catch (error) {
    console.log(error);
  }
});
