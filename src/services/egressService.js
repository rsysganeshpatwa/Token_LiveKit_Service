import { EgressClient, StreamOutput, StreamProtocol } from "livekit-server-sdk";
import { API_KEY, API_SECRET, LIVEKIT_HOST_INGRESS } from "../../config.js";

class LiveKitService {
  constructor() {
    this.livekitHost = LIVEKIT_HOST_INGRESS;
    this.livekitApiKey = API_KEY;
    this.livekitApiSecret = API_SECRET;
    this.egressClient = new EgressClient(
      this.livekitHost,
      this.livekitApiKey,
      this.livekitApiSecret
    );
  }

  async startYouTubeStream(roomName, youtubeKey, options = {}) {
    try {
      console.log('Starting YouTube stream...');
      console.log('Room Name:', roomName);

     
      const streamOutput = new StreamOutput({
        protocol: StreamProtocol.RTMP,
        urls: [`${youtubeKey}`],
      });

      const streamInfo = await this.egressClient.startRoomCompositeEgress(
        roomName,
        { stream: streamOutput },
        { layout: 'speaker' },
      );

      return streamInfo;
    } catch (error) {
      console.error("Error starting YouTube stream:", error);
      throw new Error("Failed to start YouTube stream.");
    }
  }

  async stopStream(egressId) {
    try {
      return await this.egressClient.stopEgress(egressId);
    } catch (error) {
      console.error("Error stopping stream:", error);
      throw new Error("Failed to stop stream.");
    }
  }

  async  getAllStreams() {

   function convertBigIntToString(obj) {
      return JSON.parse(JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
    }
  
      const streams = await this.egressClient.listEgress();
    
   
     
        return convertBigIntToString(streams);
    
    
  }

 
  

  


}

export default new LiveKitService();
