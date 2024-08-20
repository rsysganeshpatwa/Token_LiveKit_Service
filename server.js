import {
  AccessToken,
  RoomServiceClient,
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
} from "livekit-server-sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

const API_KEY = process.env.livekitLocalAPIKey;
const API_SECRET = process.env.livekitLocalSecret;
const livekitHost = process.env.livekitURL;

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

// List rooms
svc.listRooms().then((rooms) => {
  // console.log("existing rooms", rooms);
});

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

const createToken = async (participantName, roomName, role) => {
  const at = new AccessToken(API_KEY, API_SECRET, {
    identity: `${participantName}${generateRandomString(5)}`,
    ttl: 100000,
    name: participantName,

  });
// Add metadata to the token
at.metadata = JSON.stringify({ role: role });

  console.log("participantName", participantName, "role", role);

  // Set permissions based on the role
  let grantOptions = {
    roomJoin: true,
    room: roomName,
    canSubscribe: true,                  // Both can subscribe
    
  };

  // Add role to custom claims (metadata)
 // at.metadata = { role }; // Add the role as a custom property
  
  // Add grant to the token
  at.addGrant(grantOptions);

  return await at.toJwt();
};

app.get("/rooms", async (req, res) => {
  const rooms = await svc.listRooms();
  console.log("rooms", rooms);

  res.send(rooms);
});

app.post("/token", async (req, res) => {
  const { identity, roomName, role } = req.body;

  if (!identity || !roomName) {
    return res.status(400).send("Missing identity or roomName");
  }

  let tokenGen = await createToken(identity, roomName, role);

  console.log("Token generated:", tokenGen);
  res.send({ token: tokenGen });
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
