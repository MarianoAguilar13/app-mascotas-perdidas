import { Router } from "../node_modules/@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/reportar-pets", component: "reportar-pets-page" },
  { path: "/reportar-pet-elegida", component: "reportar-pet-elegida-page" },
  { path: "/sign-in", component: "sign-in-page" },
  { path: "/sign-up", component: "sign-up-page" },
  { path: "/cargar-pet-perdida", component: "cargar-pet-perdida-page" },
  { path: "/mis-pets-perdidas", component: "mis-pets-perdidas-page" },
  { path: "/mis-datos", component: "mis-datos-page" },
  { path: "/editar-pet", component: "editar-pet-page" },
]);
