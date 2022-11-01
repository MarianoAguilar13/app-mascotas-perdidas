import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conection";

export class Report extends Model {}

Report.init(
  {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    information: DataTypes.STRING,
  },
  { sequelize, modelName: "report" }
);
