import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conection";

export class User extends Model {}

User.init(
  {
    name: DataTypes.STRING,
    mail: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
