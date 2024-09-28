import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactRoutes from "./routes/ContactRoutes.js"
import setupSocket from "./socket.js"
import messagesRoutes from "./routes/MessagesRoutes.js"
import channelRoutes from "./routes/ChannelRoutes.js"

dotenv.config();

const __dirname = path.resolve();

const app=express();
const port=process.env.PORT || 3001
const databaseURL=process.env.DATABASE_URL

app.use(cors
    ({
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
)

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/contacts",contactRoutes)
app.use("/api/messages",messagesRoutes)
app.use("/api/channel",channelRoutes)

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const server=app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})

setupSocket(server);

mongoose
.connect(databaseURL)
.then(()=> console.log("Database connected"))
.catch((err)=> console.log(err.message))
