import Note from "./Note";
import Timestamp from "./Timestamp";
import Transcription from "./Transcription";

export default class Video {
  // Attributes
  id?: number;
  title: string;
  author: string;
  date: Date;
  uri: string;
  lastEdited: Date;
  watchedUntil: number;
  transcriptions: Array<Transcription>;
  timestamps: Array<Timestamp>;
  notes: Array<Note>;

  constructor() {
    this.title = "";
    this.author = "";
    this.date = new Date();
    this.uri = "";

    this.lastEdited = new Date(this.date);
    this.watchedUntil = 0;
    this.transcriptions = new Array<Transcription>();
    this.timestamps = new Array<Timestamp>();
    this.notes = new Array<Note>();

    this.setupProperties();
  }

  setupProperties(): Video {
    Object.defineProperties(this, {
      transcriptions: { enumerable: false, writable: true },
      timestamps: { enumerable: false, writable: true },
      notes: { enumerable: false, writable: true },
    });
    return this;
  }
}
