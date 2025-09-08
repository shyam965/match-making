import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];

      console.log(token,"__________")

    if (!token) return res.status(401).json({ message: "Provide token" });

    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    req.user = decoded;


    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export default auth;
