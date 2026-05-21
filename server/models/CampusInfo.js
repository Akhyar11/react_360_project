import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CampusInfo = sequelize.define("CampusInfo", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slogan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  stats: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  quickTips: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: "campus_info",
  timestamps: true,
});

export default CampusInfo;
