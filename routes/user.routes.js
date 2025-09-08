import { Router } from "express";
import { loginController, registeruserController, getUsers,profileInfo } from "../controllers/user.controller.js";
import checkAuthAndPermission from "../middleware/check_auth_permission.js";
import { Roles } from "../config/config_constant.js";

const userRouter = Router();

userRouter.post("/register", registeruserController)
userRouter.post("/login", loginController);
userRouter.post("/profile-info",checkAuthAndPermission([Roles.USER]), profileInfo)
userRouter.get("/get-users", checkAuthAndPermission([Roles.SUPERADMIN]), getUsers);




export default userRouter; 