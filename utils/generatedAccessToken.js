

import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
 
  return jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.SECRET_ACCESS_KEY,
    { expiresIn: "5h" }
  );
};

export default generateAccessToken;