import React from "react";
import "./app.scss";
import { SidebarComponent } from "./components/";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  DashboardView,
  ExportView,
  ImportView,
  LibraryView,
  LoginView,
  UploadView,
} from "./views";
import { Container } from "react-bootstrap";
// Bootstrap icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

library.add(faTimes);

function App() {
  return (
    <>
      <Container fluid>
        <div className="d-flex" id="wrapper">
          <BrowserRouter>
            <SidebarComponent />
            <div id="page-content-wrapper">
              <Switch>
                <Route path="/export">
                  <ExportView />
                </Route>
                <Route path="/import">
                  <ImportView />
                </Route>
                <Route path="/library">
                  <LibraryView />
                </Route>
                <Route path="/login">
                  <LoginView />
                </Route>
                <Route path="/upload">
                  <UploadView />
                </Route>
                <Route path="/">
                  <DashboardView name="Abrar" />
                </Route>
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </Container>
    </>
  );
}

export default App;
