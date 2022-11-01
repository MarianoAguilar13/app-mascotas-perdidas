import { Router } from "../../node_modules/@vaadin/router";
import { state } from "../state";

export function init() {
  class CardPetEl extends HTMLElement {
    //estos son los atributos que voy a estar obsevando su cambios
    static get observedAttributes() {
      return ["id", "name", "location", "info", "picURL"];
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
          <div class="card-pet__container__info__sub-info">
            <h4 class="card-pet__container__info__id"></h4>
            <h4 class="card-pet__container__info__name"></h4>
            <h5 class="card-pet__container__info__location"></h5>
          </div>
          <button class="card-pet__container__button">
            REPORTAR INFORMACION
          </button>
        </div>
        <div class="card-pet__container__sub-container">
          <h4 class="card-pet__container__sub-container__desciption">
          </h4>
        </div>
      </div>
    </div>
    `;

      const style = document.createElement("style");

      style.innerHTML = `
      .card-pet {
        display: flex;
        flex-direction: column;
        max-height: 700px;
        width: 350px;
        border: 5px solid black;
        margin-bottom: 30px
      }
      
      .card-pet__imagen {
        height: auto;
        max-height: 400px;
        width: 100%;
        border-bottom: 5px solid black;
      }
      
      .card-pet__container {
        display: flex;
        flex-direction: column;
        margin: 5%;
      }
      
      .card-pet__container__info {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100px;
      }
      
      .card-pet__container__info__sub-info {
        display: flex;
        flex-direction: column;
        width: 50%;
        height: 100px;
        justify-content: space-around;
      }
      
      .card-pet__container__sub-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-top: 20px;
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
        font-size: 24px;
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
      
      .card-pet__container__sub-container__desciption {
        display: flex;
        font-size: 18px;
        margin: 0px;
        text-align: left;
        width: 100%;
      }
      
      .card-pet__container__button {
        font-size: 14px;
        height: 60px;
        width: 50%;
        border-radius: 10px;
        border: 2px solid black;
        background-color: greenyellow;
        width: 50%;
        align-self: center;
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

      const idEl = this.shadow.querySelector(".card-pet__container__info__id");
      idEl.textContent = this.getAttribute("id");

      const nameEl = this.shadow.querySelector(
        ".card-pet__container__info__name"
      );
      nameEl.textContent = this.getAttribute("name");

      const locationEl = this.shadow.querySelector(
        ".card-pet__container__info__location"
      );
      locationEl.textContent = this.getAttribute("location");

      const infoEl = this.shadow.querySelector(
        ".card-pet__container__sub-container__desciption"
      );
      infoEl.textContent = this.getAttribute("info");

      //cuando hacer click en el boton de la card va hacia la pag
      //donde completara el formulario para reportar
      const boton = this.shadow.querySelector(".card-pet__container__button");
      boton.addEventListener("click", (e) => {
        e.preventDefault();

        //seteo en el state el id de la pet que se quiere reportar
        state.setPetReport(
          parseInt(idEl.textContent),
          nameEl.textContent,
          () => {
            Router.go("/reportar-pet-elegida");
          }
        );
      });
    }
  }

  customElements.define("card-pet-el", CardPetEl);
}
