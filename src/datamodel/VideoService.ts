import Video from "./Video";
import DB from "../appdb";
import NoteService from "./NoteService";
import Service from "./Service";
import Note from "./Note";
import Transcription from "./Transcription";
import Timestamp from "./Timestamp";
import TranscriptionService from "./TranscriptionService";
import TimestampService from "./TimestampService";

export default class VideoService extends Service<Video> {
  private static instance: VideoService;

  static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  maxID: number | undefined;

  private constructor() {
    super();

    this.maxID = undefined;
  }

  async create(): Promise<Video> {
    let newVideo = new Video();
    delete newVideo.id;
    newVideo.id = await DB.video.add(newVideo);
    this.maxID = newVideo.id;
    return newVideo;
  }

  async loadByID(id: number): Promise<Video | undefined> {
    return DB.video.get(id);
  }

  async loadAll(): Promise<Video[]> {
    return DB.video.toArray();
  }

  async loadNavigationProperties(object: Video) {
    if (object.id) {
      let ns = NoteService.getInstance();
      let trs = TranscriptionService.getInstance();

      let notes = await Promise.all([
        DB.note.where("videoID").equals(object.id).toArray(),
        DB.transcription.where("videoID").equals(object.id).toArray(),
      ]).then((results: [Note[], Transcription[]]) => {
        object.notes = results[0];
        object.transcriptions = results[1];
        return results[0];
      });

      await Promise.all(
        object.transcriptions.map((transcription) =>
          trs.loadNavigationProperties(transcription)
        )
      );

      await Promise.all(
        notes.map((note) => {
          return ns.loadNavigationProperties(note);
        })
      );

      object.timestamps = notes
        .flatMap((note) => [note.startTimestamp, note.endTimestamp]) // get Timestamps from notes
        .filter((timestamp) => timestamp !== undefined) // filter out undefined
        .filter((value, index, array) => {
          return index === array.indexOf(value);
        }) as Timestamp[]; // Distinct and let the compiler know the correct type after removal of undefined
    }
  }

  async save(object: Video): Promise<number> {
    object.id = await DB.video.put(object);
    return object.id;
  }

  async delete(idOrObject: number | Video): Promise<void> {
    if (idOrObject instanceof Video) {
      if (idOrObject.id) {
        return DB.video.delete(idOrObject.id);
      }
    } else {
      return DB.video.delete(idOrObject);
    }
  }

  async deleteWithDependencies(video: Video | number): Promise<void> {
    if (video instanceof Video) {
      let trs = TranscriptionService.getInstance();
      let ns = NoteService.getInstance();
      let ts = TimestampService.getInstance();

      await Promise.all([
        Promise.all(
          video.transcriptions.map((transcription) => trs.delete(transcription))
        ),
        Promise.all(video.notes.map((note) => ns.delete(note))),
        Promise.all(video.timestamps.map((timestamp) => ts.delete(timestamp))),
      ]);

      await this.delete(video);
    } else {
      DB.transaction(
        "rw",
        DB.video,
        DB.transcription,
        DB.transcriptionSentence,
        DB.timestamp,
        DB.note,
        async () => {
          let transcriptions = await DB.transcription
            .where("videoID")
            .equals(video)
            .keys();

          await DB.transcriptionSentence
            .where("transcriptionID")
            .anyOf(transcriptions)
            .delete();

          await DB.transcription.where("videoID").equals(video).delete();
          await DB.note.where("videoID").equals(video).delete();
          await DB.timestamp.where("videoID").equals(video).delete();

          await this.delete(video);
        }
      );
    }
  }

  /*saveWithReferences(object: Video): Promise<void> {
    return DB.transaction(
      "rw",
      DB.video,
      DB.note,
      DB.timestamp,
      DB.transcription,
      async () => {
        // Add or update our selves. If add, record this.id.
        await this.save(object);

        // Save all navigation properties (arrays of emails and phones)
        // Some may be new and some may be updates of existing objects.
        // put() will handle both cases.
        // (record the result keys from the put() operations into emailIds and phoneIds
        //  so that we can find local deletes)

        let ns = NoteService.getInstance();
        let ts = TimestampService.getInstance();
        let tc = TranscriptionService.getInstance();

        let [noteIDs, timestampIDs, transcriptionIDs] = await Promise.all([
          Promise.all(object.notes.map((note) => ns.save(note))),
          Promise.all(object.timestamps.map((timestamp) => ts.save(timestamp))),
          Promise.all(
            object.transcriptions.map((transcription) => tc.save(transcription))
          ),
        ]);

        // Was any email or phone number deleted from out navigation properties?
        // Delete any item in DB that reference us, but is not present
        // in our navigation properties:
        await Promise.all([
          DB.note
            .where("video")
            .equals(object.id!) // references us
            .and((note) => (note.id ? noteIDs.indexOf(note.id) === -1 : false)) // Not anymore in our array
            .delete(),

          DB.timestamp
            .where("video")
            .equals(object.id!)
            .and((timestamp) =>
              timestamp.id ? timestampIDs.indexOf(timestamp.id) === -1 : false
            )
            .delete(),

          DB.transcription
            .where("video")
            .equals(object.id!)
            .and((transcription) =>
              transcription.id
                ? transcriptionIDs.indexOf(transcription.id) === -1
                : false
            )
            .delete(),
        ]);
      }
    );
  }*/
}
