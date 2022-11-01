import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conection";

export class Auth extends Model {}

Auth.init(
  {
    mail: DataTypes.STRING,
    password: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  },
  { sequelize, modelName: "auth" }
);
