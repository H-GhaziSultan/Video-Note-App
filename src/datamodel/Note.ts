import Timestamp from "./Timestamp";

export default class Note {
  // Attributes
  id?: number;
  text: string;
  creationDate: Date;
  color: string;
  videoID?: number;

  private _startTimestamp?: Timestamp;
  private _endTimestamp?: Timestamp;

  private _startTimestampID?: number;
  private _endTimestampID?: number;

  constructor() {
    this.text = "";
    this.creationDate = new Date();
    this.color = "none";

    this.setupProperties();
  }

  setupProperties(): Note {
    Object.defineProperties(this, {
      _startTimestamp: { enumerable: false, writable: true },
      _endTimestamp: { enumerable: false, writable: true },
    });
    return this;
  }

  get startTimestamp(): Timestamp | undefined {
    return this._startTimestamp;
  }

  set startTimestamp(value: Timestamp | undefined) {
    this._startTimestamp = value;
    this._startTimestampID = value ? value.id : undefined;
  }

  get endTimestamp(): Timestamp | undefined {
    return this._endTimestamp;
  }

  set endTimestamp(value: Timestamp | undefined) {
    this._endTimestamp = value;
    this._endTimestampID = value ? value.id : undefined;
  }

  get startTimestampID(): number | undefined {
    return this._startTimestampID;
  }

  get endTimestampID(): number | undefined {
    return this._endTimestampID;
  }
}
