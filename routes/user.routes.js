import { Router } from "express";
import { loginController, registeruserController, getUsers, profileInfo, uploadUserImages, deleteUser, updateUser, likeUserController, likesGetData, createMatchController, getMatchesController, cancelLikeController } from "../controllers/user.controller.js";
import checkAuthAndPermission from "../middleware/check_auth_permission.js";
import { Roles } from "../config/config_constant.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", registeruserController)
userRouter.post("/login", loginController);
userRouter.post("/profile-info", checkAuthAndPermission([Roles.USER]), profileInfo)
userRouter.post("/like", checkAuthAndPermission([Roles.USER]), likeUserController)
userRouter.get("/get-like", checkAuthAndPermission([Roles.USER]), likesGetData)
userRouter.get("/get-matches", checkAuthAndPermission([Roles.USER]), getMatchesController)
userRouter.post("/match", checkAuthAndPermission([Roles.USER]), createMatchController)
userRouter.delete(
    "/cancel-like/:likedUserId",
    checkAuthAndPermission([Roles.USER]),
    cancelLikeController
);

userRouter.post(
    "/upload-images",
    checkAuthAndPermission([Roles.USER]),
    upload.array("images", 10),
    uploadUserImages
);
userRouter.get("/get-users", checkAuthAndPermission([Roles.SUPERADMIN, Roles.USER]), getUsers);

userRouter.delete("/delete-user/:id", checkAuthAndPermission([Roles.SUPERADMIN]), deleteUser)
userRouter.put("/update-user/:id", checkAuthAndPermission([Roles.USER]), updateUser)




export default userRouter; 