import express from "express";
import { createToken } from "../services/livekitTokenService.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { identity, roomName, role,adminWelcomeMessage } = req.body;

  if (!identity || !roomName) {
    return res.status(400).send("Missing identity or roomName");
  }

  try {
    const token = await createToken(identity, roomName, role,adminWelcomeMessage);
    console.log("admin Welcome Message received",adminWelcomeMessage);
    console.log("Token generated:");
    res.send({ token });
  } catch (error) {
    res.status(500).send("Error generating token");
  }
});
export default router;