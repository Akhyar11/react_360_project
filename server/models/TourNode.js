import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TourNode = sequelize.define("TourNode", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  panoramaUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  thumbnailUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  defaultYaw: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  },
  defaultPitch: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  },
  mapPosition: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: { x: 50, y: 50 },
  },
  facilities: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  navigationHotspots: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  infoHotspots: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: "tour_nodes",
  timestamps: true,
});

export default TourNode;
