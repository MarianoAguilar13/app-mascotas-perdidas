import { sequelize } from "../db/conection";
import { User, Pet } from "../db/index";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";

export async function dataMe(id: number) {
  const user = await User.findByPk(id);
  return user;
}

export async function dataUserMail(id: number) {
  const user = await User.findByPk(id);

  const idUser = user.get("mail");

  return idUser;
}

export async function petsMe(userId: number) {
  const allPets = await Pet.findAll({
    where: {
      userId: userId,
    },
  });

  return allPets;
}
