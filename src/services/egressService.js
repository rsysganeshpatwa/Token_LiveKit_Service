// egressService.js
import {
  EgressClient,
  EncodedFileOutput,
  EncodedFileType,
} from "livekit-server-sdk";
import { API_KEY, API_SECRET, LIVEKIT_HOST } from "../../config.js";
// Adjust path as necessary

// Initialize the Egress Client
const egressClient = new  EgressClient(LIVEKIT_HOST, API_KEY, API_SECRET);

// Configure file output to local storage
const fileOutput = new EncodedFileOutput({
  fileType: EncodedFileType.MP4,
  filepath: "livekit-demo/room-composite-test.mp4",
});

// Function to start recording
const startRecording = async (roomName) => {
  try {
    const response = await egressClient.startRoomCompositeEgress(roomName, {
      file: fileOutput,
    });
    console.log("Recording started:", response);
    return response;
  } catch (error) {
    console.error(
      "Error starting recording:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Function to stop recording
const stopRecording = async (egressId) => {
  try {
    const response = await egressClient.stopEgress(egressId);
    console.log("Recording stopped:", response);
    return response;
  } catch (error) {
    console.error(
      "Error stopping recording:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export { startRecording, stopRecording };
