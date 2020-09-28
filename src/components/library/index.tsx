import React, { FunctionComponent } from "react";
import Library from "./libraryItem/index";
import Video from "../../datamodel/Video";
import { Container, Row, Col } from "react-bootstrap";
import "./index.scss";

interface props {
  resumeVideo: (video: Video) => void;
  videoDelete: (video: Video) => void;
  listOfVideo: Video[];
}
const VideoLibraryComponent: FunctionComponent<props> = (props) => {
  return (
    <Container id="video-component" fluid="sm" className="dialog-box">
      <Row>
        <Col className="text-center">
          <h4>Video Library</h4>
        </Col>
      </Row>
      <div>
        {props.listOfVideo.map((video: Video) => (
          <Library
            key={video.id}
            source={video.uri}
            title={video.title}
            id={video.id}
            lastEditDate={video.lastEdited.toDateString()}
            notesCounter={video.notes !== undefined ? video.notes.length : 0} //video.notes.length
            resumeVideo={() => props.resumeVideo(video)}
            deleteVideo={() => props.videoDelete(video)}
          />
        ))}
      </div>
    </Container>
  );
};
export default VideoLibraryComponent;
