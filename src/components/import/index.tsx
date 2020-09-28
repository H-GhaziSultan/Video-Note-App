import React from "react";
import { importDB } from "dexie-export-import";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import CryptoJS from "crypto-js";
import Form from "react-bootstrap/Form";
import "./index.scss";
import Button from "react-bootstrap/Button";
import bsCustomFileInput from "bs-custom-file-input";
import DB from "../../appdb";
interface State {
  decryptKey: string;
  validated: boolean;
  fileContent: any;
  modalShow: boolean;
  modalBody: string;
  modalHeading: string;
  theDivKey: number;
  fileName: string | undefined;
  fileFeedbackClass: string;
}

export default class ImportDBComponent extends React.Component<{}, State> {
  constructor(public props: {}) {
    super(props);
    this.state = {
      decryptKey: "",
      validated: false,
      fileContent: "",
      modalShow: false,
      modalBody: "",
      modalHeading: "",
      theDivKey: Date.now(),
      fileName: "choose file",
      fileFeedbackClass: "file-feedback-div",
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.decryptData = this.decryptData.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    bsCustomFileInput.init();
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
    this.setState({ decryptKey: event.target.value });
  }
  async handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();
    event.preventDefault();
    var files = event.currentTarget.files;
    var file = files?.item(0);
    if (file !== null && file !== undefined) {
      this.setState({ fileName: file?.name.toString() });
      const filecontent = await this.readFileAsText(file);
      this.setState({ fileContent: filecontent });
      this.setState({ fileFeedbackClass: "file-feedback-div" });
    } else {
      this.setState({ fileName: "choose file" });
      this.setState({ fileContent: "" });
      this.setState({ fileFeedbackClass: "file-feedback-div-show" });
    }
  }
  async decryptData(event: any) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      var decryptedData = "";
      try {
        //Decrypting data
        var bytes = CryptoJS.AES.decrypt(
          this.state.fileContent,
          this.state.decryptKey
        );
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const blob = new Blob([decryptedData], { type: "application/json" });

        //Importing the data to Database
        await importDB(blob);

        this.setState({ modalBody: "your data imported successfully" });
        this.setState({ modalHeading: "Data imported successfully" });
        this.setState({ modalShow: true });
        this.setState({ validated: false });
        this.setState({ theDivKey: Date.now() });
        this.setState({ fileName: "choose file" });
        this.setState({ fileContent: "" });
        //we need to open the database connection because after import dexiejs closes the database connection
        DB.open().catch(function (err) {
          alert("Failed to open db");
        });
      } catch (Error) {
        this.setState({
          modalBody:
            "Your password is not correct. Please enter correct password",
        });
        this.setState({ modalHeading: "Error" });
        this.setState({ modalShow: true });
      }
    } else {
      this.setState({ validated: true });
      if (this.state.fileContent === "") {
        this.setState({ fileFeedbackClass: "file-feedback-div-show" });
      }
    }
  }

  handleClose() {
    this.setState({ modalShow: false });
  }

  render() {
    return (
      <div id="import-div" key={this.state.theDivKey}>
        <h4 id="import-form-heading">Import your data</h4>
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.decryptData}
        >
          <Form.Group as={Col} md={{ span: 8, offset: 2 }}>
            <Form.Label>Password*</Form.Label>
            <Form.Control
              type="password"
              onChange={this.handlePasswordChange}
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={{ span: 8, offset: 2 }}>
            <Form.Label>Select Encrypted file*</Form.Label>
            <div className="custom-file">
              <input
                id="inputGroupFileImport"
                onChange={(e) => this.handleFileSelect(e)}
                required
                type="file"
                className="custom-file-input"
              />
              <label
                className="custom-file-label"
                htmlFor="inputGroupFileImport"
              >
                {this.state.fileName}
              </label>
            </div>
            <div className={this.state.fileFeedbackClass}>
              Please select a file.
            </div>
          </Form.Group>
          <Row>
            <Col className="text-center">
              <Button variant="primary" type="submit">
                {" "}
                Decrypt Notes
              </Button>
            </Col>
          </Row>
        </Form>

        <Modal
          show={this.state.modalShow}
          animation={false}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalHeading}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalBody}</Modal.Body>
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
