import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonToast,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("fitlog_logged_in");
    if (stored === "true") {
      history.replace("/home");
    }
  }, [history]);

  const handleLogin = () => {
    if (email.trim() && password.trim()) {
      localStorage.setItem("fitlog_logged_in", "true");
      history.replace("/home");
    } else {
      setShowError(true);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-wrapper">
          <img src="/logo.png" alt="FitLog Logo" className="login-logo" />

          <div className="login-card">
            <IonItem className="login-input" lines="none">
              <IonInput
                type="email"
                value={email}
                placeholder="Email Adresse"
                onIonChange={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>

            <IonItem className="login-input" lines="none">
              <IonInput
                type="password"
                value={password}
                placeholder="Passwort"
                onIonChange={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>

            <IonButton
              expand="block"
              onClick={handleLogin}
              className="login-button"
            >
              Login
            </IonButton>

            <div className="signup-link">
              <p>
                Noch kein Konto?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/signup");
                  }}
                >
                  <strong>Registrieren</strong>
                </a>
              </p>
            </div>
          </div>
        </div>

        <IonToast
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          message="Bitte E-Mail und Passwort eingeben"
          duration={2000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
