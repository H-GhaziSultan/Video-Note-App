import Service from "./Service";
import Timestamp from "./Timestamp";
import DB from "../appdb";

export default class TimestampService extends Service<Timestamp> {
  private static instance: TimestampService;

  private constructor() {
    super();
  }

  static getInstance(): TimestampService {
    if (!TimestampService.instance) {
      TimestampService.instance = new TimestampService();
    }
    return TimestampService.instance;
  }

  async loadAll(): Promise<Array<Timestamp>> {
    return DB.timestamp.toArray();
  }

  async loadByID(id: number): Promise<Timestamp | undefined> {
    return DB.timestamp.get(id);
  }

  async loadNavigationProperties(object: Timestamp) {
    if (object.noteID) {
      await DB.note
        .where("id")
        .equals(object.noteID)
        .first()
        .then((result) => {
          if (result) {
            object.note = result;
          }
        });
    }
  }

  async save(object: Timestamp): Promise<number> {
    object.id = await DB.timestamp.put(object);
    return object.id;
  }

  async create(): Promise<Timestamp> {
    let newTimestamp = new Timestamp();
    delete newTimestamp.id;
    newTimestamp.id = await DB.timestamp.add(newTimestamp);
    return newTimestamp;
  }

  async delete(idOrObject: number | Timestamp): Promise<void> {
    if (idOrObject instanceof Timestamp) {
      if (idOrObject.id) {
        return DB.timestamp.delete(idOrObject.id);
      }
    } else {
      return DB.timestamp.delete(idOrObject);
    }
  }
}
