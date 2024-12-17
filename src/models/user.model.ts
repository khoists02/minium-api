import { DataTypes, Model } from "sequelize";

import sequelize from "@src/config/database";

class User extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
  }
  
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "users",
    },
  );
  
  export default User;