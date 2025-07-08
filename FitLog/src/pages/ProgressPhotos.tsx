import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonToast,
  IonAlert,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import BottomNavigation from "../components/BottomNavigation";
import Sidebar from "../components/Sidebar";
import "./ProgressPhotos.css";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

interface ProgressPhoto {
  date: string;
  base64: string;
}

const ProgressPhotos: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useIonViewWillEnter(() => {
    const saved = localStorage.getItem("fitlog_photos");
    if (saved) {
      setPhotos(JSON.parse(saved));
    } else {
      setPhotos([]);
    }
  });

  const savePhotos = (updated: ProgressPhoto[]) => {
    localStorage.setItem("fitlog_photos", JSON.stringify(updated));
    setPhotos(updated);
  };

  const handleTakePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      const base64 = `data:image/${image.format};base64,${image.base64String}`;
      const newPhoto: ProgressPhoto = {
        date: new Date().toISOString(),
        base64,
      };
      const updated = [newPhoto, ...photos];
      savePhotos(updated);
      setShowToast(true);
    } catch (error) {
      console.error("Fotoaufnahme abgebrochen oder fehlgeschlagen", error);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = [...photos];
      updated.splice(deleteIndex, 1);
      savePhotos(updated);
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
          {!isMobile && <Sidebar onToggle={setSidebarOpen} />}

          <h1 className="welcome-text">Progress photos</h1>

          {photos.length === 0 ? (
            <>
              <div className="no-training-text">No progress photos yet.</div>
              <div className="new-picture-button-center">
                <button
                  className="new-picture-outline-button centered"
                  onClick={handleTakePhoto}
                >
                  New Picture
                </button>
              </div>
            </>
          ) : (
            <div className="photo-list">
              {photos.map((photo, idx) => (
                <div key={idx} className="photo-entry">
                  <div className="photo-header-line">
                    <div className="photo-date">{formatDate(photo.date)}</div>
                    {idx === 0 && (
                      <button
                        className="new-picture-outline-button"
                        onClick={handleTakePhoto}
                      >
                        New Picture
                      </button>
                    )}
                  </div>
                  <hr className="photo-full-divider" />
                  <div className="photo-wrapper">
                    <img
                      src={photo.base64}
                      alt={`Progress ${idx}`}
                      className="progress-photo"
                    />
                    <IonIcon
                      icon={trashOutline}
                      className="delete-photo-icon"
                      onClick={() => setDeleteIndex(idx)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isMobile && <BottomNavigation />}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Foto erfolgreich gespeichert"
          duration={1500}
        />

        <IonAlert
          isOpen={deleteIndex !== null}
          onDidDismiss={() => setDeleteIndex(null)}
          header={"Bild löschen?"}
          message={"Willst du dieses Foto wirklich löschen?"}
          buttons={[
            { text: "Abbrechen", role: "cancel" },
            {
              text: "Löschen",
              role: "destructive",
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProgressPhotos;
