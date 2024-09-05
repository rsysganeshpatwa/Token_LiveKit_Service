import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import roomRoutes from "./src/routes/roomRoutes.js";
import tokenRoutes from "./src/routes/livekitTokenRoutes.js";
import approvalRoutes from "./src/routes/approvalRoutes.js";
import WelcomeMap from './globalMap.js';
import { RoomServiceClient, EgressClient } from 'livekit-server-sdk'; 

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;


const API_KEY = process.env.livekitLocalAPIKey;
const API_SECRET = process.env.livekitLocalSecret;
const livekitHost = process.env.livekitLocalURL;

const svc = new RoomServiceClient(livekitHost, API_KEY, API_SECRET);
const egressClient = new EgressClient(livekitHost, API_KEY, API_SECRET);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const recordingsDir = path.join(__dirname, "out");
console.log("out", recordingsDir);

// Ensure recordings directory exists
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

// Use routes
app.use("/rooms", roomRoutes);
app.use("/token", tokenRoutes);
// Use the approval routes
app.use('/room-permission', approvalRoutes);

app.get("/", (req, res) => {
  res.send("Live Kit Token API is running");
});

const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

app.get("/rooms", async (req, res) => {
  const rooms = await svc.listRooms();
  res.send(rooms);
});

app.post("/welcomeMessage", async (req, res) => {
  const {roomName} = req.body;
  console.log("welcomeMessage API called",roomName);

  if (!roomName) {
    console.log("RoomName is not in URL so defalut -- Welcome to the room    ");
    return res.send("");
  } 
  const message = WelcomeMap.get(roomName);
  res.send(message);
});


app.post("/token", async (req, res) => {
  const { identity, roomName, role ,adminWelcomeMessage} = req.body;

  if (!identity || !roomName) {
    return res.status(400).send("Missing identity or roomName");
  }

  let tokenGen = await createToken(identity, roomName, role, adminWelcomeMessage);

  console.log("Token Generated");
  res.send({ token: tokenGen });
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
