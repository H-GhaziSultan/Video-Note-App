import React, { ReactComponentElement } from "react";
import { Button, Card, Dropdown, DropdownButton, Form } from "react-bootstrap";
import Note from "../../datamodel/Note";

interface Props {
  note: Note;
  deleteFunction: () => void;
  playTimestampFunction: (time: number) => void;
  updateNotesFunction: () => void;
  saveNoteFunction: () => void;
  getTimeFunction: () => number;
}

interface State {
  editingMode: boolean;
  textArea: string;
}

export default class NoteComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editingMode: false,
      textArea: this.props.note.text,
    };
  }

  changeTimeToMinutes(seconds: number) {
    let h = Math.floor(seconds / 3600);

    let divisor_for_minutes = seconds % (60 * 60);
    let m: any = Math.floor(divisor_for_minutes / 60);
    let s: any = Math.floor(seconds % 60);
    m.toString().length === 1 ? (m = "0" + m) : void 0;
    s.toString().length === 1 ? (s = "0" + s) : void 0;

    if (h === 0) {
      return m + ":" + s;
    } else {
      return h + ":" + m + ":" + s;
    }
  }

  play() {
    if (this.props.note.startTimestamp)
      this.props.playTimestampFunction(this.props.note.startTimestamp.time);
  }

  //TODO add Label
  addLabel(label: string) {
    return label;
  }

  updateNote() {
    this.props.note.text = this.state.textArea;
    this.setState({ editingMode: false });
    this.props.updateNotesFunction();
    this.props.saveNoteFunction();
  }

  updateTimestamp() {
    let note = this.props.note;
    if (note.startTimestamp) {
      note.startTimestamp.time = this.props.getTimeFunction();
    }
    this.props.updateNotesFunction();
    this.props.saveNoteFunction();
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ textArea: e.target.value });
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      this.updateNote();
    }
  };

  render() {
    let component: ReactComponentElement<"div">;

    if (this.state.editingMode) {
      component = (
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
                onClick={() =>
                  this.setState({
                    editingMode: false,
                    textArea: this.props.note.text,
                  })
                }
                variant="danger"
              >
                Cancel
              </Button>
              <Button
                onClick={() => this.updateNote()}
                className="goToTimeButton"
                variant="success"
              >
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
      );
    } else {
      component = (
        <Card className="noteCard">
          <Card.Body>
            <div className="time">
              {this.props.note.startTimestamp &&
                this.changeTimeToMinutes(this.props.note.startTimestamp.time)}
            </div>
            <Card.Text
              onClick={() => {
                this.setState({ editingMode: true });
              }}
            >
              {this.props.note.text}
            </Card.Text>
            <DropdownButton
              className="goToTimeButton"
              id="dropdown-basic-button"
              title=""
              variant="light"
            >
              <Dropdown.Item
                onClick={() => {
                  this.setState({ editingMode: true });
                }}
              >
                Change Text
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.updateTimestamp()}>
                Change Timestamp
              </Dropdown.Item>
              <Dropdown.Item onClick={this.props.deleteFunction}>
                Delete
              </Dropdown.Item>
              <Dropdown.Item>Add Label</Dropdown.Item>
            </DropdownButton>
            <Button
              className="goToTimeButton"
              onClick={() => this.play()}
              variant="link"
            >
              Play
            </Button>
          </Card.Body>
        </Card>
      );
    }

    return component;
  }
}
