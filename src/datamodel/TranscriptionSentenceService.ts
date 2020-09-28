import Service from "./Service";
import DB from "../appdb";
import TranscriptionSentence from "./TranscriptionSentence";

export default class TranscriptionSentenceService extends Service<
  TranscriptionSentence
> {
  private static instance: TranscriptionSentenceService;

  private constructor() {
    super();
  }

  static getInstance(): TranscriptionSentenceService {
    if (!TranscriptionSentenceService.instance) {
      TranscriptionSentenceService.instance = new TranscriptionSentenceService();
    }
    return TranscriptionSentenceService.instance;
  }

  async loadAll(): Promise<Array<TranscriptionSentence>> {
    return DB.transcriptionSentence.toArray();
  }

  async loadByID(id: number): Promise<TranscriptionSentence | undefined> {
    return DB.transcriptionSentence.get(id);
  }

  async loadNavigationProperties(object: TranscriptionSentence): Promise<any> {}

  async save(object: TranscriptionSentence): Promise<number> {
    object.id = await DB.transcriptionSentence.put(object);
    return object.id;
  }

  async create(): Promise<TranscriptionSentence> {
    let newTranscription = new TranscriptionSentence();
    delete newTranscription.id;
    newTranscription.id = await DB.transcriptionSentence.add(newTranscription);
    return newTranscription;
  }

  async delete(idOrObject: number | TranscriptionSentence): Promise<void> {
    if (idOrObject instanceof TranscriptionSentence) {
      if (idOrObject.id) {
        return DB.transcriptionSentence.delete(idOrObject.id);
      }
    } else {
      return DB.transcriptionSentence.delete(idOrObject);
    }
  }
}
