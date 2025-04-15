import livekitService from '../services/egressService.js';

const streamController = {
  async startStream(req, res) {
    try {
      const { roomName, youtubeKey, options } = req.body;

      if (!roomName || !youtubeKey) {
        return res.status(400).json({
          success: false,
          error: 'Room name and YouTube stream key are required',
        });
      }

      const streamOutput = await livekitService.startYouTubeStream(roomName, youtubeKey, options);

      res.status(200).json({
        success: true,
        egressId: streamOutput.egressId,
        message: 'YouTube stream started successfully',
      });
    } catch (error) {
      console.error('Failed to start stream:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  async stopStream(req, res) {
    try {
      const { egressId } = req.body;

      if (!egressId) {
        return res.status(400).json({
          success: false,
          error: 'Egress ID is required',
        });
      }

      await livekitService.stopStream(egressId);

      res.status(200).json({
        success: true,
        message: 'Stream stopped successfully',
      });
    } catch (error) {
      console.error('Failed to stop stream:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  

    async getAllStreams(req, res) {
        try {
        const data = await livekitService.getAllStreams();

        const list = data.map((stream) => {
            return {
            id: stream.id,
            roomName: stream.roomName,
            status: stream.status,
            createdAt: stream.createdAt,
            updatedAt: stream.updatedAt,
            streamUrl: stream.streamUrl,
            };
        }
        );
    
        res.status(200).json({
            success: true,
            streams: list, //
        });
        } catch (error) {
        console.error('Failed to get all streams:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
        }
    },
};

export default streamController;
