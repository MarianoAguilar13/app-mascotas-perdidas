import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(process.env.POSTGRE_ELEPHANT_URL);
/*
export const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.POSTGRE_USERNAME,
  password: process.env.POSTGRE_PASSWORD,
  database: process.env.POSTGRE_DATABASE,
  port: 5432,
  host: process.env.POSTGRE_HOST,
  ssl: true,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});*/

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
