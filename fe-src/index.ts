import "./pages/home/index.js";
import "./pages/reportar-pets/index";
import "./pages/reportar-pet-elegida/index";
import "./pages/sign-in/index";
import "./pages/sign-up/index";
import "./pages/cargar-pet-perdida/index";
import "./pages/mis-pets-perdidas/index";
import "./pages/mis-datos/index";
import "./pages/editar-pet/index";
import "./router";
import { state } from "./state";

import { init as initHeaderEl } from "./components/header";
import { init as initCardPetEl } from "./components/card-pet";
import { init as initCardMisPetsEl } from "./components/card-mis-pets";

(function () {
  initCardPetEl();
  initHeaderEl();
  initCardMisPetsEl();

  state.init();
  if (localStorage.getItem("Token") == undefined) {
    localStorage.setItem("Token", "Hola");
  } else {
    /*
    localStorage.setItem("Token", "Hola");
    */
  }
})();
