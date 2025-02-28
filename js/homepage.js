"use strict";

const feed = document.getElementById("feed");
const profileImage = document.querySelector(".profile_image");
const myProfile = document.querySelector(".profile_picture");
const welcomeText = document.querySelector(".welcomeText");
const logoutBtn = document.getElementById("logout");
const publicationForm = document.getElementById("publicationForm");
const inputText = document.querySelector(".inputText");
const inputFile = document.querySelector(".inputFile");
const publicationError = document.querySelector(".publicationError");
const publicationSuccess = document.querySelector(".publicationSuccess");
const searchForm = document.getElementById("searchForm");
const inputSearch = document.getElementById("inputSearch");
const searchSection = document.getElementById("searchSection");
const loginError = document.querySelector("loginError");

// URL DEL SERVIDOR BACKEND

// const API_URL = "https://backend-social-network-yfst.onrender.com/api";

// URL DEL SERVIDOR EN DESARROLLO

const API_URL = "http://localhost:3000/api";

var token = localStorage.getItem("access_token");

const refreshToken = async () => {
  const response = await fetch(`${API_URL}/user/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();
  if (data.status === "success") {
    // ESTABLECER EL NUEVO ACCESS TOKEN EN EL LOCAL STORAGE
    localStorage.setItem("access_token", data.token);
    // MODIFICAR LA VARIABLE TOKEN CON EL NUEVO ACCESS TOKEN
    token = localStorage.getItem("access_token");

    return data.status;
  }
  return data.status;
};

if (token) {
  // FUNCION PARA SEGUIR A UN USUARIO

  const follow = async (id, widget) => {
    try {
      const response = await fetch(`${API_URL}/follow/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ followed: id }),
      });

      if (response.status === 401) {
        let refresh = await refreshToken();
        if (refresh === "success") {
          return follow(id, widget);
        }
      }

      widget.classList.replace("btn-primary", "btn-danger");
      widget.innerHTML = "Unfollow";
    } catch (error) {
      console.log(error);
    }
  };

  // FUNCION PARA DEJAR DE SEGUIR A UN USUARIO

  const unfollow = async (id, widget) => {
    try {
      const response = await fetch(`${API_URL}/follow/unfollow`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ unfollow: id }),
      });

      if (response.status === 401) {
        let refresh = await refreshToken();
        if (refresh === "success") {
          return unfollow(id, widget);
        }
      }

      widget.classList.replace("btn-danger", "btn-primary");
      widget.innerHTML = "Follow";
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENER LAS PUBLICACIONES DE LOS USUARIOS QUE SIGUES

  const getFeed = async () => {
    try {
      // SOLICITAR AL SERVIDOR LAS PUBLICACIONES DE LOS USUARIOS QUE SIGO

      const response = await fetch(`${API_URL}/user/feed`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        let refresh = await refreshToken();
        if (refresh === "success") {
          return getFeed();
        }
      }

      const data = await response.json();

      const publications = data.publications;

      const user = data.user;

      // POBLAR EL TEXTO DE BIENVENIDA EN EL HEADER DEL NOMBRE DEL UUSUARIO LOGEADO

      welcomeText.innerHTML = `Welcome ${user.firstName}`;

      // SOLICITAR LA FOTO DE PERFIL DEL USUARIO LOGEADO AL BACKEND

      profileImage.setAttribute("src", `${API_URL}/user/avatar/${user.image}`);

      // ESTABLECER ATRIBUTOS DE TITLE DEL LINK PARA EL PERFIL

      myProfile.setAttribute("title", `Perfil de ${user.firstName}`);

      // LISTAR LAS PUBLICACIONES DE LOS USUARIOS QUE SIGUES

      if (publications) {
        publications.forEach((publication) => {
          const card = document.createElement("div");
          card.classList.add("card", "card-publication");
          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          const cardTitle = document.createElement("h3");
          const linkProfile = document.createElement("a");
          linkProfile.classList.add("link-profile");
          cardTitle.classList.add("card-title");
          const cardText = document.createElement("p");
          cardText.classList.add("card-text");

          cardTitle.innerHTML = `${publication.user.firstName} ${publication.user.lastName}`;
          cardText.innerHTML = publication.text;

          linkProfile.appendChild(cardTitle);
          cardBody.appendChild(linkProfile);
          cardBody.appendChild(cardText);
          if (publication.file) {
            const picture = document.createElement("img");
            picture.setAttribute(
              "src",
              `${API_URL}/publication/media/${publication.file}`
            );
            picture.classList.add("card-img-top", "card-publication-img");
            card.appendChild(picture);
          }
          card.appendChild(cardBody);

          feed.append(card);

          linkProfile.addEventListener("click", async () => {
            try {
              const response = await fetch(
                `${API_URL}/user/profile/${publication.user._id}`,
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (response.status === 401) {
                let refresh = await refreshToken();
                if (refresh === "success") {
                  return getFeed();
                }
              }

              const data = await response.json();

              localStorage.setItem("user", JSON.stringify(data));

              document.location.href = "/profile.html";
            } catch (error) {
              console.log(error);
            }
          });
        });
      } else {
        const title = document.createElement("h1");
        title.innerHTML = "There aren't publications to show you";
        title.classList.add("fs-1", "fw-bold", "text-light", "my-4");
        feed.appendChild(title);
      }
    } catch (error) {
      document.location.href = "/login.html";
    }
  };

  if (feed) {
    getFeed();
  }

  // FUNCION PARA HACER UN POST

  const makePost = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/publication/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        let refresh = await refreshToken();
        if (refresh === "success") {
          return makePost(formData);
        }
      }

      const data = await response.json();

      if (data.status == "success") {
        inputText.value = "";
        inputFile.value = "";

        publicationSuccess.style.display = "block";
        publicationSuccess.innerHTML = data.message;
      } else {
        inputText.value = "";
        inputFile.value = "";

        publicationError.style.display = "block";
        publicationError.innerHTML = data.message;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FORMULARIO PARA HACER UN POST

  if (publicationForm) {
    publicationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const text = inputText.value;
      const file = inputFile.files[0];

      const formData = new FormData();

      formData.append("text", text);
      formData.append("publication", file);

      makePost(formData);
    });
  }

  // FUNCION DE BUSCAR

  const searchFunction = async (search) => {
    try {
      const response = await fetch(`${API_URL}/user/search/${search}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        let refresh = await refreshToken();
        if (refresh === "success") {
          return searchFunction(search);
        }
      }

      const data = await response.json();

      let followed = new Array();

      if (data.following.length > 0) {
        data.following.forEach((follow) => {
          followed.push(follow.followed);
        });
      }

      const usersList = data.users;

      feed.style.display = "none";
      searchSection.style.display = "flex";

      if (usersList.length > 0) {
        searchSection.innerHTML = "";

        usersList.forEach((user) => {
          const card = document.createElement("div");
          card.classList.add("card");
          const picture = document.createElement("img");
          picture.classList.add("card-img-top");
          picture.style.height = "250px";
          picture.style.objectFit = "contain";
          picture.setAttribute("src", `${API_URL}/user/avatar/${user.image}`);
          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          const linkProfile = document.createElement("a");
          linkProfile.classList.add("card-title");
          linkProfile.innerHTML = `${user.firstName} ${user.lastName}`;
          linkProfile.style.fontSize = "25px";
          linkProfile.style.textTransform = "capitalize";
          linkProfile.style.textDecoration = "none";
          linkProfile.style.cursor = "pointer";
          const redirectUserSelected = async (id) => {
            try {
              const response = await fetch(`${API_URL}/user/profile/${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (response.status === 401) {
                let refresh = await refreshToken();
                if (refresh === "success") {
                  return redirectUserSelected(id);
                }
              }

              const data = await response.json();

              localStorage.setItem("user", JSON.stringify(data));

              document.location.href = "/profile.html";
            } catch (error) {
              console.log(error);
            }
          };
          linkProfile.addEventListener("click", () => {
            redirectUserSelected(user._id);
          });
          const cardEmail = document.createElement("p");
          cardEmail.classList.add("card-text");
          cardEmail.innerHTML = user.email;
          const btnAdd = document.createElement("a");
          if (!followed.includes(user._id)) {
            btnAdd.innerHTML = "Follow";
            btnAdd.classList.add("btn", "btn-primary");
            btnAdd.addEventListener("click", async () => {
              if (btnAdd.innerHTML == "Follow") {
                follow(user._id, btnAdd);
              } else if (btnAdd.innerHTML == "Unfollow") {
                unfollow(user._id, btnAdd);
              }
            });
          } else {
            btnAdd.innerHTML = "Unfollow";
            btnAdd.classList.add("btn", "btn-danger");
            btnAdd.addEventListener("click", async () => {
              if (btnAdd.innerHTML == "Follow") {
                follow(user._id, btnAdd);
              } else if (btnAdd.innerHTML == "Unfollow") {
                unfollow(user._id, btnAdd);
              }
            });
          }

          cardBody.appendChild(linkProfile);
          cardBody.appendChild(cardEmail);
          cardBody.appendChild(btnAdd);

          card.appendChild(picture);
          card.appendChild(cardBody);

          searchSection.appendChild(card);
        });
      } else {
        searchSection.innerHTML = "";

        const title = document.createElement("h1");
        title.innerHTML = "Users not found";
        title.classList.add("fs-1", "fw-bold", "text-light", "my-4");
        searchSection.appendChild(title);
      }
    } catch (error) {
      document.location.href = "/login.html";
    }
  };

  // FUNCIONALIDAD PARA EL BUSCADOR

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const search = inputSearch.value;

    if (search) {
      searchFunction(search);
    }
  });

  // FUNCION PARA REDIRECCIONAR AL PERFIL DEL USUARIO LOGEADO

  const redirectLogedUser = async () => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        let refresh = await refreshToken();
        if (refresh === "success") {
          return redirectLogedUser();
        }
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));

      document.location.href = "/profile.html";
    } catch (error) {
      console.log(error);
    }
  };

  // ACCION PARA REDIRECCIONAR AL PERFIL DEL USUARIO LOGEADO

  myProfile.addEventListener("click", redirectLogedUser);
} else {
  // SI EL TOKEN NO EXISTE REDIRECCIONAR AL LOGIN

  document.location.href = "/login.html";
}

// FUNCION PARA CERRAR SESION

const logout = async () => {
  try {
    await fetch(`${API_URL}/user/logout`);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    document.location.href = "/login.html";
  } catch (error) {
    console.log(error);
  }
};

// ACCION PARA CERRAR SESION

logoutBtn.addEventListener("click", logout);
