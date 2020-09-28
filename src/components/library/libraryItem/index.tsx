import React from "react";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Row,
  Col,
  SplitButton,
  Dropdown,
  Modal,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";

interface Props {
  source: string;
  title: string;
  notesCounter: number;
  id?: number;
  lastEditDate: string;
  resumeVideo: () => void;
  deleteVideo: () => void;
}
interface State {
  modalShow: boolean;
}

export default class libraryItem extends React.Component<Props, State> {
  constructor(public props: Props) {
    super(props);
    this.state = {
      modalShow: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  showModal() {
    this.setState({ modalShow: true });
  }
  handleClose() {
    this.setState({ modalShow: false });
  }
  handleDelete() {
    this.setState({ modalShow: false });
    this.props.deleteVideo();
  }
  render() {
    return (
      <div>
        <div className="video-item">
          {/* set Row margin-bottom: -4px; */}
          <Row className="video-row">
            <Col md="4">
              <video
                className="video"
                poster="//vjs.zencdn.net/v/oceans.png"
                controls
              ></video>
            </Col>
            <Col md="3" className="title">
              <p className="title-notes">
                <strong>{this.props.title}</strong>
              </p>
            </Col>
            <Col md={{ span: 3 }} className="notes">
              <p className="notes-icon">
                <FontAwesomeIcon icon={faCommentAlt} size="lg" />
              </p>
              <p className="title-notes">
                <strong>{this.props.notesCounter}</strong>
              </p>
            </Col>
            <Col md={{ span: 2 }} className="actions">
              <SplitButton
                id={this.props.id !== undefined ? this.props.id : 1}
                variant="secondary"
                title="Actions"
              >
                <Dropdown.Item
                  onClick={() => this.props.resumeVideo()}
                  eventKey="1"
                >
                  Resume
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.showModal()} eventKey="2">
                  Delete
                </Dropdown.Item>
              </SplitButton>
            </Col>
          </Row>
        </div>
        <Row>
          <Col className="col-last-edited-date">
            <div className="div-last-edited-date">
              <span style={{ color: "#c7c7c7" }}>
                Last edited:{this.props.lastEditDate}
              </span>
            </div>
          </Col>
        </Row>
        <Modal
          show={this.state.modalShow}
          animation={false}
          onHide={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Video Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete?</Modal.Body>
          <Modal.Footer className="modal-footer">
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
