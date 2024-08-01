import { AccessToken } from "livekit-server-sdk";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

const API_KEY = "APIbCNnidZtNjoF";

const API_SECRET = "QJtdp3WystKBa6n31ya8MTDwzJ5neHqQhg8y8pT5flA";

app.use(express.json());
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
    // Token to expire after 10 minutes
    ttl: 100000,
    name: participantName,
  });
  // console.log('admin',role)
  //  if (role === 'admin') {
  console.log('participantName',participantName);
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  // } else if (role === 'user') {
  //   at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: false,canPublishData:true ,

  //    });
  // }

  return await at.toJwt();
};

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
