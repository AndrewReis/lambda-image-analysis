import { Rekognition, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

class Handler {
  private rekognition: Rekognition;

  constructor(rekognition: Rekognition) {
    this.rekognition = rekognition;
  }

  async detectImageLabels(buffer: Buffer) {
    const result = await this.rekognition.send(new DetectLabelsCommand({ Image: { Bytes: buffer } }));

    if (result.Labels) {
      return result.Labels
        .filter(label => Number(label.Confidence) > 80)
        .map(label => (label.Name))
        .join(' and ')
    }

    return '';
  }
}

export function makeHandler() {
  const rekognitionClient = new Rekognition();

  const handler = new Handler(rekognitionClient);

  return handler;
}