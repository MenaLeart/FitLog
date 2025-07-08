import React, { useEffect, useState } from "react";
import { IonPage, IonContent } from "@ionic/react";
import BottomNavigation from "../components/BottomNavigation";
import Sidebar from "../components/Sidebar";
import { StorageService } from "../services/storageService";
import "./GoalSettings.css";

const GoalSettings: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const [, setSidebarOpen] = useState(false);

  const [goalWeight, setGoalWeight] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const goal = StorageService.loadGoal();
    if (goal) setGoalWeight(goal.targetWeight.toString());

    const weights = StorageService.loadWeights();
    if (weights.length > 0) {
      setCurrentWeight(weights[weights.length - 1].weight.toString());
    }
  }, []);

  const saveGoal = () => {
    if (!goalWeight || !currentWeight) return;
    try {
      StorageService.saveGoal({ targetWeight: parseFloat(goalWeight) });
      StorageService.addWeight({
        date: new Date().toISOString(),
        weight: parseFloat(currentWeight),
      });
      setEditMode(false);
      setErrorMessage("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setErrorMessage("Failed to save the goal.");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={true}>
        <div className="goal-settings-wrapper">
          {!isMobile && <Sidebar onToggle={setSidebarOpen} />}

          <div className="goal-settings-inner">
            <h1 className="goal-settings-title">Edit Goal</h1>

            <div className="goal-settings-box">
              <h3>Your Goal</h3>

              <div className="goal-settings-values">
                <div>
                  <p>Currently</p>
                  {editMode ? (
                    <input
                      type="number"
                      className="goal-settings-edit-input"
                      placeholder="kg"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                    />
                  ) : (
                    <button className="goal-settings-value-btn">
                      {currentWeight ? `${currentWeight}kg` : "?kg"}
                    </button>
                  )}
                </div>

                <div className="goal-settings-arrow">→</div>

                <div>
                  <p>Goal</p>
                  {editMode ? (
                    <input
                      type="number"
                      className="goal-settings-edit-input"
                      placeholder="kg"
                      value={goalWeight}
                      onChange={(e) => setGoalWeight(e.target.value)}
                    />
                  ) : (
                    <button className="goal-settings-value-btn">
                      {goalWeight ? `${goalWeight}kg` : "?kg"}
                    </button>
                  )}
                </div>
              </div>

              <div className="goal-settings-images">
                <img src="/Fat.png" alt="Fat" className="goal-settings-image" />
                <img
                  src="/Thin.png"
                  alt="Thin"
                  className="goal-settings-image goal-settings-flipped"
                />
              </div>

              {showSuccess && (
                <div className="goal-settings-success">
                  ✅ Goal successfully saved!
                </div>
              )}
              {errorMessage && (
                <div className="goal-settings-error">{errorMessage}</div>
              )}

              <button
                className="goal-settings-button"
                onClick={editMode ? saveGoal : () => setEditMode(true)}
              >
                {editMode ? "Save" : "Change goal"}
              </button>
            </div>
          </div>
        </div>

        {isMobile && <BottomNavigation />}
      </IonContent>
    </IonPage>
  );
};

export default GoalSettings;
