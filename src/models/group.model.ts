/**
 * Many to many relationship example.
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "@src/config/database";

class Group extends Model {
  public id!: string;
  public name!: string;
}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "groups",
  },
);

export default Group;