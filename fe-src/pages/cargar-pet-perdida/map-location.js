import * as MapboxClient from "mapbox";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { state } from "../../state";

export function initMap() {
  mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
  const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);

  const inputSearch = document.querySelector(".contenedor-search__input");
  const botonSearch = document.querySelector(".button-search");

  function iniciarMap() {
    return new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-58.3857976, -34.6037388],
      zoom: 9,
    });
  }

  //aca es si busca mediante el buscador
  function initSearchForm(callback) {
    botonSearch.addEventListener("click", (e) => {
      e.preventDefault();

      if (inputSearch.value) {
        mapboxClient.geocodeForward(
          inputSearch.value,
          {
            country: "ar",
            autocomplete: true,
            language: "es",
          },
          function (err, data, res) {
            //una vez que se envio los datos del form, llama al callback con esos datos
            if (!err) callback(data.features);
          }
        );
      } else {
        alert("Por favor ingrese una ubicación");
      }
    });
  }

  window.map = iniciarMap();

  //si va clickeando el mapa va haciendo las markas y en el state
  //se guardan las coordenadas del ultimo click
  map.on("click", async (e) => {
    await new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;

    console.log("lat y lng de la marca con click: ", e.lngLat);

    state.setDatosGeoLocCargaPet(lat, lng);
  });

  //aca es si busca mediante el buscador
  initSearchForm(function (results) {
    const firstResult = results[0];

    new mapboxgl.Marker()
      .setLngLat(firstResult.geometry.coordinates)
      .addTo(map);

    const coordenadas = firstResult.geometry.coordinates;
    const lat = coordenadas[1];
    const lng = coordenadas[0];
    console.log(lat, lng);

    state.setDatosGeoLocCargaPet(lat, lng);

    if (inputSearch.value) {
      map.setCenter(firstResult.geometry.coordinates);
      map.setZoom(12);
    }
  });
}
