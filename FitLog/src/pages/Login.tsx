import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      history.push("/home");
    } else {
      alert("Bitte E-Mail und Passwort eingeben");
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
                Dont have an account?{" "}
                <a href="/signup">
                  <strong>Sign up</strong>
                </a>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
