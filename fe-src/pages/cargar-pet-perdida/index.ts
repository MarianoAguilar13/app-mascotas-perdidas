import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";
import { initMap } from "./map-location";

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
                <div class="contenedor-search__fieldset">
                    <label class="contenedor-search__label" for="q"
                    >Escriba el nombre de la ciudad o barrio en el que quiera establecer 
                    el radio de busqueda de su mascota, luego puede hacer una marca
                    con el click del mouse y la ultima marca que realize se guardara 
                    como la ubicación en donde se perdío.</label>
                    <input name="q" type="search" id="q" class="contenedor-search__input" />
                </div>
                <button class="button button-search" >Buscar</button>
                <div id="map-container" style="width: 100%; height: 310px;" > 
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
                      margin-top: 30px;
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

                    .contenedor-form__button-section{
                      width: 310px;
                    }

                    @media (min-width: 769px) {
                      .contenedor-form__button-section{
                        width: 356px;
                      }
                    }
                    
                    @media (min-width: 769px) {
                      .contenedor-opciones__button-section {
                        width: 356px;
                      }
                    }

                    #map-container{
                      margin-top: 20px;
                      display: flex;
                      flex-direction: column;
                    }
                    
                    .contenedor-search__fieldset{
                      width: 310px;
                      display: flex;
                      flex-direction: column;
                    }

                    @media (min-width: 769px) {
                      .contenedor-search__fieldset{
                        width: 356px;
                      }
                    }
                    
                    .contenedor-search__label{
                      font-size: 13px;
                      margin-top: 22px;
                      margin-bottom: 10px;
                    }

                    .contenedor-search__input{
                      width: 100%;
                      height: 45px;
                      border: greenyellow 5px outset;
                      border-radius: 4px;
                    }
                        
                    .button-search{
                      margin-top:5px;
                    }
                  `;
    this.appendChild(style);

    this.addListeners();
    this.renderMapbox();
  }

  renderMapbox() {
    initMap();
  }

  addListeners() {
    const form = document.querySelector(".contenedor-form__form") as any;
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
      const target = e.target;

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
        const pictureDataURL = filePicture.dataURL;

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
      } else {
        alert("Por favor ingrese una foto de su mascota");
        Router.go("/cargar-pet-perdida");
        botonForm.style.visibility = "visible";
      }
    });
  }
}
customElements.define("cargar-pet-perdida-page", CargarPetPerdida);
