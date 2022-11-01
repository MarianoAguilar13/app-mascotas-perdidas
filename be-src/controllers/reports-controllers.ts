import { sequelize } from "../db/conection";
import { User, Pet, Report } from "../db/index";
import { sgMail } from "../lib/sendGrid";

export async function crearReport(
  name: string,
  tel: string,
  information: string,
  petId: number
) {
  const newReport = await Report.create({
    name: name,
    tel: tel,
    information: information,
    petId: petId,
  });

  return newReport;
}

export async function enviarMail(mailUser: string, texto: string) {
  try {
    const msg = {
      to: mailUser, // A quien va dirigido el correo
      from: "marianokuro@gmail.com", // Quien envia el correo (tiene que ser un sender verificado dentro de mi Sendgrid)
      subject: "Mascotas perdidas",
      text: "hola",
      html: "<strong>" + texto + "</strong>",
    };
    const mensaje = await sgMail.send(msg);

    // console.log(mensaje);
    return { mensaje, message: "Mensaje enviado" };
  } catch (error) {
    return { message: error.message };
  }
}
