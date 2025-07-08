import React, { useState, useEffect } from "react";
import { IonPage, IonContent } from "@ionic/react";
import BottomNavigation from "../components/BottomNavigation";
import Sidebar from "../components/Sidebar";
import "./AddActivity.css";
import { StorageService } from "../services/storageService";
import { useHistory, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AddActivity: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const history = useHistory();
  const query = useQuery();
  const editIndex = query.get("edit");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [allExercises, setAllExercises] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const trainings = StorageService.loadTrainings();
    const unique = Array.from(
      new Set(trainings.map((t) => t.exercise).filter(Boolean))
    );
    setAllExercises(unique);
  }, []);

  useEffect(() => {
    if (editIndex !== null) {
      const entry = StorageService.loadActivities()[parseInt(editIndex)];
      if (entry) {
        setTitle(entry.title);
        setDescription(entry.description || "");
        setSelectedExercises(entry.selectedExercises || []);
      }
    }
  }, [editIndex]);

  const toggleExercise = (exercise: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((e) => e !== exercise)
        : [...prev, exercise]
    );
  };

  const handleSave = () => {
    const entry = {
      title,
      description,
      selectedExercises,
      date: new Date().toISOString(),
    };

    if (editIndex !== null) {
      StorageService.updateActivity(parseInt(editIndex), entry);
    } else {
      StorageService.saveActivity(entry);
    }

    history.push("/activity");
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
          <h1 className="welcome-text">Add Activity</h1>

          <div className="grid">
            <div className="box full-width">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Exercise</label>
              <div className="exercise-accordion">
                <div
                  className="day-header"
                  onClick={() => setExpanded(!expanded)}
                >
                  <span style={{ flex: 1 }}></span>
                  <span>{expanded ? "▲" : "▼"}</span>
                </div>

                {expanded && (
                  <div className="exercise-list">
                    {allExercises.map((exercise) => (
                      <div
                        key={exercise}
                        className={`exercise-item ${
                          selectedExercises.includes(exercise) ? "selected" : ""
                        }`}
                        onClick={() => toggleExercise(exercise)}
                      >
                        <span>{exercise}</span>
                        {selectedExercises.includes(exercise) && (
                          <span className="checkmark">✔</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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

export default AddActivity;
