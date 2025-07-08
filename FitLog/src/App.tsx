import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import GoalSettings from "./pages/GoalSettings";
import Training from "./pages/Training";
import AddTraining from "./pages/AddTraining";
import Activity from "./pages/Activity";
import AddActivity from "./pages/AddActivity";
import ProgessPhoto from "./pages/ProgressPhotos";
import Profile from "./pages/Profile";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/training">
            <Training />
          </Route>
          <Route exact path="/addtraining">
            <AddTraining />
          </Route>
          <Route exact path="/activity">
            <Activity />
          </Route>
          <Route exact path="/addactivity">
            <AddActivity />
          </Route>
          <Route exact path="/progressphotos">
            <ProgessPhoto />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route path="/goal-settings" component={GoalSettings} exact />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
