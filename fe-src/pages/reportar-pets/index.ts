import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class ReportarPets extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <header-el></header-el>
            <div class="container">
            </div>
            <div class="content">
              
              <h1 class="content__title">Mascotas perdidas cerca tuyo</h1>
              <div class="content__container-card-pets">

              </div>
            </div>
        `;
    //al container lo paso por la funcion headerNav
    //que lo que hacer es agregarle un hijo que es el nav

    let style = document.createElement("style");
    style.innerHTML = `

                    .content {
                      display: flex;
                      flex-direction: column;
                      margin-left: 20px;
                      margin-right: 20px;
                    }
                    
                    .content__container-card-pets{
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    }

                    @media (min-width: 768px) {
                      .content__container-card-pets {
                        flex-direction: row;
                        flex-wrap: wrap;
                        align-items: flex-start;
                        justify-content: space-between;
                      }
                    }

                    .content__title {
                      font-size: 56px;
                      font-weight: bold;
                    }

                    @media (min-width: 768px) {
                      .content__title {
                        text-align: center;
                      }
                    }
                    
                    .content__container {
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      
                    }
                    
                    .content__container__desciption {
                      font-size: 24px;
                      text-align: center;
                    }
                    
                    .button {
                      height: 00px;
                      width: 120px;
                      font-size: 18px;
                      font-weight: bold;
                      background-color: greenyellow;
                      border-radius: 15px;
                    }
                    
                  `;
    this.appendChild(style);

    this.addListeners();
  }

  addListeners() {
    const containerPet = document.querySelector(
      ".content__container-card-pets"
    );
    const arrayPetsCercanas = state.getState().petsPerdidasCercanas;

    //agrego las cards pets
    for (const pet of arrayPetsCercanas) {
      const newPet = document.createElement("div");
      //"id", "name", "location", "picURL"
      newPet.innerHTML = `
      <card-pet-el id="${pet.id}" name="${pet.name}" picURL="${pet.picURL}" info="${pet.description}" location="${pet.location}" ></card-pet-el>
      `;

      // const newPet = newCardPet(pet.id, pet.picURL, pet.name, pet.location);

      containerPet.appendChild(newPet);
    }
  }
}
customElements.define("reportar-pets-page", ReportarPets);
