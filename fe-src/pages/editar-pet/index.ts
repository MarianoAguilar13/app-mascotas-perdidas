import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";
import { initMap } from "../cargar-pet-perdida/map-location";
const { Dropzone } = require("dropzone");

class EditarPet extends HTMLElement {
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
                    >Si la ubicación no desea cambiarla, no haga click en el mapa y no introduzca nada en el buscados. Escriba el nombre de la ciudad o barrio en el que quiera establecer 
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
                      height: 450px;
                      width: 100%;
                      padding: 15px;
                      background-color: red;
                    }

                    .profile-picture{
                      height: 300px;
                      width: 100%;
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
    //en cuanto se renderiza voy a obtener los datos
    //de la pet que se quiere editar
    const currentState = state.getState();
    const pet = currentState.onePet;

    const form = document.querySelector(".contenedor-form__form") as any;
    const img = document.querySelector(".profile-picture") as any;

    if (pet.name) {
      form.name.value = pet.name;
      form.tipoPet.value = pet.type;
      form.descripcion.value = pet.description;
      img.src = pet.picURL;
    }

    //seteo los datos de lng y lat en los datos para cargar la pet
    state.setDatosGeoLocCargaPet(pet.lat, pet.lng);

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
      //si cargo una imagen elimino de la vista del DOM la img para
      //que no se muestren las 2 al mismo tiempo
      img.style.display = "none";
      filePicture = file;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      //como tarda, hago al boton invisible para que no cliqueen varias veces
      const botonForm = document.querySelector(".button-form") as any;
      botonForm.style.visibility = "hidden";

      //dependiendo de que si la url ya existe o si tengo que enviar
      //la data de la img para crear la url
      let pictureDataURL;

      //si filePicture es null entonces la url sera la misma
      //sino es null va a tener la data uri, que luego se va
      //a guardar en cloudinary creando una url para la imagen
      if (filePicture) {
        pictureDataURL = filePicture.dataURL;
        console.log("data img: ", pictureDataURL.dataURL);
      } else {
        pictureDataURL = pet.picURL;
      }
      //tomo todos los datos de los inputs
      const target = e.target as any;

      const name = target.name.value;
      const type = target.tipoPet.value;
      const description = target.descripcion.value;
      const lost = true;

      //si hay algun valor en el input del buscador de mapbox, entonces
      //ahi voy a buscarme las coordenadas, sino significa que esta en las mismas coordenadas

      const stateGeoLoc = state.getState().datosGeoLocCargaPet;

      state.editarPet(
        name,
        type,
        description,
        pictureDataURL,
        stateGeoLoc.lat,
        stateGeoLoc.lng,
        lost,
        pet.id,
        (result) => {
          if (result.message) {
            alert(result.message);
            Router.go("/");
          } else {
            alert(result.error);
            Router.go("/editar-pet");
            botonForm.style.visibility = "visible";
          }
        }
      );
    });
  }
}
customElements.define("editar-pet-page", EditarPet);
