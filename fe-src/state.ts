//const API_BASE_URL = "http://localhost:3000";

const API_BASE_URL = "https://app-mascotas-perdidas.herokuapp.com";

const state = {
  data: {
    //es un array de cardPet
    petsPerdidasCercanas: [],

    //es un array de pets perdidas de un determinado usuario
    misPetsPerdidas: [],

    //son los datos de geolocalizacion de una pet que se esta por cargar
    datosGeoLocCargaPet: "",

    //son los datos de una pet, para cargarlas en la parte del edit

    onePet: {
      id: "",
      name: "",
      type: "",
      description: "",
      picURL: "",
      lat: "",
      lng: "",
      lost: "",
      userId: "",
    },

    //el id de la pet a reportar
    petReportar: { id: "", name: "" },

    report: { exitoso: "", mensaje: "" },
  },

  listeners: [],

  init() {},

  //devuelve la data del ultimo state
  getState() {
    return this.data;
  },

  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },

  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    //cb de callback
    //cada vez que se modifica el state se ejecutan los cb suscriptos
    for (const cb of this.listeners) {
      cb();
    }
  },
  //nos devuelve las mascotas cercanas en un radio de cierta lat y lng
  petsCercanas(lat: number, lng: number, callback) {
    const currentState = this.getState();
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/pets/cercanas?lat=" + lat + "&lng=" + lng, {
      method: "GET",

      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((results) => {
        //a los resultados de las mascotas perdidas cercanas
        const mascotas = results;

        let arrayMascotas = [] as any;
        //Ahora itero y agrego todas las cards de las mascotas perdidas
        if (mascotas[0]) {
          for (const pet of mascotas) {
            const newPet = {
              id: pet.id,
              picURL: pet.picURL,
              name: pet.name,
              description: pet.description,
            };
            arrayMascotas.push(newPet);
          }

          currentState.petsPerdidasCercanas = arrayMascotas;

          state.setState(currentState);
          callback();
        } else {
          arrayMascotas[0] = null;
          currentState.petsPerdidasCercanas = arrayMascotas;

          state.setState(currentState);
          callback();
        }
      });
    });
  },

  //estos son los datos de la cardPet que se guardan, para usarlos
  //cuando alguien quiere reportar esa pet y clickea en el boton de reportar
  setPetReport(id: number, name: string, callback) {
    const currentState = this.getState();
    currentState.petReportar.id = id;
    currentState.petReportar.name = name;
    this.setState(currentState);
    callback();
  },

  reportarPet(idPet: number, name: string, tel: string, msj: string, callback) {
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/reports", {
      method: "POST",

      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        tel: tel,
        information: msj,
        petId: idPet,
      }),
    }).then((res) => {
      res.json().then((resultado) => {
        const dataState = this.getState();
        if (resultado.reportId) {
          dataState.report.exitoso = true;
          dataState.report.mensaje = "El report se cargo exitosamente";
          this.setState(dataState);
          callback();
        } else {
          dataState.report.exitoso = true;
          dataState.report.mensaje = resultado.error;
          this.setState(dataState);
          callback();
        }
      });
    });
  },

  //nos sirve para chequear que el usuario y contraseña sea correcto
  //tambien crea el token y lo guarda en el local storage
  iniciarSesionCrearToken(mail: string, password: string, callback) {
    fetch(API_BASE_URL + "/auth/token", {
      method: "post",
      //necesita este header para que funcione
      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify({
        mail: mail,
        password: password,
      }),
    }).then((res) => {
      res.json().then((resultado) => {
        if (resultado.respuesta) {
          //guardo el token en el local storage
          localStorage.setItem("Token", resultado.respuesta);

          console.log(localStorage.getItem("Token"));
          callback(resultado);
        } else {
          callback(resultado);
        }
      });
    });
  },

  //con este metodo voy a crear una cuenta con los datos pasados por parametro
  crearCuenta(mail: string, password: string, name: string, callback) {
    fetch(API_BASE_URL + "/auth", {
      method: "post",
      //necesita este header para que funcione
      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify({
        mail: mail,
        password: password,
        name: name,
      }),
    }).then((res) => {
      res.json().then((resultado) => {
        callback(resultado);
      });
    });
  },

  checkTokenValido(callback) {
    const token = "bearer " + localStorage.getItem("Token");
    fetch(API_BASE_URL + "/auth/token/check", {
      method: "GET",
      //necesita este header para que funcione
      headers: {
        Authorization: token,
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((resultado) => {
        //le paso el resultado al callback y ahi resuelvo
        callback(resultado);
      });
    });
  },

  misPets(callback) {
    const token = "bearer " + localStorage.getItem("Token");
    const currentState = this.getState();
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/me/pets", {
      method: "GET",

      headers: {
        Authorization: token,
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((results) => {
        //results son las mascotas perdidas del que tiene iniciada sesion
        const mascotas = results;

        let arrayMascotas = [] as any;
        //Ahora itero y agrego todas las cards de mis mascotas perdidas
        if (mascotas[0]) {
          for (const pet of mascotas) {
            const newPet = {
              id: pet.id,
              picURL: pet.picURL,
              name: pet.name,
            };
            arrayMascotas.push(newPet);
          }

          currentState.misPetsPerdidas = arrayMascotas;

          state.setState(currentState);
          callback();
        } else {
          arrayMascotas[0] = null;
          currentState.misPetsPerdidas = arrayMascotas;

          state.setState(currentState);
          callback();
        }
      });
    });
  },

  setDatosGeoLocCargaPet(objeto) {
    const currentState = this.getState();
    currentState.datosGeoLocCargaPet = objeto;
    this.setState(currentState);
  },

  cargarPet(
    name: string,
    type: string,
    description: string,
    pictureDataURL: string,
    lat: number,
    lng: number,
    lost: boolean,
    callback
  ) {
    const token = "bearer " + localStorage.getItem("Token");
    const currentState = this.getState();
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/pets", {
      method: "post",

      headers: {
        Authorization: token,
        "content-type": "application/json",
      },

      body: JSON.stringify({
        name,
        type,
        description,
        pictureDataURL,
        lat,
        lng,
        lost,
      }),
    }).then((res) => {
      res.json().then((result) => {
        callback(result);
      });
    });
  },

  getOnePet(idPet: number, callback) {
    const token = "bearer " + localStorage.getItem("Token");

    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/pets?idPet=" + idPet, {
      method: "GET",

      headers: {
        Authorization: token,
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((result) => {
        //result es una pet
        const pet = result;

        //Ahora itero y agrego todas las cards de mis mascotas perdidas
        if (pet) {
          const currentState = this.getState();

          currentState.onePet.id = pet.id;
          currentState.onePet.name = pet.name;
          currentState.onePet.type = pet.type;
          currentState.onePet.description = pet.description;
          currentState.onePet.picURL = pet.picURL;
          currentState.onePet.lat = pet.lat;
          currentState.onePet.lng = pet.lng;
          currentState.onePet.lost = pet.lost;
          currentState.onePet.userId = pet.userId;

          this.setState(currentState);
          callback();
        } else {
          const currentState = this.getState();

          currentState.onePet.id = "";
          currentState.onePet.name = "";
          currentState.onePet.type = "";
          currentState.onePet.description = "";
          currentState.onePet.picURL = "";
          currentState.onePet.lat = "";
          currentState.onePet.lng = "";
          currentState.onePet.lost = "";
          currentState.onePet.userId = "";

          this.setState(currentState);

          callback();
        }
      });
    });
  },

  editarPet(
    name: string,
    type: string,
    description: string,
    pictureDataURL,
    lat: number,
    lng: number,
    lost: boolean,
    petId: number,
    callback
  ) {
    const token = "bearer " + localStorage.getItem("Token");
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/pets", {
      method: "PATCH",
      headers: {
        Authorization: token,
        "content-type": "application/json",
      },

      body: JSON.stringify({
        name,
        type,
        description,
        pictureDataURL,
        lat,
        lng,
        lost,
        petId,
      }),
    }).then((res) => {
      res.json().then((result) => {
        callback(result);
      });
    });
  },

  misDatos(callback) {
    const token = "bearer " + localStorage.getItem("Token");
    fetch(API_BASE_URL + "/me", {
      method: "GET",
      //necesita este header para que funcione
      headers: {
        Authorization: token,
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((resultado) => {
        //le paso el resultado al callback y ahi resuelvo
        callback(resultado);
      });
    });
  },

  editarMisDatos(
    name: string,
    password: string,
    newPassword: string,
    callback
  ) {
    const token = "bearer " + localStorage.getItem("Token");
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/me", {
      method: "PATCH",
      headers: {
        Authorization: token,
        "content-type": "application/json",
      },

      body: JSON.stringify({
        name,
        password,
        newPassword,
      }),
    }).then((res) => {
      res.json().then((result) => {
        callback(result);
      });
    });
  },

  mailUser(id: number, callback) {
    const currentState = this.getState();
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/user-mail?id=" + id, {
      method: "GET",

      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((results) => {
        callback(results);
      });
    });
  },

  petDataReport(idPet: number, callback) {
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/pet-data-report?idPet=" + idPet, {
      method: "GET",

      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((results) => {
        callback(results.userId);
      });
    });
  },

  enviarMail(mailUser: string, texto: string, callback) {
    //si existe un email en el state va a hacer el fetch-post
    fetch(API_BASE_URL + "/reports/enviar-mail", {
      method: "POST",

      headers: {
        "content-type": "application/json",
      },

      body: JSON.stringify({
        mailUser,
        texto,
      }),
    }).then((res) => {
      res.json().then((result) => {
        console.log("resultado", result);

        callback(result);
      });
    });
  },
};

export { state };
