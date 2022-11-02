import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class IniciarSesion extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <header-el></header-el>
            <div class="contenedor-form">
                <h3 class="contenedor-form__titulo">Inicio de Sesión</h3>
                <form class="contenedor-form__form">
                    <div class="contenedor-form__fieldset">
                    <label class="contenedor-form__label" for="mail-input">MAIL</label>
                    <input
                        class="contenedor-form__input-text"
                        id="mail-input"
                        name="mail"
                        type="email"
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
                    <div class="contenedor-form__button-section">
                    <button class="button button-form">Enviar</button>
                    </div>
                </form>
            </div>
            <div class="contenedor-opciones">
                <div class="contenedor-opciones__button-section">
                    <button class="button button-crear-cuenta">Crear una cuenta</button>
                </div>
                <div class="contenedor-opciones__button-section">
                    <button class="button button-olvide-password">
                    Olvide mi contraseña
                    </button>
                </div>
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
                        height: 400px;
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
    const boton = document.querySelector(".button-form") as any;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;

      const mail = target.mail.value;
      const password = target.password.value;

      boton.style.visibility = "hidden";

      state.iniciarSesionCrearToken(mail, password, (respuesta) => {
        if (respuesta.error) {
          alert(respuesta.error);
          Router.go("/sign-in");
          boton.style.visibility = "visible";
        } else {
          Router.go("/");
        }
      });
    });

    const buttonCrearCuenta = document.querySelector(
      ".button-crear-cuenta"
    ) as any;

    buttonCrearCuenta.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/sign-up");
    });
  }
}
customElements.define("sign-in-page", IniciarSesion);
