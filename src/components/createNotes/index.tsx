import React from "react";
import "./index.scss";
import { Button, Card, Form } from "react-bootstrap";
import Creator from "../../datamodel/Creator";
import NoteService from "../../datamodel/NoteService";
import TimestampService from "../../datamodel/TimestampService";
// Component needs id, time
// returns a newNote in the note prop can be accessed like {(note) => this.function(note)}
// buttonClick can be used to trigger on click of the component

export interface propsInterface {
  time: number;
  timeUpdateFunction: () => void;
  onNoteCreate: (Note) => void;
  creator?: Creator;
}

interface state {
  showInput: boolean;
  textArea: string;
}

export default class CreateNotesComponent extends React.Component<
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
    };

    this.noteService = NoteService.getInstance();
    this.timestampService = TimestampService.getInstance();
  }

  async newCreateNote(
    startTime: number,
    content: string,
    videoID?: number,
    color?: string,
    endTime?: number
  ) {
    let note = await this.noteService.create().then((note) => {
      note.text = content;
      return note;
    });

    let timestamp = await this.timestampService.create().then((timestamp) => {
      timestamp.note = note;
      timestamp.time = startTime;
      note.startTimestamp = timestamp;
      note.endTimestamp = timestamp;
      timestamp.creator = this.props.creator
        ? this.props.creator
        : timestamp.creator;
      return timestamp;
    });

    if (endTime) {
      let endTimestamp = await this.timestampService
        .create()
        .then((timestamp) => {
          timestamp.note = note;
          timestamp.time = endTime;
          note.endTimestamp = timestamp;
          timestamp.creator = this.props.creator
            ? this.props.creator
            : timestamp.creator;
          return timestamp;
        });
      await this.timestampService.save(endTimestamp);
    }

    await this.noteService.save(note);
    await this.timestampService.save(timestamp);

    this.setState({ showInput: false, textArea: "" });
    this.props.onNoteCreate(note);
  }

  showInputField(show: boolean) {
    this.setState({ showInput: show, textArea: "" });
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ textArea: e.target.value });
  };

  handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      this.newCreateNote(this.props.time, this.state.textArea);
    }
  };

  render() {
    let inputField: any;
    if (this.state.showInput) {
      inputField = (
        <Card className="noteCard">
          <Card.Body>
            <Form>
              <Form.Control
                className="textarea"
                as="textarea"
                rows={3}
                placeholder="Add a note here..."
                value={this.state.textArea}
                onChange={this.onInputChange}
                onKeyDown={this.handleKeyDown}
              />

              <Button
                onClick={() => this.showInputField(false)}
                variant="danger"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  this.newCreateNote(this.props.time, this.state.textArea)
                }
                className="goToTimeButton"
                variant="success"
              >
                Create
              </Button>
            </Form>
          </Card.Body>
        </Card>
      );
    } else {
      inputField = (
        <Card className="noteCard">
          <Card.Body
            onClick={() => {
              this.props.timeUpdateFunction();
              this.showInputField(true);
            }}
          >
            <Card.Text>Add a note here...</Card.Text>
          </Card.Body>
        </Card>
      );
    }
    return <div>{inputField}</div>;
  }
}
