import { Model } from "sequelize";
/**
 * One to One relationship with user.model
 */
declare class Profile extends Model {
    id: number;
    bio: string;
    userId: number;
}
export default Profile;
