import Service from "./Service";
import Note from "./Note";
import DB from "../appdb";

export default class NoteService extends Service<Note> {
  private static instance: NoteService;

  private constructor() {
    super();
  }

  static getInstance(): NoteService {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService();
    }
    return NoteService.instance;
  }

  async create(): Promise<Note> {
    let newNote = new Note();
    delete newNote.id;
    newNote.id = await DB.note.add(newNote);
    return newNote;
  }

  async loadAll(): Promise<Array<Note>> {
    return DB.note.toArray();
  }

  async loadByID(id: number): Promise<Note | undefined> {
    return DB.note.get(id);
  }

  async loadNavigationProperties(object: Note) {
    if (object.startTimestampID) {
      await DB.timestamp
        .where("id")
        .equals(object.startTimestampID)
        .first()
        .then((result) => {
          if (result) {
            object.startTimestamp = result;
            object.startTimestamp.note = object;
          }
        });

      if (object.endTimestampID) {
        if (object.endTimestampID === object.startTimestampID) {
          object.endTimestamp = object.startTimestamp;
        } else {
          await DB.timestamp
            .where("id")
            .equals(object.endTimestampID)
            .first()
            .then((result) => {
              if (result) {
                object.endTimestamp = result;
                object.endTimestamp.note = object;
              }
            });
        }
      }
    }
  }

  async save(object: Note): Promise<number> {
    object.id = await DB.note.put(object);
    return object.id;
  }

  async delete(idOrObject: number | Note): Promise<void> {
    if (idOrObject instanceof Note) {
      console.log("Deleting note by Object reference");
      if (idOrObject.id) {
        return DB.note.delete(idOrObject.id);
      }
    } else {
      console.log("Deleting note by ID");
      return DB.note.delete(idOrObject);
    }
  }
}
