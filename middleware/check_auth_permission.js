import jwt from "jsonwebtoken";

const checkAuthAndPermission = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            const token =
                req.cookies?.accessToken ||
                req.headers?.authorization?.split(" ")[1];

                // console.log(token,"skdkdkdkkd")

            if (!token) {
                return res.status(400).json({ error: "Token is missing" });
            }

            const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);

            if (!decoded) {
                return res.status(401).json({ error: "Unauthorized" });
            }

          
            if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
                return res
                    .status(403)
                    .json({ error: "You are not authorized to access this resource" });
            }


            req.user = decoded;

           

           


            next();
        } catch (error) {
            return res.status(500).json({ error: error.message || error });
        }
    };
};

export default checkAuthAndPermission;
