import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { TranslateClient } from "@aws-sdk/client-translate";

class Handler {
  private rekognition: RekognitionClient;
  private translate: TranslateClient;

  constructor(rekognition: RekognitionClient, translate: TranslateClient) {
    this.rekognition = rekognition;
    this.translate = translate;
  }
}

export function makeHandler() {
  const rekognitionClient = new RekognitionClient();
  const translateClient = new TranslateClient();


  const handler = new Handler(rekognitionClient, translateClient);

  return handler;
}