



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createSuperAdmin } from "./seed.js";
import { createServer } from "http";
import { initSocket } from "./socket/chat.socket.js";

const app = express();
dotenv.config();

app.use(cookieParser());

// databse connection
connectDb();

// middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

const port = process.env.PORT || 9000;
createSuperAdmin();

app.get("/", (_, res) => {
    res.json({ msg: "api is working" });
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);


const server = createServer(app);


initSocket(server);

server.listen(port, () => console.log(`server started on port ${port}`));
