import AWS from 'aws-sdk';
import fs from 'fs';
import { Buffer } from 'buffer'; // Make sure to import Buffer

AWS.config.update({ region: 'us-east-1' }); // Set your AWS region
const textract = new AWS.Textract();

export const extractTextFromImage = async (imageBytes) => {
    try {
        const params = {
            Document: {
                Bytes: imageBytes,
            },
        };

        const response = await textract.detectDocumentText(params).promise();
        
        // Process the response to extract text
        const text = response.Blocks
            .filter(block => block.BlockType === 'LINE')
            .map(block => block.Text)
            .join('\n');

        return text;
    } catch (error) {
        console.error('Error extracting text:', error);
        throw new Error('Failed to extract text');
    }
};