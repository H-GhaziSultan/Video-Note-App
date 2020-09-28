import * as React from "react";
import video from "../../../node_modules/@types/video.js";

export interface Props {
  // video
  enthusiasmLevel?: number;
}

interface State {
  timestamp: number;
}

class VideoComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { timestamp: 0 };
  }

  render() {
    return (
      <video
        id="my-player"
        className="video-js"
        controls
        preload="auto"
        poster="//vjs.zencdn.net/v/oceans.png"
        data-setup="{}"
        crossOrigin="anonymous"
      >
        <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
        <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
        <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>
        <track
          kind="captions"
          src="//gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt"
          srcLang="en"
          label="English"
          default
        ></track>
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a
            href="http://videojs.com/html5-video-support/"
            target="_blank"
            rel="noopener noreferrer"
          >
            supports HTML5 video
          </a>
        </p>
      </video>
    );
  }
}
export default VideoComponent;
