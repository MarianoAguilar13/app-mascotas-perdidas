import { sequelize } from "../db/conection";
import { User, Auth } from "../db/index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

const SECRET = "sdasdaasda123";

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function meAuth(id: number) {
  const auth = await Auth.findOne({
    where: {
      user_id: id,
    },
  });
  return auth;
}

export async function createAuthUser(
  mail: string,
  name: string,
  password: string
) {
  const [user, created] = await User.findOrCreate({
    where: { mail },
    defaults: {
      mail,
      name,
    },
  });

  const [auth, authCreated] = await Auth.findOrCreate({
    where: { user_id: user.get("id") },
    defaults: {
      mail,
      password: getSHA256ofString(password),
      //el id con el cual se creo el user en la DB
      user_id: user.get("id"),
    },
  });

  return [user, auth];
}

export async function createToken(mail: string, password: string) {
  const auth = await Auth.findOne({
    where: {
      mail,
      password: getSHA256ofString(password),
    },
  });

  if (auth) {
    const token = jwt.sign({ id: auth.get("user_id") }, SECRET);
    return token;
  } else {
    return false;
  }
}

export async function validarToken(headersAuth) {
  const token = headersAuth.split(" ")[1];

  try {
    const data = jwt.verify(token, SECRET);

    return data;
  } catch (e) {
    return false;
  }
}

export async function changePass(
  id: number,
  password: string,
  newPassword: string
) {
  const auth = await Auth.findOne({
    where: {
      user_id: id,
    },
  });
  //la password siempre se guarda hasheada
  if (auth.get("password") == getSHA256ofString(password)) {
    await Auth.update(
      {
        password: getSHA256ofString(newPassword),
      },
      {
        where: {
          //como ya busque los datos del auth solo le indico que voy a cambiar
          //al auth que tiene de id el auth que ya encontre
          id: auth.get("id"),
        },
      }
    );

    return true;
  } else {
    return false;
  }
}

export async function changeName(id: number, name: string, password: string) {
  const auth = await Auth.findOne({
    where: {
      user_id: id,
    },
  });

  //cambia el nombre solo si la contraseña ingresada es correcta
  if (auth.get("password") == getSHA256ofString(password)) {
    await User.update(
      {
        name: name,
      },
      {
        where: {
          id: id,
        },
      }
    );
    const userUpdate = await User.findByPk(id);

    return userUpdate;
  } else {
    return false;
  }
}
