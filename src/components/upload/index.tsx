import React from "react";
import "./index.scss";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import VideoService from "../../datamodel/VideoService";
import Video from "../../datamodel/Video";

interface State {
  validated: boolean;
  videoName: string;
  author: string;
  uri: string;
  fileName: string;
}

interface ServerResponse {
  uuid: string;
}

export default class UploadFileComponent extends React.Component<{}, State> {
  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      validated: false,
      videoName: "",
      author: "",
      uri: "",
      fileName: "",
    };

    this.fileInput = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let state_change = {};

    switch (name) {
      case "video-name": {
        state_change = { videoName: value };
        break;
      }
      case "author-name": {
        state_change = { author: value };
        break;
      }
      case "uri": {
        state_change = { uri: value };
        break;
      }
    }

    this.setState(state_change);
  }

  handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();
    event.preventDefault();

    const file = event.currentTarget.files?.item(0);

    if (file) {
      this.setState({ fileName: file.name });
    } else {
      this.setState({ fileName: "" });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const form: HTMLFormElement = event.currentTarget;
    const data = new FormData(form);

    const file = data.get("file") as File;
    const file_present = file !== null && file.name !== "";
    const uri_element = form.elements.namedItem("uri") as HTMLInputElement;
    const file_element = form.elements.namedItem("file") as HTMLInputElement;

    if (data.get("uri") === "" && !file_present) {
      uri_element.setCustomValidity("set either file or Link!");
      file_element.setCustomValidity("set either file or Link!");
    } else {
      uri_element.setCustomValidity("");
      file_element.setCustomValidity("");
    }
    this.setState({ validated: true });

    if (form.checkValidity()) {
      const vs = VideoService.getInstance();

      if (this.state.uri !== "") {
        vs.create()
          .then((video: Video) => {
            video.author = this.state.author;
            video.title = this.state.videoName;
            video.uri = this.state.uri;
            return vs.save(video);
          })
          .then((videoID: number) => {
            console.log("Created new video with the ID " + videoID);
            // Navigate to dashboard
          });
      } else {
        this.uploadFile(file)
          .then(async (response) => {
            const uri =
              window.location.origin + "/api/download/" + response.uuid;
            console.log("Upload SUCCESS!");
            console.log(uri);

            let video = await vs.create();
            video.title = this.state.videoName;
            video.author = this.state.author;
            video.uri = uri;

            return vs.save(video);
          })
          .then((videoID: number) => {
            console.log("Created new video with the ID " + videoID);
            // Navigate to dashboard
          })
          .catch((reason) => console.log(reason));
      }
    }
  }

  async uploadFile(file): Promise<ServerResponse> {
    const formData = new FormData();
    formData.append("video", file);

    return fetch("/api/upload", {
      // content-type header should not be specified!
      method: "POST",
      body: formData,
    }).then((response) => response.json());
  }

  render() {
    return (
      <Container id="upload-component" fluid="sm" className="dialog-box">
        <Row>
          <Col className="text-center">
            <h4>Upload a new Video</h4>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={this.handleSubmit}
            >
              <Form.Group controlId="videoname">
                <Form.Label>Video Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Video Name"
                  size="lg"
                  name="video-name"
                  value={this.state.videoName}
                  onChange={this.handleInputChange}
                  required
                  min="3"
                  max="50"
                />
                <Form.Control.Feedback type="invalid">
                  Please choose a video name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="videoauthor">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Author"
                  name="author-name"
                  value={this.state.author}
                  onChange={this.handleInputChange}
                  required
                  min="3"
                  max="50"
                />
                <Form.Control.Feedback type="invalid">
                  Please choose an author.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    type="text"
                    id="link"
                    placeholder="https://"
                    name="uri"
                    value={this.state.uri}
                    onChange={this.handleInputChange}
                    pattern="(https?:\/\/)?(www.)?((youtu(be.com|.be)\/(watch(\?v=|\/)|v\/)?[a-zA-Z_]*)|vimeo.com\/(\d+))}"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a correct YouTube or Vimeo link or select a
                    file to upload!
                  </Form.Control.Feedback>
                </Form.Group>
                <Col xs="2">
                  <p className="text-center big-or">OR</p>
                </Col>
                <Form.Group as={Col}>
                  <Form.Label>File</Form.Label>
                  <Form.File id="file" custom>
                    <Form.File.Input
                      name="file"
                      accept="video/*"
                      ref={this.fileInput}
                      onChange={this.handleFileChange}
                    />
                    <Form.File.Label>
                      {this.state.fileName
                        ? this.state.fileName
                        : "Select a video to upload!"}
                    </Form.File.Label>
                    <Form.Control.Feedback type="invalid">
                      Please select a file to upload or enter a correct YouTube
                      or Vimeo link!
                    </Form.Control.Feedback>
                  </Form.File>
                </Form.Group>
              </Form.Row>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
