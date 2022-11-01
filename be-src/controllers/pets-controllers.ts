import { sequelize } from "../db/conection";
import { User, Pet } from "../db/index";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";

export async function getPet(idPet: number) {
  const pet = await Pet.findByPk(idPet);
  return pet;
}

export async function crearPublicacionPet(
  name: string,
  type: string,
  description: string,
  bodyData,
  lat: number,
  lng: number,
  lost: boolean,
  userId: number
) {
  if (bodyData.pictureDataURL) {
    //Cargo la imagen a cloudinary para que me genere una url y guardar
    //esa url en la db en postgre

    const imagen = await cloudinary.uploader.upload(bodyData.pictureDataURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });

    //  const imagen = { secure_url: bodyData.pictureDataURL };
    //creo la publicacion de la pet y en picURL, va la url de la imagen
    //de la pet guardada en cloudinary
    const newPet = await Pet.create({
      name: name,
      type: type,
      description: description,
      picURL: imagen.secure_url,
      lat: lat,
      lng: lng,
      lost: lost,
      userId: userId,
    });

    //guardo en algolia el id de la pet, nombre y la geoloc,
    // para luego hacer la busqueda
    await index.saveObject({
      objectID: newPet.get("id"),
      name: newPet.get("name"),
      _geoloc: {
        lat: newPet.get("lat"),
        lng: newPet.get("lng"),
      },
    });

    return newPet;
  } else {
    return false;
  }
}

export async function editarPublicacionPet(
  name: string,
  type: string,
  description: string,
  bodyData,
  lat: number,
  lng: number,
  lost: boolean,
  petId: number,
  userId: number
) {
  let url;
  // si bodyData.pictureDataURL tiene un tamaño mayor a 1000 caracteres,
  //significa que tiene la data de una nueva imagen, sino ya nos da la url

  if (bodyData.pictureDataURL.length >= 1000) {
    const imagen = await cloudinary.uploader.upload(bodyData.pictureDataURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });

    url = imagen.secure_url;
  } else {
    url = bodyData.pictureDataURL;
  }

  const petModificada = await Pet.update(
    {
      name: name,
      type: type,
      description: description,
      picURL: url,
      lat: lat,
      lng: lng,
      lost: lost,
    },
    {
      where: {
        //indico cual es la pet a la que le modifico los datos
        id: petId,
      },
    }
  );

  //guardo en algolia el id de la pet, nombre y la geoloc,
  // para luego hacer la busqueda

  await index.partialUpdateObject({
    objectID: petId,
    name: name,
    _geoloc: {
      lat: lat,
      lng: lng,
    },
  });

  return petModificada;
}

export async function petsCercanas(lat: number, lng: number) {
  //con algolia, voy a buscar todas las pets que esten cercas
  //a una determinada localización y un radio
  //luego busco en la db las pets cercanas con el petId obtenidos
  //en los hits de algolia, luego retorno un array de pets
  const petsEncontradas = [];

  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 5000,
  });

  if (hits) {
    for (const hit of hits) {
      const petId = hit.objectID;

      console.log("hit id: ", hit.objectID);

      const pet = await Pet.findOne({
        where: {
          id: petId,
        },
      });
      //si no tiene nada en la primera posicion, lo inicializo y
      //despues hago push por cada otra pet cercana
      if (petsEncontradas[0] == undefined) {
        petsEncontradas[0] = pet;
      } else {
        petsEncontradas.push(pet);
      }
    }

    return petsEncontradas;
  } else {
    return false;
  }
}
