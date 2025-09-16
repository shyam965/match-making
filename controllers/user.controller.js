

import bcrypt from "bcrypt";
import generatedAccessToken from "../utils/generatedAccessToken.js";
// import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import { prisma } from "../config/db.js";
import bcryptjs from "bcryptjs"
import { executeQuery } from "../config/executeQuery.js";
import { success } from "zod";




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


// Like a user
export const likeUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { likedUserId } = req.body;


        if (!likedUserId) {
            return res.status(400).json({ message: "Liked user ID is required" });
        }

        if (userId === likedUserId) {
            return res.status(400).json({ message: "You cannot like yourself" });
        }


        const existingLike = await prisma.like.findUnique({
            where: {
                userId_likedUserId: { userId, likedUserId },
            },
        });

        if (existingLike) {
            return res.status(400).json({ message: "Already liked this user" });
        }

        const like = await prisma.like.create({
            data: {
                userId,
                likedUserId,
            },
        });

        res.status(201).json({
            message: "User liked successfully",
            success: true,
            like,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

// likes get data
// export const likesGetData = async (req, res) => {
//     try {
//         const user_id = req.user.id;

//         const query = `
//       SELECT l.*, u.*
//       FROM likes l
//       JOIN users u ON l."likedUserId" = u.id
//       WHERE l."userId" = ${user_id}
//     `;

//         const users = await executeQuery(query, [user_id]);

//         return res.status(200).json({
//             success: true,
//             message: "likes Users fetched successfully",
//             data: users,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             error: error.message,
//         });
//     }
// };


// mathce 

export const createMatchController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { likedUserId } = req.body;

        console.log(userId, likedUserId, "skdskldskkskjsd")

        if (!likedUserId) {
            return res.status(400).json({ message: "Liked user ID is required" });
        }

        if (userId === likedUserId) {
            return res.status(400).json({ message: "You cannot match with yourself" });
        }



        const existingMatch = await prisma.matches.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: likedUserId },
                    { user1Id: likedUserId, user2Id: userId },
                ],
            },
        });

        if (existingMatch) {
            return res.status(400).json({ message: "Match already exists" });
        }

        // Create match
        const match = await prisma.matches.create({
            data: {
                user1Id: userId,
                user2Id: likedUserId,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Match created successfully ",
            data: match,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
};


export const likesGetData = async (req, res) => {
    try {
        const user_id = req.user.id;

        const query = `
            SELECT l.*, u.*
            FROM likes l
            JOIN users u ON l."likedUserId" = u.id
            WHERE l."userId" = $1
            AND NOT EXISTS (
                SELECT 1 
                FROM matches m
                WHERE 
                  (m."user1Id" = l."userId" AND m."user2Id" = l."likedUserId")
                  OR 
                  (m."user1Id" = l."likedUserId" AND m."user2Id" = l."userId")
            )
        `;

        const users = await executeQuery(query, [user_id]);

        return res.status(200).json({
            success: true,
            message: "Likes users fetched successfully (excluding matched)",
            data: users,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// delete like by user 
export const cancelLikeController = async (req, res) => {
    try {
        const userId = req.user.id;
        const likedUserId = parseInt(req.params.likedUserId, 10); 

        console.log(likedUserId, userId, "skdkd");

        if (isNaN(likedUserId)) {
            return res.status(400).json({ message: "Liked user ID must be a valid number" });
        }

        await prisma.like.deleteMany({
            where: {
                userId: userId,
                likedUserId: likedUserId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Like removed successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
};




export const getMatchesController = async (req, res) => {
    try {
        const userId = req.user.id;

        const matches = await prisma.matches.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
            include: {
                user1: true,
                user2: true,
            },
        });


        const formattedMatches = matches.map((m) => {
            const otherUser = m.user1Id === userId ? m.user2 : m.user1;
            return {
                matchId: m.id,
                matchedAt: m.createdAt,
                user: otherUser,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Matches fetched successfully",
            data: formattedMatches,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
};

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
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }


        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data,
        });

        res.status(201).json({
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

// upload image
export const uploadUserImages = async (req, res) => {
    try {
        const userId = req.user?.id;


        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        const files = req.files;
        console.log(files, "dksddkk")
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded", success: false });
        }

        // const imagePaths = files.map(file => file.path);
        const imagePaths = files.map(file => file.path.replace(/\\/g, "/"));

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                images: {
                    push: imagePaths,
                },
            },
        });

        res.status(201).json({
            message: "Images uploaded successfully",
            success: true,
            user: updatedUser.images,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
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
        const currentUserId = req.user.id;

        const query = `
            SELECT * FROM users
            WHERE role != 'superadmin' AND id != ${currentUserId}
        `;

        const users = await executeQuery(query, [currentUserId]);

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


export const deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const deletedUser = await prisma.users.delete({
            where: { id: userId },
        });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not provided",
            });
        }

        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data provided for update",
            });
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data,
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};




