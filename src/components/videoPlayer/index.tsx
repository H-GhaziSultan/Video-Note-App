import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";
import "videojs-youtube";
import "@devmobiliza/videojs-vimeo/dist/videojs-vimeo.cjs";
import "./index.scss";

interface props {
  playerSettings: any;
  startTime?: number;
}

interface state {
  timeYoutube: string;
}
export default class VideoPlayerComponent extends React.Component<
  props,
  state
> {
  constructor(props: props, public player: any, public videoNode: any) {
    super(props);
    this.state = {
      timeYoutube: "",
    };
  }
  componentDidMount() {
    // instantiate Video.js
    // checking if video source is youtube and start at start time when given in props
    if (this.props.playerSettings.sources.type === "video/youtube") {
      var youtube = { start: this.props.startTime };
      var playerSettings = this.props.playerSettings;
      playerSettings.youtube = youtube;
      this.player = videojs(
        this.videoNode,
        playerSettings,
        function onPlayerReady() {
          console.log("onPlayerReady");
        }
      );
    } else {
      this.player = videojs(
        this.videoNode,
        this.props.playerSettings,
        function onPlayerReady() {
          console.log("onPlayerReady");
        }
      );
      this.goToTime(this.props.startTime);
    }
    this.player.fluid(true);
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // go to time (in sec) in video
  goToTime(time: number | undefined) {
    if (time !== undefined) {
      this.player.currentTime(time);
    }
  }
  //get the current time of the video
  getTime() {
    if (this.player) {
      this.player.pause();
      return this.player.currentTime();
    }
  }

  // see https://github.com/videojs/video.js/pull/385
  render() {
    return (
      <div className="VideoPlayer">
        <video
          ref={(node) => (this.videoNode = node)}
          className="vjs-matrix video-js vjs-big-play-centered"
          data-setup={this.state.timeYoutube}
        ></video>
      </div>
    );
  }
}
