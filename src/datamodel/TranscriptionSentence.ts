import Creator from "./Creator";

export default class TranscriptionSentence {
  // Attributes
  id?: number;
  startTime: number;
  endTime: number;
  content: string;
  creator: Creator;
  editor: Creator | undefined;

  transcriptionID?: number;

  constructor() {
    this.startTime = 0;
    this.endTime = 0;
    this.content = "";
    this.creator = Creator.Algorithm;
  }
}
