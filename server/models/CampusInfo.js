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
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
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
  maps: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [
      {
        id: "kampus-utama",
        name: "Kampus Utama (Pusat)",
        imageUrl: "",
        description: "Denah area Kampus Utama UAN"
      },
      {
        id: "kampus-cabang",
        name: "Kampus Cabang (Vokasi)",
        imageUrl: "",
        description: "Denah area Kampus Cabang Vokasi UAN"
      }
    ]
  },
  primaryColor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "#14b8a6",
  },
  secondaryColor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "#3b82f6",
  },
}, {
  tableName: "campus_info",
  timestamps: true,
});

export default CampusInfo;
