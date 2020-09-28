import Note from "./Note";
import Creator from "./Creator";

export default class Timestamp {
  // Attributes
  id?: number;
  time: number;
  creator: Creator;
  videoID?: number;

  private _note?: Note;
  private _noteID?: number;

  constructor() {
    this.time = 0.0;
    this.creator = Creator.User;

    this.setupProperties();
  }

  setupProperties(): Timestamp {
    Object.defineProperties(this, {
      _note: { enumerable: false, writable: true },
    });
    return this;
  }

  get note(): Note | undefined {
    return this._note;
  }

  set note(value: Note | undefined) {
    this._note = value;
    this._noteID = value ? value.id : undefined;
  }

  get noteID(): number | undefined {
    return this._noteID;
  }
}
