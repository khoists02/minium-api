import { DataTypes, Model } from "sequelize";

import sequelize from "@src/config/database";

import User from "@src/models/user.model";
/**
 * One to One relationship with user.model
 */
class Profile extends Model {
    public id!: number;
    public bio!: string;
    public userId!: number; // Foreign Key 
}
  
Profile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "profiles",
    },
  );
  
  // Associate Profile with User
  User.hasOne(Profile, {
    foreignKey: "userId",
    as: "profile",
  });
  Profile.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
  
  export default Profile;