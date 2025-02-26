"use strict";

const feed = document.getElementById("feed");
const profileImage = document.querySelector(".profile_image");
const myProfile = document.querySelector(".profile_picture");
const welcomeText = document.querySelector(".welcomeText");
const logout = document.getElementById("logout");
const searchForm = document.getElementById("searchForm");
const inputSearch = document.getElementById("inputSearch");
const searchSection = document.getElementById("searchSection");
const loginError = document.querySelector("loginError");
const token = localStorage.getItem("access_token");
const userStored = JSON.parse(localStorage.getItem("user"));
const pictureContainer = document.querySelector(".pictureContainer");
const mainPicture = document.querySelector(".mainPicture");
const personalInfo = document.querySelector(".personalInfo");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const profileInfo = document.querySelector(".profileInfo");
const followingSection = document.getElementById("followingSection");
const following = document.querySelector(".following");
const followersSection = document.getElementById("followersSection");
const followers = document.querySelector(".followers");
const publicationsCount = document.querySelector(".publicationsCount");
const followBtn = document.querySelector(".followBtn");

// URL DEL SERVIDOR BACKEND

// const API_URL = "https://backend-social-network-aa5m.onrender.com/api";

// URL DEL SERVIDOR EN DESARROLLO

const API_URL = "http://localhost:3000/api";

if (token) {
  // OBTENER LOS USUARIOS QUE SIGUE EL USUARIO SELECCIONADO

  const getFollowing = async () => {
    try {
      const response = await fetch(
        `${API_URL}/follow/following/${userStored.userSelected._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      feed.style.display = "none";
      searchSection.style.display = "none";
      followersSection.style.display = "none";
      followingSection.style.display = "flex";

      let followed = new Array();

      if (data.myFollowing) {
        data.myFollowing.forEach((follow) => {
          followed.push(follow.followed);
        });
      }

      if (data.following) {
        data.following.forEach((user) => {
          const card = document.createElement("div");
          card.classList.add("card");
          const picture = document.createElement("img");
          picture.classList.add("card-img-top");
          picture.style.height = "250px";
          picture.style.objectFit = "contain";
          picture.setAttribute(
            "src",
            `${API_URL}/user/avatar/${user.followed.image}`
          );
          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          const linkProfile = document.createElement("a");
          linkProfile.classList.add("card-title");
          linkProfile.innerHTML = `${user.followed.firstName} ${user.followed.lastName}`;
          linkProfile.style.fontSize = "25px";
          linkProfile.style.textTransform = "capitalize";
          linkProfile.style.textDecoration = "none";
          linkProfile.style.cursor = "pointer";
          linkProfile.addEventListener("click", async () => {
            try {
              const response = await fetch(
                `${API_URL}/user/profile/${user.followed._id}`,
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const data = await response.json();

              localStorage.setItem("user", JSON.stringify(data));

              document.location.href = "/profile.html";
            } catch (error) {
              console.log(error);
            }
          });
          const cardEmail = document.createElement("p");
          cardEmail.classList.add("card-text");
          cardEmail.innerHTML = user.followed.email;
          const btnAdd = document.createElement("a");
          if (user.followed._id == data.myUser.id) {
            btnAdd.classList.add("btn", "btn-secondary");
            btnAdd.innerHTML = "That's You";
          } else if (!followed.includes(user.followed._id)) {
            btnAdd.classList.add("btn", "btn-primary");
            btnAdd.addEventListener("click", async () => {
              try {
                await fetch(`${API_URL}/follow/save`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify({ followed: user.followed._id }),
                });

                btnAdd.classList.add("btn", "btn-secondary");
                btnAdd.innerHTML = "Followed";
              } catch (error) {
                console.log(error);
              }
            });
            btnAdd.innerHTML = "Add";
          } else {
            btnAdd.classList.add("btn", "btn-secondary");
            btnAdd.innerHTML = "Followed";
          }

          cardBody.appendChild(linkProfile);
          cardBody.appendChild(cardEmail);
          cardBody.appendChild(btnAdd);

          card.appendChild(picture);
          card.appendChild(cardBody);
          followingSection.appendChild(card);
        });
      } else {
        const followingTitle = document.createElement("h2");
        followingTitle.classList.add("fs-1", "text-light", "fw-bold");
        followingTitle.innerHTML = data.message;
        followingSection.appendChild(followingTitle);
      }
    } catch (error) {
      console.log(error);
      followingSection.innerHTML = "Something went wrong";
    }
  };

  // OBTENER LOS USUARIOS QUE SIGUEN AL USUARIO SELECCIONADO

  const getFollowers = async () => {
    try {
      const response = await fetch(
        `${API_URL}/follow/followers/${userStored.userSelected._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      feed.style.display = "none";
      searchSection.style.display = "none";
      followingSection.style.display = "none";
      followersSection.style.display = "flex";

      let followed = new Array();

      if (data.myFollowing) {
        data.myFollowing.forEach((follow) => {
          followed.push(follow.followed);
        });
      }

      if (data.followers) {
        data.followers.forEach((user) => {
          const card = document.createElement("div");
          card.classList.add("card");
          const picture = document.createElement("img");
          picture.classList.add("card-img-top");
          picture.style.height = "250px";
          picture.style.objectFit = "contain";
          picture.setAttribute(
            "src",
            `${API_URL}/user/avatar/${user.user.image}`
          );
          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          const linkProfile = document.createElement("a");
          linkProfile.classList.add("card-title");
          linkProfile.innerHTML = `${user.user.firstName} ${user.user.lastName}`;
          linkProfile.style.fontSize = "25px";
          linkProfile.style.textTransform = "capitalize";
          linkProfile.style.textDecoration = "none";
          linkProfile.style.cursor = "pointer";
          linkProfile.addEventListener("click", async () => {
            try {
              const response = await fetch(
                `${API_URL}/user/profile/${user.user._id}`,
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const data = await response.json();

              localStorage.setItem("user", JSON.stringify(data));

              document.location.href = "/profile.html";
            } catch (error) {
              console.log(error);
            }
          });
          const cardEmail = document.createElement("p");
          cardEmail.classList.add("card-text");
          cardEmail.innerHTML = user.user.email;
          const btnAdd = document.createElement("a");
          if (user.user._id == data.myUser.id) {
            btnAdd.classList.add("btn", "btn-secondary");
            btnAdd.innerHTML = "That's You";
          } else if (!followed.includes(user.user._id)) {
            btnAdd.classList.add("btn", "btn-primary");
            btnAdd.addEventListener("click", async () => {
              try {
                await fetch(`${API_URL}/follow/save`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify({ followed: user.user._id }),
                });

                btnAdd.classList.add("btn", "btn-secondary");
                btnAdd.innerHTML = "Followed";
              } catch (error) {
                console.log(error);
              }
            });
            btnAdd.innerHTML = "Add";
          } else {
            btnAdd.classList.add("btn", "btn-secondary");
            btnAdd.innerHTML = "Followed";
          }

          cardBody.appendChild(linkProfile);
          cardBody.appendChild(cardEmail);
          cardBody.appendChild(btnAdd);

          card.appendChild(picture);
          card.appendChild(cardBody);
          followersSection.appendChild(card);
        });
      } else {
        const followersTitle = document.createElement("h2");
        followersTitle.classList.add("fs-1", "text-light", "fw-bold");
        followersTitle.innerHTML = data.message;
        followersSection.appendChild(followersTitle);
      }
    } catch (error) {
      console.log(error);
      followersSection.innerHTML = "Something went wrong";
    }
  };

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

      await response.json();

      widget.innerHTML = "Unfollow";
      widget.classList.replace("btn-primary", "btn-danger");
    } catch (error) {
      console.log(error);
    }
  };

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

      await response.json();

      widget.innerHTML = "Follow";
      widget.classList.replace("btn-danger", "btn-primary");
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENER LOS DATOS PERSONALES DEL USUARIO LOGEADO Y EL USUARIO SELECCIONADO

  const getPersonalData = async () => {
    try {
      // POBLAR EL TEXTO DE BIENVENIDA EN EL HEADER DEL NOMBRE DEL UUSUARIO LOGEADO

      welcomeText.innerHTML = `Welcome ${userStored.user.firstName}`;

      // SOLICITAR LA FOTO DE PERFIL AL BACKEND DEL USUARIO LOGEADO

      profileImage.setAttribute(
        "src",
        `${API_URL}/user/avatar/${userStored.user.image}`
      );

      // ESTABLECER ATRIBUTOS DE TITLE DEL LINK PARA EL PERFIL

      myProfile.setAttribute("title", `Perfil de ${userStored.user.firstName}`);

      // ESTABLECER LOS DATOS PERSONALES DEL USUARIO SELECCIONADO

      mainPicture.setAttribute(
        "src",
        `${API_URL}/user/avatar/${userStored.userSelected.image}`
      );

      firstname.innerHTML = userStored.userSelected.firstName;
      lastname.innerHTML = userStored.userSelected.lastName;

      // TRAER INFORMACION DE USUARIOS QUE SIGUE

      following.innerHTML = `Following ${userStored.following}`;
      following.addEventListener("click", () => {
        followingSection.innerHTML = "";
        getFollowing();
      });

      // TRAER INFORMACION DE SEGUIDORES QUE TIENE

      followers.innerHTML = `Followers ${userStored.followers}`;
      followers.addEventListener("click", () => {
        followersSection.innerHTML = "";
        getFollowers();
      });

      publicationsCount.innerHTML = `Publications ${userStored.publicationsCount}`;

      let followed = new Array();

      if (userStored.myFollowings) {
        userStored.myFollowings.forEach((user) => {
          followed.push(user.followed);
        });
      }

      // MOSTRAR EL BOTON DE FOLLOW SI NO SIGUES AL USUARIO Y UNFOLLOW SI LO SIGUES

      if (userStored.userSelected._id == userStored.user.id) {
        followBtn.style.display = "none";
      } else if (!followed.includes(userStored.userSelected._id)) {
        followBtn.innerHTML = "Follow";
        followBtn.classList.add("btn", "btn-primary", "fs-5");
        followBtn.addEventListener("click", async () => {
          if (followBtn.innerHTML == "Follow") {
            await follow(userStored.userSelected._id, followBtn);
          } else if (followBtn.innerHTML == "Unfollow") {
            await unfollow(userStored.userSelected._id, followBtn);
          }
        });
      } else {
        followBtn.innerHTML = "Unfollow";
        followBtn.classList.add("btn", "btn-danger", "fs-5");
        followBtn.addEventListener("click", async () => {
          if (followBtn.innerHTML == "Follow") {
            await follow(userStored.userSelected._id, followBtn);
          } else if (followBtn.innerHTML == "Unfollow") {
            await unfollow(userStored.userSelected._id, followBtn);
          }
        });
      }
    } catch (error) {
      // SI EL TOKEN EXPIRÓ REDIRECCIONA AL LOGIN

      document.location.href = "/login.html";
    }
  };

  // OBTENER LAS PUBLICACIONES DEL PERFIL DEL USUARIO SELECCIONADO

  const getFeed = async () => {
    try {
      // SOLICITAR AL SERVIDOR LAS PUBLICACIONES DEL USUARIO SELECCIONADO

      const response = await fetch(
        `${API_URL}/user/profile/${userStored.userSelected._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      const publications = data.publicationsList;

      if (publications.length > 0) {
        feed.style.display = "flex";
        searchSection.style.display = "none";
        followersSection.style.display = "none";
        followingSection.style.display = "none";

        publications.forEach((publication) => {
          const card = document.createElement("div");
          card.classList.add("card", "card-publication");
          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          const cardTitle = document.createElement("h3");
          cardTitle.classList.add("card-title");
          cardTitle.style.textTransform = "capitalize";
          const cardText = document.createElement("p");
          cardText.classList.add("card-text");

          cardTitle.innerHTML = `${publication.user.firstName} ${publication.user.lastName}`;
          cardText.innerHTML = publication.text;

          cardBody.appendChild(cardTitle);
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
        });
      } else {
        const title = document.createElement("h1");
        title.innerHTML = "The user doesn't have publications yet";
        title.classList.add("fs-1", "fw-bold", "text-light", "my-4");
        feed.appendChild(title);
      }
    } catch (error) {
      document.location.href = "/login.html";
    }
  };

  getPersonalData();

  if (feed) {
    getFeed();
  }

  // FUNCIONALIDAD DEL BUSCADOR

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const search = inputSearch.value;

    if (search) {
      try {
        const response = await fetch(`${API_URL}/user/search/${search}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        let followed = new Array();

        if (data.following.length > 0) {
          data.following.forEach((follow) => {
            followed.push(follow.followed);
          });
        }

        const usersList = data.users;

        feed.style.display = "none";

        feed.style.display = "none";
        followersSection.style.display = "none";
        followingSection.style.display = "none";
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
            linkProfile.addEventListener("click", async () => {
              try {
                const response = await fetch(
                  `${API_URL}/user/profile/${user._id}`,
                  {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                const data = await response.json();

                localStorage.setItem("user", JSON.stringify(data));

                document.location.href = "/profile.html";
              } catch (error) {
                console.log(error);
              }
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
                  await follow(user._id, btnAdd);
                } else if (btnAdd.innerHTML == "Unfollow") {
                  await unfollow(user._id, btnAdd);
                }
              });
            } else {
              btnAdd.innerHTML = "Unfollow";
              btnAdd.classList.add("btn", "btn-danger");
              btnAdd.addEventListener("click", async () => {
                if (btnAdd.innerHTML == "Follow") {
                  await follow(user._id, btnAdd);
                } else if (btnAdd.innerHTML == "Unfollow") {
                  await unfollow(user._id, btnAdd);
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
    }
  });

  // REDIRECCIONAR AL PERFIL DEL USUARIO LOGEADO

  myProfile.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));

      document.location.href = "/profile.html";
    } catch (error) {
      console.log(error);
    }
  });
} else {
  // SI EL TOKEN NO EXISTE REDIRECCIONAR AL LOGIN

  document.location.href = "/login.html";
}

// FUNCION PARA CERRAR SESION

logout.addEventListener("click", async () => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    document.location.href = "/login.html";
  } catch (error) {
    console.log(error);
  }
});
