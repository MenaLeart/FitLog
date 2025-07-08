import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  useIonViewWillEnter,
  IonAlert,
} from "@ionic/react";
import BottomNavigation from "../components/BottomNavigation";
import Sidebar from "../components/Sidebar";
import "./Training.css";
import { StorageService, TrainingEntry } from "../services/storageService";
import { useHistory } from "react-router-dom";

const Training: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const history = useHistory();

  useIonViewWillEnter(() => {
    const data = StorageService.loadTrainings();
    setTrainings(data.reverse());
  });

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const originalIndex = trainings.length - 1 - deleteIndex;
      StorageService.deleteTraining(originalIndex);
      const updated = StorageService.loadTrainings().reverse();
      setTrainings(updated);
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
          <h1 className="welcome-text">Your Training</h1>

          <div className="grid">
            <div
              className="box full-width addtraining"
              onClick={() => history.push("/addtraining")}
            >
              <span className="addtraining-text">+ Add new training</span>
            </div>

            {trainings.length === 0 ? (
              <div className="no-training-text">No training entries yet.</div>
            ) : (
              trainings.map((entry, index) => (
                <div
                  className="box clickable training-box full-width"
                  key={index}
                >
                  <div
                    className="training-content"
                    onClick={() =>
                      history.push(
                        `/addtraining?edit=${trainings.length - 1 - index}`
                      )
                    }
                  >
                    <div className="training-header">
                      <h3>{entry.exercise}</h3>
                      <span className="training-date">
                        {new Date(entry.date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p>{entry.description}</p>
                    <div className="training-tags">
                      {entry.weight !== undefined && (
                        <span className="tag">{entry.weight}kg</span>
                      )}
                      {entry.reps !== undefined && (
                        <span className="tag">{entry.reps} reps</span>
                      )}
                      {entry.sets !== undefined && (
                        <span className="tag">{entry.sets} sets</span>
                      )}
                    </div>
                  </div>
                  <div
                    className="delete-icon"
                    onClick={() => setDeleteIndex(index)}
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
          message={"Willst du dieses Training wirklich löschen?"}
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

export default Training;
