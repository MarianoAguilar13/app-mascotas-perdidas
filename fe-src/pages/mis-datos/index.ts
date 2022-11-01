import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class MisDatos extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    //primero valido el token para ver si hay alguna sesion iniciada,
    //sino se valida es porque no inicio sesion, entonces va a la pag sign-in
    state.checkTokenValido((respuesta) => {
      const idUser = respuesta.id;
      console.log("El id user es: ", idUser);

      if (respuesta.error) {
        alert(
          "No esta conectado a alguna cuenta, por favor inicie sesión para acceder a esta opción"
        );
        Router.go("/sign-in");
      } else {
        this.render();
      }
    });

    // this.render();
  }

  render() {
    this.innerHTML = `
      <header-el></header-el>
      <div class="contenedor-form">
        <h3 class="contenedor-form__titulo">Mis Datos</h3>
        <h3 class="contenedor-form__sub-titulo">si desea cambiar la contraseña ingrese la nueva contraseña y repitala, si solo desea cambiar el nombre, deje vacio nueva contraseña.</h3>
        <form class="contenedor-form__form">
            <div class="contenedor-form__fieldset">
            <label class="contenedor-form__label" for="name-input">NOMBRE</label>
            <input
                class="contenedor-form__input-text"
                id="name-input"
                name="name"
                type="name"
            />
            </div>
            <div class="contenedor-form__fieldset">
            <label class="contenedor-form__label" for="password-input"
                >CONTRASEÑA</label
            >
            <input
                class="contenedor-form__input-text"
                id="password-input"
                name="password"
                type="password"
            />
            </div>
            <div class="contenedor-form__fieldset">
            <label class="contenedor-form__label" for="new-password-input"
                >NUEVA CONTRASEÑA</label
            >
            <input
                class="contenedor-form__input-text"
                id="new-password-input"
                name="newPassword"
                type="password"
            />
            </div>
            <div class="contenedor-form__fieldset">
            <label class="contenedor-form__label" for="new-password-repetido-input"
                >REPETIR NUEVA CONTRASEÑA</label
            >
            <input
                class="contenedor-form__input-text"
                id="new-password-repetido-input"
                name="newPasswordRepetido"
                type="password"
            />
            </div>
            <div class="contenedor-form__button-section">
            <button class="button button-form">Enviar</button>
            </div>
        </form>
      </div>    
        `;
    //al container lo paso por la funcion headerNav
    //que lo que hacer es agregarle un hijo que es el nav

    const style = document.createElement("style");
    style.innerHTML = `
                   
                    body {
                      background-color: black;
                  }

                  .contenedor-form {
                      display: flex;
                      flex-direction: column;
                      padding: 82px 33px;
                      background-color: black;
                      color: white;
                      font-family: "Poppins", sans-serif;
                      justify-content: center;
                      align-items: center;
                      height: 700px;
                      font-weight: 400;
                  }
                  
                  .contenedor-form__titulo {
                      font-size: 32px;
                      margin: 0;
                      margin-bottom: 10px;
                      font-weight: 400;
                      font-family: "Montserrat", sans-serif;
                  }

                  .contenedor-form__sub-titulo{
                    font-size: 18px;
                    margin: 0;
                    margin-bottom: 10px;
                    font-weight: 400;
                    font-family: "Montserrat", sans-serif;
                    width: 310px;
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
                  
                  .button {
                      width: 100%;
                      height: 45px;
                      background-color: greenyellow;
                      border-radius: 4px;
                      color: black;
                      font-size: 16px;
                      margin-top: 60px;
                  }

                  .contenedor-opciones{
                      width: 100%;
                      display: flex;
                      flex-direction: column;
                      height: 140px;
                      justify-content: center;
                      align-items: center;
                      background-color: black;
                      
                  }
                  
                  .contenedor-opciones__button-section{
                      width: 310px;
                  }

                  @media (min-width: 769px) {
                      .contenedor-opciones__button-section {
                          width: 356px;
                      }
                  }

                  .button-crear-cuenta{
                      margin-top: 20px;
                  }

                  .button-olvide-password{
                      margin-top: 20px;
                  }        
                  `;
    this.appendChild(style);

    this.addListeners();
  }

  addListeners() {
    const form = document.querySelector(".contenedor-form__form") as any;
    const botonForm = document.querySelector(".button-form") as any;

    state.misDatos((datosUser) => {
      form.name.value = datosUser.name;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;

      const name = target.name.value;
      const password = target.password.value;
      const newPassword = target.newPassword.value;
      const newPasswordRepetido = target.newPasswordRepetido.value;

      botonForm.style.visibility = "hidden";

      if (newPassword == newPasswordRepetido) {
        state.editarMisDatos(name, password, newPassword, (respuesta) => {
          if (respuesta.error) {
            alert(respuesta.error);
            Router.go("/mis-datos");
            botonForm.style.visibility = "visible";
          } else {
            alert(respuesta.aviso);
            console.log("Nuevo nombre: ", respuesta.nuevoName);
            Router.go("/");
          }
        });
      } else {
        alert(
          "La nueva contraseña y la nueva contraseña repetida no coinciden"
        );
        Router.go("/mis-datos");
        botonForm.style.visibility = "visible";
      }
    });
  }
}
customElements.define("mis-datos-page", MisDatos);
