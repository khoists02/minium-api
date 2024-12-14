import { DataTypes, Model } from "sequelize";
import sequelize from '@src/config/database';
import User from "./user.model";
import Group from "./group.model";

class UserGroup extends Model {
  public userId!: number;
  public groupId!: number;
}

UserGroup.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "user_groups",
  },
);

// Define Many-to-Many relationship between User and Group
User.belongsToMany(Group, { through: UserGroup, foreignKey: "userId", as: "groups" });
Group.belongsToMany(User, { through: UserGroup, foreignKey: "groupId", as: "users" });

export default UserGroup;