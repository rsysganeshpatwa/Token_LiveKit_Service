import express from "express";
import { listRooms } from "../services/roomService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await listRooms();
    console.log("rooms", rooms);
    res.send(rooms);
  } catch (error) {
    res.status(500).send("Error fetching rooms");
  }
});

export default router;
