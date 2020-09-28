import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { exportDB } from "dexie-export-import";
import CryptoJS from "crypto-js";
import download from "downloadjs";
import "./index.scss";
import VideoService from "../../datamodel/VideoService";
import TranscriptionService from "../../datamodel/TranscriptionService";
import TranscriptionSentenceService from "../../datamodel/TranscriptionSentenceService";
import NoteService from "../../datamodel/NoteService";
import TimestampService from "../../datamodel/TimestampService";
import DB from "../../appdb";

interface State {
  encryptKey: string;
  validated: boolean;
  modalShow: boolean;
}

export default class ExportDBComponent extends React.Component<{}, State> {
  constructor(public props: {}) {
    super(props);
    this.state = {
      encryptKey: "",
      validated: false,
      modalShow: false,
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.Export = this.Export.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  async Export(event: any) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      //Exporting blob object from Indexed Database
      const blob = await exportDB(DB, { prettyJson: true });

      //Reading Blob content using Filereader
      var blob_data = await this.readFileAsText(blob);

      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(blob_data),
        this.state.encryptKey
      ).toString();
      //Downloading the encrypted data by calling download method of download js
      //download(ciphertext, "dexie-export.json", "application/json");
      download(ciphertext, "Exported Data");
      this.setState({ modalShow: true });
    } else {
      this.setState({ validated: true });
    }
  }

  readFileAsText(inputFile: any) {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onerror = () => {
        reject(fileReader.error);
      };

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.readAsText(inputFile);
    });
  }

  handlePasswordChange(event: any) {
    this.setState({ encryptKey: event.target.value });
  }

  handleClose() {
    this.setState({ modalShow: false });
    this.setState({ encryptKey: "" });
    this.setState({ validated: false });
  }

  async tCreation() {
    let vs = VideoService.getInstance();
    let ns = NoteService.getInstance();
    let ts = TimestampService.getInstance();
    let trs = TranscriptionService.getInstance();
    let tss = TranscriptionSentenceService.getInstance();

    let v1 = await vs.create().then((video) => {
      video.title = "Test";
      video.author = "Test Author";

      return video;
    });

    await vs.save(v1);

    let n1 = await ns.create().then((note) => {
      note.text = "Test Text";
      note.videoID = v1.id;
      return note;
    });

    let timestamp = await ts.create().then((timestamp) => {
      timestamp.note = n1;
      n1.startTimestamp = timestamp;
      n1.endTimestamp = timestamp;
      timestamp.videoID = v1.id;
      return timestamp;
    });

    await ns.save(n1);
    await ts.save(timestamp);

    let transcription = await trs.create().then((transcription) => {
      transcription.videoID = v1.id;
      return transcription;
    });

    let sentencePromises = [
      { s: "One", t: 0 },
      { s: "Two", t: 1 },
      { s: "Three", t: 2 },
      { s: "Four", t: 3 },
      { s: "Five", t: 4 },
    ].map((tuple) => {
      return tss.create().then((s) => {
        s.content = tuple.s;
        s.transcriptionID = transcription.id;
        s.startTime = tuple.t;
        return s;
      });
    });

    transcription.transcriptSentences = await Promise.all(sentencePromises);
    await trs.saveWithSentences(transcription);

    console.log(v1);
    console.log(n1);
    console.log(timestamp);
    console.log(transcription);
  }

  async tLoad() {
    let vs = VideoService.getInstance();

    let v1 = await vs.loadByID(1).then((value) => {
      if (value) {
        vs.loadNavigationProperties(value);
      }
      return value;
    });

    let trs = TranscriptionService.getInstance();

    let trans = await trs.loadByID(1).then((trans) => {
      if (trans) {
        trs.loadNavigationProperties(trans);
      }
      return trans;
    });

    console.log(v1);
    console.log(trans);
  }

  async tDelete() {
    let ns = NoteService.getInstance();
    let vs = VideoService.getInstance();

    await ns.delete(1).then(() => {
      console.log("Did delete");
    });

    await vs.deleteWithDependencies(2);
  }

  render() {
    return (
      <div id="export-div">
        <h4 id="exort-form-heading">Export your data</h4>
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.Export}
        >
          <Form.Group as={Col} md={{ span: 8, offset: 2 }}>
            <Form.Control
              type="password"
              value={this.state.encryptKey}
              onChange={this.handlePasswordChange}
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col className="text-center">
              <Button variant="primary" type="submit">
                Export Notes
              </Button>
              <Button onClick={this.tCreation}>TestCreate</Button>
              <Button onClick={this.tLoad}>TestLoad</Button>
              <Button onClick={this.tDelete}>TestDelete</Button>
            </Col>
          </Row>
        </Form>
        <Modal
          show={this.state.modalShow}
          animation={false}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Data exported</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your data has been exported successfully</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
