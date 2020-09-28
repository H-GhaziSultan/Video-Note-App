import Creator from "./Creator";
import TranscriptionSentence from "./TranscriptionSentence";

export default class Transcription {
  // Attributes
  id?: number;
  creator: Creator;
  language: string;
  transcriptSentences: Array<TranscriptionSentence>;
  videoID?: number;

  constructor() {
    this.creator = Creator.Algorithm;
    this.language = "en";
    this.transcriptSentences = new Array<TranscriptionSentence>();

    this.setupProperties();
  }

  setupProperties(): Transcription {
    Object.defineProperties(this, {
      transcriptSentences: { enumerable: false, writable: true },
    });
    return this;
  }
}
