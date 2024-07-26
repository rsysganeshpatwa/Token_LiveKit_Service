import { AccessToken }  from "livekit-server-sdk";
import express from  "express";
import cors from 'cors';


const app = express();
app.use(cors());
const port = 3000;

const API_KEY = "APIbCNnidZtNjoF";

const API_SECRET = "QJtdp3WystKBa6n31ya8MTDwzJ5neHqQhg8y8pT5flA";

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Live Kit Token API is running");
});


const createToken = async (participantName,roomName) => {
   
    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: participantName,
      // Token to expire after 10 minutes
      ttl: '10m',
    });
    at.addGrant({ roomJoin: true, room: roomName });
  
    return await at.toJwt();
  }

app.post("/token", async (req, res) => {
    const { identity, roomName } = req.body;
  
    if (!identity || !roomName) {
      return res.status(400).send("Missing identity or roomName");
    }
  
    let tokenGen = await createToken(identity,roomName);
 
  
    console.log('Token generated:', tokenGen);
    res.send({ token: tokenGen });
  });
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
