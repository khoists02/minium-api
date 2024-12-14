import { DataTypes, Model } from "sequelize";
import sequelize from '@src/config/database';
import User from "./user.model";
import Group from "./group.model";

class UserGroup extends Model {
  public userId!: string;
  public groupId!: string;
}

UserGroup.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID,
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