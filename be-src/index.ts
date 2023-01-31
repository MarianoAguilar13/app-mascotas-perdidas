import * as express from "../node_modules/express";
import * as cors from "../node_modules/cors";
import * as path from "path";
import { dataMe, petsMe, dataUserMail } from "./controllers/users-controllers";
import {
  createAuthUser,
  createToken,
  validarToken,
  changePass,
  changeName,
  meAuth,
} from "./controllers/auth-controllers";
import {
  crearPublicacionPet,
  editarPublicacionPet,
  petsCercanas,
  getPet,
} from "./controllers/pets-controllers";
import { crearReport, enviarMail } from "./controllers/reports-controllers";
import { Report, User } from "./db";
/*
import { sequelize } from "./db/conection";

sequelize.sync({ alter: true }).then(() => {
  console.log("Se sincronizo la DB");
});*/

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("dist"));

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(cors());

//con el auth verifico si existe un users con el mail y si existe envio el id
//signup
app.post("/auth", async (req, res) => {
  // const mail == req.body.mail ==> {mail}
  const { mail, name, password } = req.body;

  if (mail && name && password.length >= 8) {
    const respuesta = await createAuthUser(mail, name, password);
    res.json(respuesta);
  } else {
    res.json({
      error:
        "Algunos de los siguientes campos tienen errores: El nombre no fue caragado y/o password(deber tener al menos 8 digitos)",
    });
  }
});

//signin
//aca vamos a crear un token el cual se guardara en el locastorage
//o y lo va a utilizar para autenticarse cuando ingresa el usuario y contraseña.
// Luego ese token va a tener info escondida que nos va a servir para validar otros endpoints
app.post("/auth/token", async (req, res) => {
  const { mail, password } = req.body;

  if (mail && password) {
    const respuesta = await createToken(mail, password);

    if (respuesta) {
      res.json({
        respuesta,
      });
    } else {
      res.status(400).json({ error: "mail o pass incorrecto" });
    }
  } else {
    res.json({
      error: "Faltan datos, mail y/o password, no fueron cargados",
    });
  }
});

//authorization bearer "el token que se genero"
//el split nos permite separar el bearer del token, nos da un array
//con los 2 strings y el token esta en la posicion 1
async function authMiddleware(req, res, next) {
  //sino existe el headers authorization, tira error 401
  if (req.headers.authorization) {
    //decodifica la encriptacion del jwt con verify y si es

    const responseToken = await validarToken(req.headers.authorization);

    if (responseToken) {
      req._user = responseToken;
      next();
    } else {
      res.status(401).json({
        error: "No se autorizo el token",
      });
    }
  } else {
    res.status(401).json({
      error: "No se envio el token mediante el headers authorization",
    });
  }
}

//chequea si el token es valido o no
app.get("/auth/token/check", authMiddleware, async (req, res) => {
  const id = req._user.id;

  res.json({ id });
});
//acordarse que va con el header authorization, y como valor va
// bearer "token.... skijflafjajgña"
app.get("/me", authMiddleware, async (req, res) => {
  const id = req._user.id;

  const user = await dataMe(id);
  res.json(user);
});

app.get("/me/auth", authMiddleware, async (req, res) => {
  const id = req._user.id;

  const auth = await meAuth(id);
  res.json(auth);
});

//con este patch voy a cambiar la contraseña
app.patch("/me", authMiddleware, async (req, res) => {
  const { name, password, newPassword } = req.body;
  const id = req._user.id;

  //si newPassword esta vacio o tiene menos de 8 caracteres no se cambia
  if (newPassword == "") {
    if (name == "") {
      res.json({
        error:
          "El nombre esta vacio y no se guardara, la nueva contraseña es demasiado corta y no se guardará",
      });
    } else {
      //si el nombre no esta vacio entonces lo cambia
      const newPerfil = await changeName(id, name, password);
      if (newPerfil) {
        res.json({
          nuevoName: newPerfil.get("name"),
          aviso: "Se cambio sólo el nombre",
        });
      } else {
        res.json({ error: "La contraseña ingresada es incorrecta" });
      }
    }
  }
  //si la contraseña nueva es valida entonces se cambia
  else {
    //si el name esta vacio solo cambio la contraseña y sino ambas
    if (name == "") {
      const respuesta = await changePass(id, password, newPassword);
      if (respuesta) {
        res.json({ aviso: "Se cambio sólo la contraseña con exito" });
      } else {
        res.json({ error: "La contraseña ingresada es incorrecta" });
      }
    }
    //si se cambian el passwor y el name al mismo tiempo
    else {
      const newPerfil = await changeName(id, name, password);

      const respuesta = await changePass(id, password, newPassword);

      if (newPerfil && respuesta) {
        res.json({
          nuevoName: newPerfil.get("name"),
          aviso: "La contraseña y el nombre se cambiaron correctamente",
        });
      } else {
        res.json({ error: "La contraseña ingresada es incorrecta" });
      }
    }
  }
});

app.post("/pets", authMiddleware, async (req, res) => {
  const id = req._user.id;
  const { name, type, description, lat, lng, lost } = req.body;

  //pictureDataURL esta dentro del body, pero no se extrae en una
  //variable porque es un string muy largo
  if (name && type && description && req.body && lat && lng && lost && id) {
    const respuesta = await crearPublicacionPet(
      name,
      type,
      description,
      req.body,
      lat,
      lng,
      lost,
      id
    );

    //si la respuesta existe envio al front el id de la publicacion de la pet
    if (respuesta) {
      res.json({
        petId: respuesta.get("id"),
      });
    } else {
      //sino algo ocurrio con la dataImagen
      res.json({
        error:
          "Los datos de la imagen no se pudieron procesar, intente nuevamente",
      });
    }
  } else {
    res.json({ error: "Falto ingresar datos obligatorios" });
  }
});

//me trae una sola pet, con el id indicado
app.get("/pets", authMiddleware, async (req, res) => {
  const id = req._user.id;
  const idPet = req.query.idPet;

  if (id) {
    const onePet = await getPet(idPet);
    if (onePet) {
      res.json(onePet);
    } else {
      res.json({ error: "No existe a la mascota que quiso acceder" });
    }
  } else {
    res.json({ error: "No existís o no esta autorizado" });
  }
});

app.get("/me/pets", authMiddleware, async (req, res) => {
  const id = req._user.id;

  if (id) {
    const allPets = await petsMe(id);
    if (allPets) {
      res.json(allPets);
    } else {
      res.json({ error: "El usuario no ha publicado pets por el momento" });
    }
  } else {
    res.json({ error: "No existís o no esta autorizado" });
  }
});

app.patch("/pets", authMiddleware, async (req, res) => {
  const userId = req._user.id;
  const { name, type, description, lat, lng, lost, petId } = req.body;

  //pictureDataURL esta dentro del body, pero no se extrae en una
  //variable porque es un string muy largo
  if (
    name &&
    type &&
    description &&
    req.body &&
    lat &&
    lng &&
    lost &&
    userId &&
    petId
  ) {
    const respuesta = await editarPublicacionPet(
      name,
      type,
      description,
      req.body,
      lat,
      lng,
      lost,
      petId,
      userId
    );

    //si la respuesta existe envio al front el id de la publicacion de la pet
    if (respuesta) {
      res.json({
        message: "Se modificó correctamente la publicación",
      });
    } else {
      //sino algo ocurrio con la dataImagen
      res.json({
        error:
          "Los datos de la imagen no se pudieron procesar, intente nuevamente",
      });
    }
  } else {
    res.json({ error: "Falto ingresar datos obligatorios" });
  }
});

app.post("/reports", async (req, res) => {
  const { name, tel, information, petId } = req.body;

  if (name && tel && information && petId) {
    const newReport = await crearReport(name, tel, information, petId);

    res.json({ reportId: newReport.get("id") });
  } else {
    res.json({ error: "No se ingresaron los datos necesarios" });
  }
});

app.get("/pets/cercanas", async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (lat && lng) {
    const petsResultado = await petsCercanas(lat, lng);

    if (petsResultado[0]) {
      res.json(petsResultado);
    } else {
      res.json({
        message:
          "No se han encontrado mascotas perdidas cercanas a su ubicación",
      });
    }
  } else {
    res.json({ error: "Error en ingresar los datos de geolocalización" });
  }
});

//me devuelve los datos de un usuario
app.get("/user-mail", async (req, res) => {
  const id = parseInt(req.query.id);

  const userId = await dataUserMail(id);
  res.json(userId);
});

app.get("/pet-data-report", async (req, res) => {
  const idPet = req.query.idPet;

  const onePet = await getPet(idPet);
  if (onePet) {
    res.json(onePet);
  } else {
    res.json({ error: "No existe a la mascota que quiso acceder" });
  }
});

app.post("/reports/enviar-mail", async (req, res) => {
  const { mailUser, texto } = req.body;

  try {
    const response = await enviarMail(mailUser, texto);
    res.json(response);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//esto hay que borrarlo despues
/*
app.get("/reports-all", async (req, res) => {
  const reports = await Report.findAll();

  res.json(reports);
});

app.get("/users-all", async (req, res) => {
  const users = await User.findAll();

  res.json(users);
});*/

app.listen(port, () => {
  console.log("todo ok en el puerto: ", port);
});
