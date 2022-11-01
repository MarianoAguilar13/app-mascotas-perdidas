import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class ReportarPetElegida extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const dataState = state.getState();

    this.innerHTML = `
            <header-el></header-el>
            <div class="contenedor-form">
                <h3 class="contenedor-form__titulo">Reportar info de ${dataState.petReportar.name}</h3>
                <form class="contenedor-form__form">
                <div class="contenedor-form__fieldset">
                    <label class="contenedor-form__label" for="name-input">TU NOMBRE</label>
                    <input
                    class="contenedor-form__input-text"
                    id="name-input"
                    name="nombre"
                    type="text"
                    />
                </div>
                <div class="contenedor-form__fieldset">
                    <label class="contenedor-form__label" for="telefono-input">TU TELÉFONO</label>
                    <input
                    class="contenedor-form__input-text"
                    id="telefono-input"
                    name="telefono"
                    type="text"
                    />
                </div>
                <div class="contenedor-form__fieldset">
                    <label class="contenedor-form__label msj" for="message-input"
                    >DONDE LO VISTE?</label
                    >
                    <textarea
                    class="contenedor-form__textarea"
                    id="message-input"
                    name="msj"
                    ></textarea>
                </div>
                <div class="contenedor-form__button-section">
                    <button class="button">Enviar</button>
                </div>
                </form>
            </div>
        `;
    //al container lo paso por la funcion headerNav
    //que lo que hacer es agregarle un hijo que es el nav

    const style = document.createElement("style");
    style.innerHTML = `
                    .contenedor-form {
                        display: flex;
                        flex-direction: column;
                        padding: 82px 33px;
                        background-color: black;
                        color: white;
                        font-family: "Poppins", sans-serif;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-weight: 400;
                    }
                    
                    .contenedor-form__titulo {
                        font-size: 32px;
                        margin: 0;
                        margin-bottom: 10px;
                        font-weight: 400;
                        font-family: "Montserrat", sans-serif;
                    }

                    
                    .contenedor-form__form {
                        min-width: 310px;
                    }
                    
                    @media (min-width: 769px) {
                        .contenedor-form__form {
                        min-width: 356px;
                        }
                    }
                    
                    .contenedor-form__fieldset {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    @media (min-width: 769px) {
                        .contenedor-form {
                        align-self: flex-start;
                        }
                    }
                    
                    .contenedor-form__label {
                        font-size: 13px;
                        margin-top: 22px;
                        margin-bottom: 10px;
                    }
                    
                    .contenedor-form__input-text {
                        width: 100%;
                        height: 45px;
                        border: greenyellow 5px outset;
                        border-radius: 4px;
                    }
                    
                    .contenedor-form__textarea {
                        width: 100%;
                        height: 113px;
                        border: greenyellow 5px outset;
                        border-radius: 4px;
                    }
                    
                    .button {
                        width: 100%;
                        height: 45px;
                        background-color: greenyellow;
                        border-radius: 4px;
                        color: black;
                        font-size: 16px;
                        margin-top: 60px;
                    }
                                    
                  `;
    this.appendChild(style);

    this.addListeners();
  }

  addListeners() {
    const form = document.querySelector(".contenedor-form__form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;

      const ultimaDataState = state.getState();

      const idPet = ultimaDataState.petReportar.id;
      console.log("idPet", idPet);

      const name = target.nombre.value;
      const tel = target.telefono.value;
      const telCheck = parseInt(target.telefono.value, 10);
      const msj = target.msj.value;

      if (
        Number.isInteger(telCheck) &&
        tel.length >= 10 &&
        name.length > 0 &&
        msj.length > 0
      ) {
        state.reportarPet(idPet, name, tel, msj, () => {
          const actualData = state.getState();

          if (actualData.report.exitoso) {
            state.petDataReport(parseInt(idPet), (userId) => {
              state.mailUser(userId, (mailUser) => {
                console.log("mail: ", mailUser);

                const texto =
                  "Nombre de la persona que lo avisto: " +
                  name +
                  ".<br> Telefono de contacto: " +
                  tel +
                  ".<br> Mensaje: " +
                  msj;

                state.enviarMail(mailUser, texto, (respuesta) => {
                  if (respuesta.mensaje) {
                    alert("El mail se envio correctamente");
                  } else {
                    console.log("error: ", respuesta.message);

                    alert(
                      "Hubo un error al enviar el mail, intente nuevamente"
                    );
                  }
                });
              });
            });
            alert(actualData.report.mensaje);
            Router.go("/reportar-pets");
          } else {
            alert(actualData.report.mensaje);
          }
        });
      } else {
        alert(
          "No se pudo enviar su reporte, recuerde que debe poner un teléfono válido, un nombre y mensaje"
        );
      }
    });
  }
}
customElements.define("reportar-pet-elegida-page", ReportarPetElegida);
