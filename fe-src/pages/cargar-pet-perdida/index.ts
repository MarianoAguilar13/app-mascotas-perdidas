import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";
import { ObtenerLatLngLocation } from "./location";
const { Dropzone } = require("dropzone");

class CargarPetPerdida extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    state.checkTokenValido((respuesta) => {
      console.log("esta es la espuesta", respuesta);

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
              <h3 class="contenedor-form__titulo">Reportar mascota perdida</h3>
              <form class="contenedor-form__form">
                <div class="contenedor-form__fieldset">
                  <label class="contenedor-form__label" for="name-input">NOMBRE</label>
                  <input
                    class="contenedor-form__input-text"
                    id="name-input"
                    name="name"
                    type="text"
                  />
                </div>
                <div class="contenedor-form__fieldset">
                  <label class="contenedor-form__label" for="tipo-pet-input"
                    >TIPO DE MASCOTA</label
                  >
                  <input
                    class="contenedor-form__input-text"
                    id="tipo-pet-input"
                    name="tipoPet"
                    type="text"
                  />
                </div>
                <div class="picture-container">
                  <h2>Haz click en el fondo rojo para subir una foto</h2>
                  <img class="profile-picture" />
                </div>
                <div class="contenedor-form__fieldset">
                  <label class="contenedor-form__label" for="tipo-pet-input"
                    >DESCRIPCION</label
                  >
                  <textarea
                    name="descripcion"
                    class="contenedor-form__text-area"
                    cols="30"
                    rows="10"
                  ></textarea>
                </div>
                <div class="contenedor-form__container-location">
                  <p class="container-location__desciption">
                    Escriba la ciudad, barrio o monumento, en el cual quieres establecer
                    el punto centrar, para que las personas busquen en un radio al
                    rededor.
                  </p>

                  <input class="contenedor-form__input-text" name="q" type="search" />
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
                    .contenedor-form {
                      display: flex;
                      flex-direction: column;
                      padding: 82px 33px;
                      background-color: black;
                      color: white;
                      font-family: "Poppins", sans-serif;
                      justify-content: center;
                      align-items: center;
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
                      width: 310px;
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
                    
                    .contenedor-form__text-area {
                      width: 100%;
                      border: greenyellow 5px outset;
                      border-radius: 4px;
                    }
                    
                    .picture-container {
                      border: greenyellow 5px outset;
                      border-radius: 4px;
                      margin-top: 20px;
                      padding: 15px;
                      background-color: red;
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
                    
                    .contenedor-opciones {
                      width: 100%;
                      display: flex;
                      flex-direction: column;
                      height: 140px;
                      justify-content: center;
                      align-items: center;
                      background-color: black;
                    }
                    
                    .contenedor-opciones__button-section {
                      width: 310px;
                    }
                    
                    @media (min-width: 769px) {
                      .contenedor-opciones__button-section {
                        width: 356px;
                      }
                    }
                              
                  `;
    this.appendChild(style);

    this.addListeners();
  }

  addListeners() {
    const form = document.querySelector(".contenedor-form__form");
    //creo el dropzone
    Dropzone.autoDiscover = false;

    let filePicture;

    let myDropzone = new Dropzone(".picture-container", {
      url: "/falsa",
      autoProcessQueue: false,
    });

    //cuando agrego una nueva imagen la guardo en una variable filePicture
    myDropzone.on("addedfile", (file) => {
      console.log(`File added: ${file.name}`);
      filePicture = file;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      //como tarda, hago al boton invisible para que no cliqueen varias veces
      const botonForm = document.querySelector(".button-form") as any;
      botonForm.style.visibility = "hidden";

      //tomo todos los datos de los inputs
      const target = e.target as any;

      const location = target.q.value;
      const name = target.name.value;
      const type = target.tipoPet.value;
      const description = target.descripcion.value;
      const lost = true;

      //si existe filePicture entonces, primero verifico las coordenadas
      //de la location enviada por el input con ObtenerLatLngLocation,
      //guardo la lat, lng en el state para usarlos a continuacion
      //inicio la cargarPet metodo en el state, que carga una nueva
      //pet en la db, algolia y cloudinary
      if (filePicture) {
        if (location) {
          const pictureDataURL = filePicture.dataURL;
          //la funcion es async para que funcione todo correctamente,
          //sino algunas variables, se quieren usar antes de ser creadas
          ObtenerLatLngLocation(location).then((response) => {
            state.setDatosGeoLocCargaPet(response);

            const stateGeoLoc = state.getState().datosGeoLocCargaPet;

            state.cargarPet(
              name,
              type,
              description,
              pictureDataURL,
              stateGeoLoc.lat,
              stateGeoLoc.lng,
              lost,
              (result) => {
                if (result.petId) {
                  console.log("id pet: ", result.petId);

                  alert("Tu mascota se ha cargado correctamente");
                  Router.go("/");
                } else {
                  alert(result.error);
                  Router.go("/cargar-pet-perdida");
                  botonForm.style.visibility = "visible";
                }
              }
            );
          });
        } else {
          alert("Por favor ingrese una dirección, es obligatoria");
          Router.go("/cargar-pet-perdida");
          botonForm.style.visibility = "visible";
        }
      } else {
        alert("Por favor ingrese una foto de su mascota");
        Router.go("/cargar-pet-perdida");
        botonForm.style.visibility = "visible";
      }
    });
  }
}
customElements.define("cargar-pet-perdida-page", CargarPetPerdida);
