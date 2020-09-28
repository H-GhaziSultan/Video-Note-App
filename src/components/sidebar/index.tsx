import * as React from "react";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export interface Props {
  navStatus?: boolean;
}

interface State {
  currentNavStatus: boolean;
}

class SidebarComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { currentNavStatus: props.navStatus || false };
  }

  toggleNav(e: any) {
    console.log("click status", this.state.currentNavStatus);
    this.state.currentNavStatus
      ? this.setState({ currentNavStatus: false })
      : this.setState({ currentNavStatus: true });

    e.target.classList.toggle("toggleNav");
    //console.log(e.target.className.baseVal);
  }
  render() {
    return (
      <div
        id="sidebar-wrapper"
        className={`bg-light border-right ${
          this.state.currentNavStatus ? "sidebarAnimClose" : "sidebarAnimOpen"
        }`}
      >
        <Nav className="list-group list-group-flush">
          <div className="navTop">
            <div className="sidebar-heading">Video Note App</div>
            <FontAwesomeIcon
              onClick={(e) => this.toggleNav(e)}
              icon={faBars}
              className="closeBtn"
            />
          </div>
          <Nav.Link
            className="list-group-item list-group-item-action bg-light"
            href="/"
          >
            Dashboard
          </Nav.Link>
          <Nav.Link
            className="list-group-item list-group-item-action bg-light"
            href="/export"
          >
            Export
          </Nav.Link>
          <Nav.Link
            className="list-group-item list-group-item-action bg-light"
            href="/import"
          >
            Import
          </Nav.Link>
          <Nav.Link
            className="list-group-item list-group-item-action bg-light"
            href="/library"
          >
            Library
          </Nav.Link>
          <Nav.Link
            className="list-group-item list-group-item-action bg-light"
            href="/login"
          >
            Login
          </Nav.Link>
          <Nav.Link
            className="list-group-item list-group-item-action bg-light"
            href="/upload"
          >
            Upload
          </Nav.Link>
        </Nav>
      </div>
    );
  }
}
export default SidebarComponent;
