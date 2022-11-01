import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class MisPetsPerdidas extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    //primero valido el token para ver si hay alguna sesion iniciada,
    //sino se valida es porque no inicio sesion, entonces va a la pag sign-in
    state.checkTokenValido((respuesta) => {
      console.log("esta es la espuesta", respuesta);

      if (respuesta.error) {
        alert(
          "No esta conectado a alguna cuenta, por favor inicie sesión para acceder a esta opción"
        );
        Router.go("/sign-in");
      } else {
        //primero me tengo que traer las pets perdidas del usuario
        //y despues hacer el render, sino cuando quiero buscar en el state
        //no me renderiza las cards porque la llamada al back todavia no habia terminado
        state.misPets(() => {
          this.render();
        });
      }
    });
  }

  render() {
    this.innerHTML = `
            <header-el></header-el>
            <div class="container">
            </div>
            <div class="content">
              
              <h1 class="content__title">Mis mascotas perdidas</h1>
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

    const arrayMisPets = state.getState().misPetsPerdidas;

    //agrego las cards pets
    if (arrayMisPets[0]) {
      for (const pet of arrayMisPets) {
        const newPet = document.createElement("div");
        //"id", "name", "picURL"
        newPet.innerHTML = `
        <card-mis-pets-el id="${pet.id}" name="${pet.name}" picURL="${pet.picURL}" ></card-mis-pets-el>
        `;

        containerPet.appendChild(newPet);
      }
    }
  }
}
customElements.define("mis-pets-perdidas-page", MisPetsPerdidas);
