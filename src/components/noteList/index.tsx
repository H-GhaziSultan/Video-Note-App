import React from "react";
import "./index.scss";
import Note from "../../datamodel/Note";
import NoteService from "../../datamodel/NoteService";
import TimestampService from "../../datamodel/TimestampService";
import { CreateNotesComponent } from "../index";
import NoteComponent from "../note";

export interface propsInterface {
  timestamp: number;
  playTimestampFunction: (number) => void;
  updateTimestampFunction: () => void;
  getTimeFunction: () => number;
}

interface state {
  showInput: boolean;
  textArea: string;
  notesArray: Note[];
}

export default class NoteListComponent extends React.Component<
  propsInterface,
  state
> {
  private noteService: NoteService;
  private timestampService: TimestampService;
  constructor(public props: propsInterface) {
    super(props);
    this.state = {
      showInput: false,
      textArea: "",
      notesArray: [],
    };
    this.noteService = NoteService.getInstance();
    this.timestampService = TimestampService.getInstance();
  }

  async getNotes() {
    return this.noteService.loadAll().then(async (notesDB) => {
      await Promise.all(
        notesDB.map((note) => this.noteService.loadNavigationProperties(note))
      );
      notesDB.sort(this.noteSortFunction);
      this.setState({ notesArray: notesDB });
    });
  }

  noteSortFunction(a: Note, b: Note) {
    const timeA: number = a.startTimestamp ? a.startTimestamp.time : 0;
    const timeB: number = b.startTimestamp ? b.startTimestamp.time : 0;

    return timeA - timeB;
  }

  sortedIndex<T>(
    array: Array<T>,
    value: T,
    compareFunction: (a: T, b: T) => number
  ): number {
    let low: number = 0,
      high: number = array.length;

    while (low < high) {
      let mid: number = (low + high) >>> 1;
      if (compareFunction(array[mid], value) < 0) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  addNewNoteToNotesArray(note: Note) {
    const notes = this.state.notesArray;
    const newNoteIndex = this.sortedIndex(notes, note, this.noteSortFunction);
    notes.splice(newNoteIndex, 0, note);
    this.setState({ notesArray: notes });
    console.log(notes);
  }

  updateNotes() {
    this.setState({
      notesArray: this.state.notesArray.sort(this.noteSortFunction),
    });
  }

  saveNote(note: Note) {
    this.noteService.save(note);
    if (note.startTimestamp) this.timestampService.save(note.startTimestamp);
    if (note.endTimestamp && note.endTimestampID !== note.startTimestampID)
      this.timestampService.save(note.endTimestamp);
  }

  //deleteANote
  async deleteNote(note: Note) {
    if (note.id) {
      if (note.startTimestampID) {
        let ts = TimestampService.getInstance();

        await ts.delete(note.startTimestampID);
        if (
          note.endTimestampID &&
          note.endTimestampID !== note.startTimestampID
        )
          await ts.delete(note.endTimestampID);
      }
      this.noteService.delete(note).then(() => {
        let notes = this.state.notesArray;
        notes.splice(notes.indexOf(note), 1);
        this.setState({ notesArray: notes });
      });
    }
  }

  componentDidMount() {
    this.getNotes();
  }

  render() {
    return (
      <div className="notes">
        <CreateNotesComponent
          time={this.props.timestamp}
          timeUpdateFunction={this.props.updateTimestampFunction}
          onNoteCreate={(note: Note) => this.addNewNoteToNotesArray(note)}
        />

        {this.state.notesArray.map((note: Note) => (
          <NoteComponent
            note={note}
            deleteFunction={() => this.deleteNote(note)}
            playTimestampFunction={this.props.playTimestampFunction}
            updateNotesFunction={() => this.updateNotes()}
            saveNoteFunction={() => this.saveNote(note)}
            getTimeFunction={this.props.getTimeFunction}
            key={note.id}
          />
        ))}
      </div>
    );
  }
}
