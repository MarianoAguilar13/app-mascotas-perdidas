export async function ObtenerLatLngLocation(centroBusqueda) {
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoibWFyaWFub3JhbGl1Z2ExMyIsImEiOiJjbDhodGJqZHYwaWo4M3dxcHV5cjUxaXZkIn0.HWomT8jl3x56PClLxd1Tlw";
  const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

  function initMap() {
    mapboxgl.accessToken = MAPBOX_TOKEN;
  }

  const datosGeoLoc = {};

  window.map = initMap();

  await mapboxClient.geocodeForward(
    centroBusqueda,
    {
      country: "ar",
      autocomplete: true,
      language: "es",
    },
    function (err, data, res) {
      //una vez que se envio los datos del form, llama al callback con esos datos
      if (!err) {
        centroBusqueda;
        const results = data.features;
        const firstResult = results[0];

        const coordenadas = firstResult.geometry.coordinates;
        const lat = coordenadas[1];
        const lng = coordenadas[0];

        datosGeoLoc.lat = lat;
        datosGeoLoc.lng = lng;
        datosGeoLoc.location = centroBusqueda;
      }
    }
  );

  return datosGeoLoc;
}
