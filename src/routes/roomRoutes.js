import express from "express";
import { listRooms } from "../services/roomService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await listRooms();
    
    res.send(rooms);
  } catch (error) {

    res.status(500).send({ error: "Error fetching rooms" });
  }
});

export default router;
