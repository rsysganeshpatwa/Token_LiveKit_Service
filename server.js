import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import roomRoutes from "./src/routes/roomRoutes.js";
import tokenRoutes from "./src/routes/livekitTokenRoutes.js";
import welcomeMessageRoutes from "./src/routes/welcomeMessageRoutes.js";
import approvalRoutes from "./src/routes/approvalRoutes.js";
import recordingRoutes from "./src/routes/recordingRoutes.js";
import { roomDataRoutes } from "./src/routes/roomDataRoutes.js";
import textractRoutes from "./src/routes/textractRoutes.js";


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
// To handle binary data
// Set limits for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' })); // Set as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));
app.use("/rooms", roomRoutes);
app.use("/token", tokenRoutes);
// Use the approval routes
app.use("/room-permission", approvalRoutes);
app.use("/recording", recordingRoutes);
app.use("/room-data-manage", roomDataRoutes);
app.use("/welcomeMessage",welcomeMessageRoutes);
// Use the Textract routes
app.use('/textract', textractRoutes);

app.get("/", (req, res) => {
  res.send("Live Kit Token API is running");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
