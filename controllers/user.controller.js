
import bcrypt from "bcrypt";
import generatedAccessToken from "../utils/generatedAccessToken.js";
// import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import { prisma } from "../config/db.js";
import bcryptjs from "bcryptjs"
import { executeQuery } from "../config/executeQuery.js";




export const registeruserController = async (req, res) => {
    try {
        const { name, email, password, role, } = req.body;



        if (!name || !email || !password) {
            res.status(404).json({
                message: "please fill in all fields",
            })
        }

        const existingUser = await prisma.users.findUnique({
            where: { email },
        })
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                role,
                password: hashedPassword,

               
            },
        });
        // const newUser = await prisma.users.create({
        //     data: {
        //         ...req.body,
        //         password: hashedPassword,
        //         dob: dob ? new Date(dob) : null,
        //     },
        // });
        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });

    }
}

// profile info 

export const profileInfo = async (req, res) => {
    try {
        const userId = req.user?.id;

        const data = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user not found",
                success: false,
            });
        }


        const existingUser = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }


        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data,
        });

        res.status(200).json({
            message: "profileInfo details updated successfully",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in profileInfo controller:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};



//login


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required",
                error: true,
            });
        }

        const user = await prisma.users.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({
                message: "invalid password",
                error: true,
                success: false,
            });
        }


        const accessToken = await generatedAccessToken(user);

        const cookieOption = {
            httpOnly: true,
            secure: false,
            sameSite: "None",
        };

        res.cookie("accessToken", accessToken, cookieOption);

        return res.status(200).json({
            message: "login success",
            error: false,
            success: true,
            data: {
                accessToken: accessToken,
                user: user,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true,
        });
    }
};

// get users 

export const getUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users";
        const users = await executeQuery(query);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


