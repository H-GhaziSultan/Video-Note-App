import * as React from "react";
import { VideoLibrary } from "../../components";
import Video from "../../datamodel/Video";
import VideoService from "../../datamodel/VideoService";
import { Redirect } from "react-router";
import { withRouter } from "react-router-dom";
//import {VideoLibrary} from "../../components";
interface State {
  videos: Video[];
  id?:number
}

class LibraryView extends React.Component<{}, State> {
  constructor(public props: {}) {
    super(props);
    this.state = {
      videos: [],
      id:-1
    };
  }
  componentDidMount() {
    let vs = VideoService.getInstance();
    vs.loadAll().then((videos) => {
      videos.forEach((video) => {
        if (video) {
          vs.loadNavigationProperties(video);
        }
        return video;
      });
      this.setState({ videos: videos });
    });
  }
  deleteVideo = async (video: Video) => {
    let vs = VideoService.getInstance();
    await vs.deleteWithDependencies(video);
    vs.loadAll().then((videos) => {
      videos.forEach((video) => {
        if (video) {
          vs.loadNavigationProperties(video);
        }
        return video;
      });
      this.setState({ videos: videos });
    });
  };
  editVideo = (video: Video) => {
    this.setState({id:video.id})
  };
  render() {
    if(this.state.id!==-1){
      const to = { pathname: '/'+this.state.id };
     return <Redirect to={to} />;
    }
   
    return (
      <VideoLibrary
        listOfVideo={this.state.videos}
        videoDelete={this.deleteVideo}
        resumeVideo={this.editVideo}
      />
    );
  }
}

export default LibraryView;
