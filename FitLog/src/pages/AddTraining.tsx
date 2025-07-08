import React, { useState, useEffect } from "react";
import { IonPage, IonContent } from "@ionic/react";
import BottomNavigation from "../components/BottomNavigation";
import Sidebar from "../components/Sidebar";
import "./AddTraining.css";
import { useHistory, useLocation } from "react-router-dom";
import { StorageService } from "../services/storageService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AddTraining: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const history = useHistory();
  const query = useQuery();
  const editIndex = query.get("edit");

  const [exercise, setExercise] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");

  useEffect(() => {
    if (editIndex !== null) {
      const entry = StorageService.loadTrainings()[parseInt(editIndex)];
      if (entry) {
        setExercise(entry.exercise);
        setDescription(entry.description || "");
        setWeight(entry.weight?.toString() || "");
        setReps(entry.reps?.toString() || "");
        setSets(entry.sets?.toString() || "");
      }
    }
  }, [editIndex]);

  const handleSave = () => {
    const entry = {
      exercise,
      description,
      weight: weight ? parseFloat(weight) : undefined,
      reps: reps ? parseInt(reps) : undefined,
      sets: sets ? parseInt(sets) : undefined,
      date: new Date().toISOString(),
    };

    if (editIndex !== null) {
      StorageService.updateTraining(parseInt(editIndex), entry);
    } else {
      StorageService.saveTraining(entry);
    }

    history.push("/training");
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
          <h1 className="welcome-text">Add Training</h1>

          <div className="grid">
            <div className="box full-width">
              <label>Exercise</label>
              <input
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
              />

              <label>Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Weight</label>
              <div className="weight-input">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <span>kg</span>
              </div>

              <div className="row">
                <div>
                  <label>Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </div>
                <div>
                  <label>Sets</label>
                  <input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                  />
                </div>
              </div>

              <button className="buttonsave" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>

        {isMobile && <BottomNavigation />}
      </IonContent>
    </IonPage>
  );
};

export default AddTraining;
