import { Router } from "../../../node_modules/@vaadin/router";
import { headerNav } from "../../components/header";
import { state } from "../../state";
require("dotenv").config();

class Home extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <header-el></header-el>
            <div class="content">
             <h1 class="content__title">Mascotas perdidas cerca tuyo</h1>
             <div class="content__container">
                <p class="content__container__desciption">
                    Escriba la ciudad, barrio o monumento, en el cual quiere establecer
                     el radio de busqueda, luego de apretar en el boton buscar le 
                     apareceran las mascotas perdidas en las cercanias
                </p>
                <form class="search-form">
                  <input class="input" name="q" type="search" />
                  <button  class="button">Buscar</button>
                </form>
                <button  class="button button-mi-location">Buscar</button>
             </div>
            </div>
        `;

    let style = document.createElement("style");
    style.innerHTML = `
                    .container {
                       
                    }
                    
                    .content {
                      display: flex;
                      flex-direction: column;
                      margin-left: 20px;
                      margin-right: 20px;
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
                    
                    .input{
                      height: 40px;
                      width: 200px;
                      font-size: 18px;
                      font-weight: bold;
                      border-radius: 15px;
                    }

                    .button {
                      height: 40px;
                      width: 120px;
                      font-size: 18px;
                      font-weight: bold;
                      background-color: greenyellow;
                      border-radius: 15px;
                    }

                    .search-form{
                      display: none;
                    }
                    
                  `;
    this.appendChild(style);

    this.addListeners();
  }

  addListeners() {
    /*
    const MAPBOX_TOKEN =
      "pk.eyJ1IjoibWFyaWFub3JhbGl1Z2ExMyIsImEiOiJjbDhodGJqZHYwaWo4M3dxcHV5cjUxaXZkIn0.HWomT8jl3x56PClLxd1Tlw";
    const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

    function initMap() {
      mapboxgl.accessToken = MAPBOX_TOKEN;
    }

    function initSearchForm(callback) {
      const form = document.querySelector(".search-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        //es el lugar/ciudad que va en la card de la pet
        const location = e.target.q.value;
        mapboxClient.geocodeForward(
          e.target.q.value,
          {
            country: "ar",
            autocomplete: true,
            language: "es",
          },
          function (err, data, res) {
            console.log(data);
            //una vez que se envio los datos del form, llama al callback con esos datos
            if (!err) callback(data.features, location);
          }
        );
      });
    }

    window.map = initMap();
    //aca instancia el evento del form y le pasa el callback que se ejecutara
    //con los datos enviados de los resultados
    
    initSearchForm(function (results, location) {
      //toma el primer resultado de las palabras claves enviadas
      const firstResult = results[0];

      //luego me guardo las coordenadas y las intercambio de lugar
      //ya que tienen distinto indice en mapbox y algolia
      const coordenadas = firstResult.geometry.coordinates;
      const lat = coordenadas[1];
      const lng = coordenadas[0];

      //tengo que usar un callback para madar a la otra pag porque sino
      //el state en reportar-pets se ejecuta antes y no me trae las pets
      state.petsCercanas(lat, lng, location, () => {
        const actualData = state.getState();

        if (actualData.petsPerdidasCercanas[0]) {
          Router.go("/reportar-pets");
        } else {
          alert(
            "No se encontro ninguna mascota perdida en la ubicación que solicito, ingrese otra ubaicación para realizar una nueva busqueda"
          );
        }
      });
    });
    */
    const botonLocation = document.querySelector(".button-mi-location");

    navigator.geolocation.getCurrentPosition((geoLocationPosition) => {
      const lat = geoLocationPosition.coords.latitude;
      const lng = geoLocationPosition.coords.longitude;

      console.log("lat: ", lat + "... lng: ", lng);

      botonLocation.addEventListener("click", (e) => {
        e.preventDefault();

        //tengo que usar un callback para madar a la otra pag porque sino
        //el state en reportar-pets se ejecuta antes y no me trae las pets
        state.petsCercanas(lat, lng, () => {
          const actualData = state.getState();

          if (actualData.petsPerdidasCercanas[0]) {
            Router.go("/reportar-pets");
          } else {
            alert(
              "No se encontro ninguna mascota perdida en la ubicación que solicito, ingrese otra ubaicación para realizar una nueva busqueda"
            );
          }
        });
      });
    });
  }
}
customElements.define("home-page", Home);
