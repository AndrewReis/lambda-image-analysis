import axios from "axios";
import { makeHandler } from "./factory";

const getImageBuffer = async (imageUrl: string) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data, 'base64');
  } catch (error) {
    throw error;
  }
}

export const run = async (event: any) => {
  try {
    if (!Object.keys(event).includes('queryStringParameters')) {
      return {
        statusCode: 400,
        body: 'Query string parameters is required!'
      }
    }

    const { image_url } = event.queryStringParameters;

    if (!image_url) {
      return {
        statusCode: 400,
        body: 'Image URL is required!'
      }
    }

    const imageBuffer = await getImageBuffer(image_url);

    const handler = makeHandler();

    const labels = await handler.detectImageLabels(imageBuffer);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: labels,
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: 'Internal server error'
    }
  }
};
