// import express from "express";
// import { getOrCreateChatRoom, sendMessage, getMessages } from "../controllers/chat.controller.js";

// import { Roles } from "../config/config_constant.js";
// import checkAuthAndPermission from "../middleware/check_auth_permission.js";

// const chatRouter = express.Router();

// chatRouter.post("/room", checkAuthAndPermission([Roles.USER]),getOrCreateChatRoom);
// chatRouter.post("/message", checkAuthAndPermission([Roles.USER]), sendMessage);
// chatRouter.get("/messages/:chatId", checkAuthAndPermission([Roles.USER]),getMessages);

// export default chatRouter;


import express from "express";


import { Roles } from "../config/config_constant.js";
import checkAuthAndPermission from "../middleware/check_auth_permission.js";
import { getChatMessages } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/messages/:otherUserId", checkAuthAndPermission([Roles.USER]), getChatMessages);


export default chatRouter;

