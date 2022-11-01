import { Router } from "../../node_modules/@vaadin/router";

export const init = () => {
  class Header extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });
    constructor() {
      super();
      this.render();
    }
    render() {
      const style = document.createElement("style");

      this.shadow.innerHTML = `
    <div class="header">
      <div class="header__visible">
        <div class="header__visible__logo-container">
          <img
            class="header__visible__logo-container__logo"
            src="https://res.cloudinary.com/druokk1hc/image/upload/v1666023904/huella_iyr42s.png"
            alt="Icono mascotas"
          />
        </div>
        <div class="header__links">
          <a
            class="header__links__link"
            href="http://localhost:1234/mis-datos"
            target=""
            >Mis Datos</a
          >
          <a
            class="header__links__link"
            href="http://localhost:1234/mis-pets-perdidas"
            target=""
            >Mis mascotas perdidas</a
          >
          <a
            class="header__links__link"
            href="http://localhost:1234/cargar-pet-perdida"
            target=""
            >Reportar mascota</a
          >
          <a
            class="header__links__link cerrar-sesion"
            href="http://localhost:1234/"
            target=""
            >Cerrar sesión</a
          >
        </div>
        <div class="header__visible__boton-desplegar-container">
          <button class="header__visible__boton-desplegar">
            <div class="header__visible__boton-desplegar__barras"></div>
            <div class="header__visible__boton-desplegar__barras"></div>
            <div class="header__visible__boton-desplegar__barras"></div>
          </button>
        </div>
      </div>
      <div class="ventana-links">
        <button class="ventana-links__boton-cerrar">x</button>
        <a
          class="ventana-links__link link-uno"
          href="http://localhost:1234/mis-datos"
          target=""
          >Mis Datos</a
        >
        <a
          class="ventana-links__link link-dos"
          href="http://localhost:1234/mis-pets-perdidas"
          target=""
          >Mis mascotas perdidas</a
        >
        <a
          class="ventana-links__link link-tres"
          href="http://localhost:1234/cargar-pet-perdida"
          target=""
          >Reportar mascota</a
        >
        <a
          class="ventana-links__link link-cuatro cerrar-sesion-ventana"
          href="http://localhost:1234/"
          target=""
          >Cerrar sesion</a
        >
      </div>
  </div>
        `;

      style.innerHTML = `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .header__visible {
          background-color: rgb(54, 170, 216);
          display: flex;
          height: 150px;
          justify-content: space-between;
          flex-direction: row;
          font-family: "Poppins", sans-serif;
        }
        
        .header__visible__logo-container {
          display: flex;
          height: 140px;
          width: 50%;
          align-items: center;
        }
        
        .header__visible__logo-container__logo {
          color: black;
          max-width: 60px;
          margin-left: 40px;
        }
        
        @media (max-width: 768px) {
          .header__visible__logo-container__logo {
            font-size: 24px;
          }
        }
        
        .header__links {
          display: flex;
          height: 140px;
          width: 50%;
          text-decoration: none;
          align-items: center;
          justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
          .header__links {
            display: none;
          }
        }
        
        .header__links__link {
          font-size: 18px;
          text-decoration: none;
          color: black;
          margin-right: 40px;
          margin-left: 40px;
        }
        
        @media (max-width: 768px) {
          .header__links__link {
            display: none;
          }
        }
        
        .header__visible__boton-desplegar-container {
          display: flex;
          height: 140px;
          width: 50%;
          align-items: center;
          flex-direction: row;
          justify-content: flex-end;
          padding-right: 40px;
        }
        
        @media (min-width: 769px) {
          .header__visible__boton-desplegar-container {
            display: none;
          }
        }
        
        .header__visible__boton-desplegar {
          background-color: black;
          padding: 0;
        }
        
        @media (min-width: 769px) {
          .header__visible__boton-desplegar {
            display: none;
          }
        }
        
        .header__visible__boton-desplegar__barras {
          background-color: white;
          border: solid 2px black;
          width: 36px;
          height: 8px;
        }
        
        .ventana-links {
          display: none;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgb(54, 170, 216);
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          font-family: "Montserrat", sans-serif;
        }
        
        @media (min-width: 769px) {
          .ventana-links {
            display: none;
          }
        }
        
        .ventana-links__boton-cerrar {
          position: absolute;
          right: 0px;
          background-color: rgb(54, 170, 216);
          border: solid 2px black;
          font-size: 32px;
        }
        
        @media (min-width: 769px) {
          .ventana-links__boton-cerrar {
            position: absolute;
            display: none;
          }
        }
        
        .ventana-links__link {
          font-size: 32px;
          text-decoration: none;
          color: black;
        }
        
        .link-uno {
          text-decoration: none;
          margin-top: 100px;
        }

        .link-dos {
          text-decoration: none;
         
        }

        .link-tres {
          text-decoration: none;
          
        }
        
        .link-cuatro {
          text-decoration: none;
          margin-bottom: 100px;
        }
        
      `;
      //Ese display none, podria tener otro nombre describiendo a partir de que window size afecta. EL DE ARRIBA
      this.shadow.appendChild(style);
      //Escuchador de eventos
      this.addListeners();
    }

    addListeners() {
      //esto va a ir en todos las page para que funcione correctamente
      //el botno desplegable
      const icono = this.shadowRoot.querySelector(
        ".header__visible__logo-container__logo"
      );

      const botonAbreMenuEl = this.shadowRoot.querySelector(
        ".header__visible__boton-desplegar"
      );
      const botonCerrarMenuEl = this.shadowRoot.querySelector(
        ".ventana-links__boton-cerrar"
      );
      const menuEl = this.shadowRoot.querySelector(".ventana-links") as any;

      const cerrarSesion = this.shadowRoot.querySelector(".cerrar-sesion");

      const cerrarSesionVentana = this.shadowRoot.querySelector(
        ".cerrar-sesion-ventana"
      );

      if (botonAbreMenuEl && botonCerrarMenuEl) {
        botonAbreMenuEl.addEventListener("click", (e) => {
          e.preventDefault();
          menuEl.style.display = "flex";
        });

        botonCerrarMenuEl.addEventListener("click", (e) => {
          e.preventDefault();
          menuEl.style.display = "";
        });
      }

      icono.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/");
      });

      cerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("Token", "Hola");
        alert("Se ha cerrado sesión");
        Router.go("/");
      });

      cerrarSesionVentana.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("Token", "Hola");
        alert("Se ha cerrado sesión");
        Router.go("/");
      });
    }
  }
  customElements.define("header-el", Header);
};
