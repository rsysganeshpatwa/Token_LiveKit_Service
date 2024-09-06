import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import roomRoutes from "./src/routes/roomRoutes.js";
import tokenRoutes from "./src/routes/livekitTokenRoutes.js";
import approvalRoutes from "./src/routes/approvalRoutes.js";
import recordingRoutes from "./src/routes/recordingRoutes.js";
import { roomDataRoutes } from "./src/routes/roomDataRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

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
app.use("/room-permission", approvalRoutes);
app.use("/recording", recordingRoutes);
app.use("/room-data-manage", roomDataRoutes);
app.use("/welcomeMessage",welcomeMessageRoutes);

app.get("/", (req, res) => {
  res.send("Live Kit Token API is running");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
