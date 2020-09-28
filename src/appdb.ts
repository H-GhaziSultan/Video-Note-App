import Dexie from "dexie";
import Note from "./datamodel/Note";
import Timestamp from "./datamodel/Timestamp";
import Transcription from "./datamodel/Transcription";
import Video from "./datamodel/Video";
import TranscriptionSentence from "./datamodel/TranscriptionSentence";

export class VideoNoteAppDatabase extends Dexie {
  note: Dexie.Table<Note, number>;
  timestamp: Dexie.Table<Timestamp, number>;
  transcription: Dexie.Table<Transcription, number>;
  transcriptionSentence: Dexie.Table<TranscriptionSentence, number>;
  video: Dexie.Table<Video, number>;

  constructor() {
    super("VideoNoteApp");

    //
    // Define tables and indexes
    //
    this.version(1).stores({
      note: "++id, _startTimestampID, _endTimestampID, videoID",
      timestamp: "++id, time, creator, _noteID, videoID",
      transcription: "++id, creator, language, videoID",
      transcriptionSentence:
        "++id, startTime, creator, editor, transcriptionID",
      video: "++id",
    });

    this.note = this.table("note");
    this.timestamp = this.table("timestamp");
    this.transcription = this.table("transcription");
    this.transcriptionSentence = this.table("transcriptionSentence");
    this.video = this.table("video");

    // Let's physically map Contact class to contacts table.
    // This will make it possible to call loadEmailsAndPhones()
    // directly on retrieved database objects.
    this.note.mapToClass(Note);
    this.timestamp.mapToClass(Timestamp);
    this.transcription.mapToClass(Transcription);
    this.transcriptionSentence.mapToClass(TranscriptionSentence);
    this.video.mapToClass(Video);

    //Setup properties for every object
    this.note.hook("reading", (note: Note) => note.setupProperties());
    this.video.hook("reading", (video: Video) => video.setupProperties());
    this.timestamp.hook("reading", (timestamp: Timestamp) =>
      timestamp.setupProperties()
    );
    this.transcription.hook("reading", (transcription: Transcription) =>
      transcription.setupProperties()
    );
  }
}

const DB = new VideoNoteAppDatabase();
DB.open();
export default DB;
