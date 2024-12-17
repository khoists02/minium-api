import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@src/config/database";

// Define Post attributes
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string; // Foreign key to User
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: "users",
      indexes: [
        {
          unique: true,
          fields: ["name", "email"]
        }
      ]
    },
  );
  
  export default User;