import * as React from "react";
import { Card, Form } from "react-bootstrap";

export interface Props {
  // video
  disabled?: boolean;
  transcriptions: Array<string>;
}

interface State {
  disabled: boolean;
  transcriptions: Array<string>;
}

class TranscriptionComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: this.props.disabled || false,
      transcriptions: this.props.transcriptions,
    };
  }

  toggleSwitch = (e: any) => {
    if (this.state.disabled === false) {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  };

  returnTranscripts = () => {
    let transcripts: JSX.Element[] = [];
    for (let i in this.state.transcriptions) {
      transcripts.push(<p>{this.state.transcriptions[i]}</p>);
    }
    return transcripts;
  };

  componentDidMount() {
    this.returnTranscripts();
  }

  render() {
    console.log(this.state.disabled);
    return (
      <div className="ml-5" style={{ width: "450px" }}>
        <Card>
          <Card.Header as="h5" className="d-flex align-items-center">
            <div>
              <div className="custom-control custom-switch">
                <input
                  onClick={(e) => this.toggleSwitch(e)}
                  type="checkbox"
                  className="custom-control-input"
                  id="customSwitch1"
                />
                <label className="custom-control-label" htmlFor="customSwitch1">
                  Translations
                </label>
              </div>
            </div>
            <div style={{ width: "8em", marginLeft: "1em" }}>
              <Form.Label
                className="mr-sm-2"
                htmlFor="inlineFormCustomSelect"
                srOnly
              >
                Preference
              </Form.Label>
              <Form.Control
                disabled={!this.state.disabled}
                as="select"
                className="mr-sm-2"
                id="inlineFormCustomSelect"
                custom
              >
                <option value="0">Choose...</option>
                <option value="1">English</option>
                <option value="2">Deutsch</option>
                <option value="3">Urdu</option>
              </Form.Control>
            </div>
          </Card.Header>
          <Card.Body>{this.returnTranscripts()}</Card.Body>
        </Card>
      </div>
    );
  }
}
export default TranscriptionComponent;
