import { Model } from "sequelize";
declare class User extends Model {
    id: number;
    name: string;
    email: string;
}
export default User;
