import { Server } from "socket.io";
import { prisma } from "../config/db.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);


        socket.on("joinRoom", async ({ userId, otherUserId }) => {
            console.log(userId, otherUserId)
            try {

                let match = await prisma.matches.findFirst({
                    where: {
                        OR: [
                            { user1Id: userId, user2Id: otherUserId },
                            { user1Id: otherUserId, user2Id: userId },
                        ],
                    },
                });

                if (!match) {
                    match = await prisma.matches.create({
                        data: { user1Id: userId, user2Id: otherUserId },
                    });
                }


                let chatRoom = await prisma.chatRoom.findFirst({
                    where: {
                        OR: [
                            { userOneId: userId, userTwoId: otherUserId },
                            { userOneId: otherUserId, userTwoId: userId },
                        ],
                    },
                });

                if (!chatRoom) {
                    chatRoom = await prisma.chatRoom.create({
                        data: { userOneId: userId, userTwoId: otherUserId },
                    });
                }


                socket.join(`chat_${chatRoom.id}`);
                socket.chatId = chatRoom.id;
                socket.userId = userId;


            } catch (err) {
                console.error("Error joining room:", err);
            }
        });


        socket.on("sendMessage", async ({ senderId, recipientId, content }) => {
            console.log(senderId, "_____skdkskdsdkkd_____", content)
            try {
                if (!socket.chatId)
                    return socket.emit("error", { message: "Join room first" });


                const message = await prisma.message.create({
                    data: {
                        content,
                        senderId,
                        chatId: socket.chatId,
                    },
                });


                socket.to(`chat_${socket.chatId}`).emit("receiveMessage", message);
            } catch (err) {
                console.error("Error sending message:", err);
                socket.emit("error", { message: "Message send failed" });
            }
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};
