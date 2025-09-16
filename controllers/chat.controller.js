import { prisma } from "../config/db.js";

export const getChatMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.params;

        if (!otherUserId) {
            return res.status(400).json({ message: "otherUserId is required" });
        }


        const chatRoom = await prisma.chatRoom.findFirst({
            where: {
                OR: [
                    { userOneId: userId, userTwoId: Number(otherUserId) },
                    { userOneId: Number(otherUserId), userTwoId: userId },
                ],
            },
        });

        if (!chatRoom) {
            return res.status(404).json({ message: "No chat room found" });
        }


        const messages = await prisma.message.findMany({
            where: { chatId: chatRoom.id },
            orderBy: { createdAt: "asc" },
        });

        res.status(200).json({ success: true, messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};