import { sequelize } from "./db/conection";

sequelize.sync({ alter: true }).then(() => {
  console.log("Se sincronizo la DB");
});
