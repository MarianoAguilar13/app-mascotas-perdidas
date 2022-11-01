import { Router } from "../../node_modules/@vaadin/router";
import { state } from "../state";

export function init() {
  class CardMisPetsEl extends HTMLElement {
    //estos son los atributos que voy a estar obsevando su cambios
    static get observedAttributes() {
      return ["id", "name", "picURL"];
    }

    shadow = this.attachShadow({ mode: "open" });

    constructor() {
      // Always call super first in constructor
      super();
      this.render();
    }

    render() {
      this.shadow.innerHTML = `
      <div class="card-pet">
      <img
          class="card-pet__imagen"
          src=""
          alt="Imagen mascota"
      />
      <div class="card-pet__container">
          <div class="card-pet__container__info">
          <h4 class="card-pet__container__info__id"></h4>
          <h4 class="card-pet__container__info__name"></h4>
          </div>
          <button class="card-pet__container__button">
          EDITAR INFO
          </button>
      </div>
  </div>
    `;

      const style = document.createElement("style");

      style.innerHTML = `
    .card-pet {
        display: flex;
        flex-direction: column;
        max-height: 500px;
        width: 300px;
        border: 5px solid black;
        margin-bottom: 30px;
    }
    
    .card-pet__imagen {
      height: auto;
      max-height: 400px;
      width: 100%;
      border-bottom: 5px solid black;
    }
    
    .card-pet__container {
        display: flex;
        margin: 5%;
    }
    
    .card-pet__container__info {
        display: flex;
        flex-direction: column;
        width: 50%;
        justify-content: space-around;
    }
    
    .card-pet__container__info__id {
        display: none;
        font-size: 24px;
        font-weight: bold;
        margin: 0px;
        padding: 0px;
        text-align: left;
    }

    .card-pet__container__info__name {
        display: flex;
        font-size: 18px;
        font-weight: bold;
        margin: 0px;
        text-align: left;
    }
    
    .card-pet__container__info__location {
        display: flex;
        font-size: 18px;
        margin: 0px;
        text-align: left;
    }
    
    .card-pet__container__button {
        font-size: 14px;
        height: 60px;
        width: 50%;
        border-radius: 10px;
        border: 2px solid black;
        background-color: greenyellow;
    }
        `;

      //Ese display none, podria tener otro nombre describiendo a partir de que window size afecta. EL DE ARRIBA
      this.shadow.appendChild(style);
      //Escuchador de eventos
      this.addListeners();
    }

    addListeners() {
      // "id", "name", "location", "picURL"
      //guardo los elementos que voy a modificar con los atributos
      //pasdos por parametro
      const imagenEl = this.shadow.querySelector(".card-pet__imagen") as any;
      imagenEl.src = this.getAttribute("picURL");

      const idEl = this.shadow.querySelector(
        ".card-pet__container__info__id"
      ) as any;
      idEl.textContent = this.getAttribute("id");

      const nameEl = this.shadow.querySelector(
        ".card-pet__container__info__name"
      ) as any;
      nameEl.textContent = this.getAttribute("name");

      //cuando hacer click en el boton de la card va hacia la pag
      //donde completara el formulario para reportar
      const boton = this.shadow.querySelector(
        ".card-pet__container__button"
      ) as any;
      boton.addEventListener("click", (e) => {
        e.preventDefault();

        const idPet = parseInt(idEl.textContent);

        //me traigo los datos de la pet con ese id y se guardan
        //en la data del state onePet
        state.getOnePet(idPet, () => {
          Router.go("/editar-pet");
        });
      });
    }
  }

  customElements.define("card-mis-pets-el", CardMisPetsEl);
}
