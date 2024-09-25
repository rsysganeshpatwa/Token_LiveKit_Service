import { extractTextFromImage } from '../services/textractService.js';

export const uploadImageAndExtractText = async (req, res) => {
    try {
        const chunks = [];
        
        req.on('data', chunk => {
            chunks.push(chunk);
        });

        req.on('end', async () => {
            const imageBytes = Buffer.concat(chunks);
            const extractedText = await extractTextFromImage(imageBytes);
            res.status(200).json({ text: extractedText });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
