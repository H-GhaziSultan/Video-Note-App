import * as React from "react";
import {
  NoteListComponent,
  TranscriptionComponent,
  VideoPlayerComponent,
} from "../../components";
import "./index.scss";

export interface Props {
  // video
  name: string;
}

interface State {
  timestamp: number;
  startTime: number;
  playerSettings: any;
  transcriptions?: Array<string>;
}

class DashboardView extends React.Component<Props, State> {
  constructor(props: Props, public video: any) {
    super(props);
    this.state = {
      timestamp: 0,
      startTime: 0,
      playerSettings: {
        autoplay: false,
        controls: true,
        preload: "auto",
        width: 700,
        youtube: {},
        sources: {
          src: "https://www.youtube.com/watch?v=z9yKRpeFOtE",
          type: "video/youtube",
        },
      },
    };
  }

  // Common functions

  updateTimeStamp = () => {
    //update video time
    let currentTime = this.video.getTime();
    this.setState({ timestamp: currentTime });
  };

  getTime = () => this.video.getTime();

  playTimeStamp = (time: number) => {
    this.video.goToTime(time);
    this.video.player.play();
  };

  updateTranscriptions = () => {
    //let transcript1 = new Transcriptions( Transcriptions.prototype.video = {"adam","date", "id"}, "paul", "en", ["This is a test"], 1);
    return [
      "Lorem ipsum dolor sit amet,",
      "consectetur adipiscing elit.",
      "Sed elementum elit sit",
      "amet augue blandit,",
      "in faucibus diam varius.",
    ];
  };

  render() {
    //const { name } = this.props;
    return (
      <div id="dashboard" className="d-flex flex-column mt-5">
        <div className="d-flex justify-content-center">
          <div className="section">
            <VideoPlayerComponent
              playerSettings={this.state.playerSettings}
              ref={(node) => (this.video = node)}
              startTime={this.state.startTime}
            />
            <NoteListComponent
              timestamp={this.state.timestamp}
              playTimestampFunction={this.playTimeStamp}
              updateTimestampFunction={this.updateTimeStamp}
              getTimeFunction={this.getTime}
            />
          </div>
          <div className="section">
            <TranscriptionComponent
              transcriptions={this.updateTranscriptions()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardView;
