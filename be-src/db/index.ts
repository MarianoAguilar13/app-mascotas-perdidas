import { User } from "./users";
import { Pet } from "./pets";
import { Auth } from "./auth";
import { Report } from "./reports";

//one to many --> 1,n
User.hasMany(Pet);
//one to one --> 1,1
Pet.belongsTo(User);

User.hasMany(Report);
Report.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Pet, Auth, Report };
