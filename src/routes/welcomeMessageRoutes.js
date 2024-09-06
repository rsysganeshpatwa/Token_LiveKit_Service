import express from "express";
import {WelcomeMap} from "../models/globalMap.js";

const router = express.Router();

router.post("/welcomeMessage", async (req, res) => {
    const {roomName} = req.body;
    console.log("welcomeMessage API called",roomName);
  
    if (!roomName) {
      console.log("RoomName is not in URL so defalut -- Welcome to the room    ");
      return res.send("");
    } 
    const message = WelcomeMap.get(roomName);
    res.send(message);
  });

  export default router;
  