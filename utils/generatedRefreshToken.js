// import userModel from "../models/user.modal.js";
// import jwt from "jsonwebtoken";

// const generatedRefreshToken = async (userId) => {
//   const token = await jwt.sign({ id: userId }, process.env.SECRET_REFRESH_KEY, {
//     expiresIn: "7d",
//   });
//   const updateRefreshToken = await userModel.updateOne(
//     { _id: userId },
//     { refresh_token: token }
//   );
//   return token;
// };

// export default generatedRefreshToken;
