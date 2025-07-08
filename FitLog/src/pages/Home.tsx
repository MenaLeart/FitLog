import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import {
  flameOutline,
  eggOutline,
  cameraOutline,
  imagesOutline,
} from "ionicons/icons";
import Sidebar from "../components/Sidebar";
import BottomNavigation from "../components/BottomNavigation";
import {
  StorageService,
  GoalEntry,
  WeightEntry,
} from "../services/storageService";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./Home.css";

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [goal, setGoal] = useState<GoalEntry | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [startWeight, setStartWeight] = useState<number | null>(null);
  const isMobile = window.innerWidth <= 768;
  const history = useHistory();

  const currentWeight =
    weightEntries.length > 0
      ? weightEntries[weightEntries.length - 1].weight
      : null;

  useIonViewWillEnter(() => {
    const g = StorageService.loadGoal();
    setGoal(g);

    const weights = StorageService.loadWeights();
    setWeightEntries(weights.slice(-5));

    const savedStart = localStorage.getItem("fitlog_startWeight");
    if (savedStart) {
      setStartWeight(parseFloat(savedStart));
    } else if (weights.length > 0) {
      const first = weights[0].weight;
      localStorage.setItem("fitlog_startWeight", first.toString());
      setStartWeight(first);
    }
  });

  const handleGoalClick = () => {
    history.push("/goal-settings");
  };

  const handleTakePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        const base64 = `data:image/${image.format};base64,${image.base64String}`;
        const newPhoto = {
          date: new Date().toISOString(),
          base64,
        };

        const saved = localStorage.getItem("fitlog_photos");
        const current = saved ? JSON.parse(saved) : [];
        const updated = [newPhoto, ...current];
        localStorage.setItem("fitlog_photos", JSON.stringify(updated));

        history.push("/progressphotos");
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const calculateWeightProgress = () => {
    if (!goal?.targetWeight || !currentWeight || !startWeight) return 0;
    const totalDiff = startWeight - goal.targetWeight;
    const currentDiff = startWeight - currentWeight;
    if (totalDiff === 0) return 100;
    return Math.min(Math.max((currentDiff / totalDiff) * 100, 0), 100);
  };

  const calculateCalorieDeficit = (): number => {
    if (!goal?.targetWeight || !currentWeight) return 0;
    const difference = currentWeight - goal.targetWeight;

    let deficit = 500;
    if (difference >= 30) deficit = 900;
    else if (difference >= 20) deficit = 800;
    else if (difference >= 10) deficit = 700;
    else if (difference >= 5) deficit = 600;

    const baseNeed = goal.targetWeight * 22 * 1.4;
    return Math.round(baseNeed - deficit);
  };

  const proteinTarget = currentWeight ? Math.round(currentWeight * 2) : 0;

  return (
    <IonPage>
      <IonContent fullscreen scrollY={true}>
        <div
          className={`home-container ${
            sidebarOpen && !isMobile ? "sidebar-shifted" : ""
          }`}
        >
          {!isMobile && <Sidebar onToggle={(open) => setSidebarOpen(open)} />}

          <h1 className="welcome-text">Hello Leart</h1>

          <div className="home-grid">
            <div className="home-box clickable" onClick={handleGoalClick}>
              <h3>GOALS</h3>
              <div className="goal-item-row">
                <div className="goal-label">Weight</div>
                <div className="goal-value">{goal?.targetWeight ?? "?"}kg</div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${calculateWeightProgress()}%` }}
                />
              </div>
            </div>

            <div className="home-box">
              <h3>Daily</h3>
              <div className="daily-grid">
                <div className="daily-item">
                  <IonIcon icon={flameOutline} className="daily-icon" />
                  <p>{calculateCalorieDeficit()} kcal</p>
                  <span className="daily-label">Ziel-Kalorien</span>
                </div>
                <div className="daily-item">
                  <IonIcon icon={eggOutline} className="daily-icon" />
                  <p>{proteinTarget} g</p>
                  <span className="daily-label">Proteinbedarf</span>
                </div>
              </div>
            </div>

            <div className="home-box">
              <h3>Weight</h3>
              <div className="weight-chart">
                {weightEntries.map((entry, index) => {
                  const previous =
                    index > 0 ? weightEntries[index - 1].weight : entry.weight;
                  const trend =
                    entry.weight < previous
                      ? "down"
                      : entry.weight > previous
                      ? "up"
                      : "same";
                  const barHeight = Math.max(
                    20,
                    Math.min(
                      100,
                      100 - ((startWeight ?? entry.weight) - entry.weight) * 3
                    )
                  );

                  return (
                    <div key={index} className="weight-bar-wrapper">
                      <div
                        className={`weight-bar ${trend}`}
                        style={{ height: `${barHeight}px` }}
                      />
                      <span className="weight-date">
                        {new Date(entry.date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="home-box">
              <h3>Progress Photos</h3>
              <button className="buttonsave" onClick={handleTakePhoto}>
                <IonIcon icon={cameraOutline} style={{ marginRight: 8 }} />
                Take a photo
              </button>
              <button
                className="buttonsave"
                onClick={() => history.push("/progressphotos")}
              >
                <IonIcon icon={imagesOutline} style={{ marginRight: 8 }} />
                View photos
              </button>
            </div>
          </div>
        </div>

        {isMobile && <BottomNavigation />}
      </IonContent>
    </IonPage>
  );
};

export default Home;
