import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  useIonViewWillEnter,
  IonAlert,
} from "@ionic/react";
import BottomNavigation from "../components/BottomNavigation";
import Sidebar from "../components/Sidebar";
import "./Activity.css";
import { useHistory } from "react-router-dom";
import { StorageService, ActivityEntry } from "../services/storageService";

const Activity: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const history = useHistory();

  useIonViewWillEnter(() => {
    const data = StorageService.loadActivities();
    setActivities(data.reverse());
  });

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const originalIndex = activities.length - 1 - deleteIndex;
      StorageService.deleteActivity(originalIndex);
      const updated = StorageService.loadActivities().reverse();
      setActivities(updated);
      setDeleteIndex(null);
    }
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
          <h1 className="welcome-text">Your Activity</h1>

          <div className="grid">
            <div
              className="box full-width addtraining"
              onClick={() => history.push("/addactivity")}
            >
              <span className="addtraining-text">+ Add new activity</span>
            </div>

            {activities.length === 0 ? (
              <div className="no-training-text">No activities yet.</div>
            ) : (
              activities.map((entry, index) => (
                <div
                  className="box clickable activity-box full-width"
                  key={index}
                  onClick={() =>
                    history.push(
                      `/addactivity?edit=${activities.length - 1 - index}`
                    )
                  }
                >
                  <div className="activity-content">
                    <div className="training-header">
                      <h3>{entry.title}</h3>
                      <span className="activity-date">
                        {new Date(entry.date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p>{entry.description}</p>
                  </div>
                  <div
                    className="delete-activity-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteIndex(index);
                    }}
                  >
                    🗑️
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <IonAlert
          isOpen={deleteIndex !== null}
          onDidDismiss={() => setDeleteIndex(null)}
          header={"Eintrag löschen?"}
          message={"Willst du diese Aktivität wirklich löschen?"}
          buttons={[
            { text: "Abbrechen", role: "cancel" },
            {
              text: "Löschen",
              role: "destructive",
              handler: confirmDelete,
            },
          ]}
        />

        {isMobile && <BottomNavigation />}
      </IonContent>
    </IonPage>
  );
};

export default Activity;
