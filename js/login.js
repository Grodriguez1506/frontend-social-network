"use strict";

const loginForm = document.getElementById("loginForm");
const inputEmail = document.querySelector(".inputEmail");
const inputPassword = document.querySelector(".inputPassword");
const loginBtn = document.getElementById("loginBtn");
const loginAlert = document.querySelector(".loginAlert");
const recoveryAlert = document.querySelector(".recoveryAlert");
const loading = document.querySelector(".loading");
const recoveryPassword = document.querySelector(".recoveryPassword");
const recoveryForm = document.getElementById("recoveryForm");
const backLogin = document.querySelector(".backLogin");
const recoveryInputEmail = document.querySelector(".recoveryInputEmail");
const recoveryInputPassword = document.querySelector(".recoveryInputPassword");

// URL DEL SERVIDOR BACKEND

const API_URL = "https://backend-social-network-yfst.onrender.com/api";

// URL DEL SERVIDOR EN DESARROLLO

// const API_URL = "http://localhost:3000/api";

recoveryPassword.addEventListener("click", () => {
  loginForm.style.display = "none";
  recoveryForm.style.display = "block";
  loginAlert.classList.remove("alert-danger", "alert-success");
  loginAlert.style.display = "none";
  inputEmail.value = "";
  inputPassword.value = "";
});

backLogin.addEventListener("click", () => {
  recoveryForm.style.display = "none";
  loginForm.style.display = "block";
  recoveryAlert.remove("alert-danger");
  recoveryAlert.style.display = "none";
  recoveryInputEmail.value = "";
  recoveryInputPassword.value = "";
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginAlert.style.display = "none";
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
      loginAlert.classList.add("alert-danger");
      loginAlert.style.display = "block";
      loginAlert.innerHTML = data.message;
      loading.style.display = "none";
      return;
    }

    localStorage.setItem("access_token", data.token);

    document.location.href = "/homepage.html";
  } catch (error) {
    console.log(error);
  }
});

recoveryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = recoveryInputEmail.value;
  const password = recoveryInputPassword.value;

  try {
    const response = await fetch(`${API_URL}/user/reset-password`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (data.status == "error") {
      recoveryAlert.style.display = "block";
      recoveryAlert.innerHTML = data.message;
      recoveryAlert.classList.add("alert-danger");
      return;
    }

    if (data.status == "success") {
      recoveryForm.style.display = "none";
      recoveryAlert.style.display = "none";
      loginForm.style.display = "block";
      loginAlert.style.display = "block";
      loginAlert.classList.add("alert-success");
      loginAlert.innerHTML = data.message;
      recoveryInputEmail.value = "";
      recoveryInputPassword.value = "";
    }
  } catch (error) {
    recoveryAlert.style.display = "block";
    recoveryAlert.innerHTML = error.message;
    recoveryAlert.classList.add("alert-danger");
  }
});
