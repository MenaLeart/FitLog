import React, { useState } from "react";
import { IonPage, IonContent, IonAlert } from "@ionic/react";
import { useHistory } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNavigation from "../components/BottomNavigation";
import "./Profile.css";

const Profile: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.setItem("fitlog_logged_in", "false"); // ← Login-Status zurücksetzen
    history.push("/login");
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={true}>
        <div
          className={`home-container ${
            sidebarOpen && !isMobile ? "sidebar-shifted" : ""
          }`}
        >
          {!isMobile && <Sidebar onToggle={(open) => setSidebarOpen(open)} />}

          <h1 className="welcome-text">Your Profile</h1>

          <div className="grid">
            <div className="box full-width profile-box">
              <h3>Logout</h3>
              <p>Möchtest du dich wirklich ausloggen?</p>
              <button className="buttonsave" onClick={() => setShowAlert(true)}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Logout"}
          message={"Willst du dich wirklich abmelden?"}
          buttons={[
            { text: "Abbrechen", role: "cancel" },
            {
              text: "Logout",
              role: "destructive",
              handler: handleLogout,
            },
          ]}
        />

        {isMobile && <BottomNavigation />}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
