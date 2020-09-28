import Service from "./Service";
import Transcription from "./Transcription";
import DB from "../appdb";
import TranscriptionSentenceService from "./TranscriptionSentenceService";

export default class TranscriptionService extends Service<Transcription> {
  private static instance: TranscriptionService;

  private constructor() {
    super();
  }

  static getInstance(): TranscriptionService {
    if (!TranscriptionService.instance) {
      TranscriptionService.instance = new TranscriptionService();
    }
    return TranscriptionService.instance;
  }

  async loadAll(): Promise<Array<Transcription>> {
    return DB.transcription.toArray();
  }

  async loadByID(id: number): Promise<Transcription | undefined> {
    return DB.transcription.get(id);
  }

  async loadNavigationProperties(object: Transcription): Promise<any> {
    if (object.id) {
      object.transcriptSentences = await DB.transcriptionSentence
        .where("transcriptionID")
        .equals(object.id)
        .sortBy("startTime");
    }
  }

  async save(object: Transcription): Promise<number> {
    object.id = await DB.transcription.put(object);
    return object.id;
  }

  /**
   * Saves the transcription and all contained sentences
   * @param transcription The transcription to save
   */
  saveWithSentences(transcription: Transcription): Promise<void> {
    if (transcription.id) {
      return DB.transaction(
        "rw",
        DB.transcription,
        DB.transcriptionSentence,
        async () => {
          return await Promise.all(
            transcription.transcriptSentences.map((sentence) =>
              DB.transcriptionSentence.put(sentence)
            )
          ).then((results) => {
            // Delete sentences that no longer exist
            DB.transcriptionSentence
              .where("transcriptionID")
              .equals(transcription.id as number)
              .and((sentence) => results.indexOf(sentence.id as number) === -1)
              .delete();

            DB.transcription.put(transcription);
          });
        }
      );
    } else {
      return Promise.reject();
    }
  }

  async create(): Promise<Transcription> {
    let newTranscription = new Transcription();
    delete newTranscription.id;
    newTranscription.id = await DB.transcription.add(newTranscription);
    return newTranscription;
  }

  async delete(idOrObject: number | Transcription): Promise<void> {
    if (idOrObject instanceof Transcription) {
      if (idOrObject.id) {
        return DB.transcription.delete(idOrObject.id);
      }
    } else {
      return DB.transcription.delete(idOrObject);
    }
  }

  async deleteWithDependencies(transcription: Transcription | number) {
    if (transcription instanceof Transcription) {
      let tss = TranscriptionSentenceService.getInstance();

      await Promise.all(
        transcription.transcriptSentences.map((transcriptionSentence) =>
          tss.delete(transcriptionSentence)
        )
      );

      await this.delete(transcription);
    } else {
      DB.transaction(
        "rw",
        DB.transcription,
        DB.transcriptionSentence,
        async () => {
          await DB.transcriptionSentence
            .where("transcriptionID")
            .equals(transcription)
            .delete();
          await this.delete(transcription);
        }
      );
    }
  }
}
