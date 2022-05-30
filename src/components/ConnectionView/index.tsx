import { IonButton, IonIcon } from "@ionic/react";
import {
  logIn,
  phonePortrait,
  personOutline,
  caretForward,
  backspace,
} from "ionicons/icons";

import { ConnectionViewProps } from "../../types";
import useConnectionView from "./useConnectionView";

import "./index.scss";
import { Input } from "..";

const ConnectionView = (props: ConnectionViewProps) => {
  const {
    errorPhoneNumber,
    errorPseudo,
    warnPseudo,
    phoneNumber,
    pseudo,
    isSignIn,
    showPseudo,
    showBtnValidate,
    showCode,
    code,
    page,
    setPhoneNumber,
    setPseudo,
    signIn,
    setCode,
    hideCode,
    toggleSignIn,
  } = useConnectionView(props);

  if (showCode) {
    return (
      <div className="flex column connection-view">
        <div className="center">
          <div className="signin-icon">
            <IonIcon icon={logIn} color="primary" />
          </div>
          <div>
            <h1>Insérer le code</h1>
          </div>
          <div
            className={`form-field animate__animated animate__backInUp ${
              errorPhoneNumber ? "error" : ""
            }`}
          >
            <IonIcon icon={phonePortrait} />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code reçu par sms"
              type="number"
              disabled={code.length === 6}
            />
          </div>
          <div className="form-field-button ">
            <IonButton color="primary" onClick={hideCode}>
              Retour
              <IonIcon slot="start" icon={backspace} />
            </IonButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex column connection-view">
      <div className="center">
        <div className="signin-icon">
          <IonIcon icon={logIn} color="primary" />
        </div>
        <div className="signin-title">
          {isSignIn ? (
            <>
              <h1>Connexion</h1>
              <p onClick={toggleSignIn}>Pas encore inscrit?</p>
            </>
          ) : (
            <>
              <h1>Inscription</h1>
              <p onClick={toggleSignIn}>Déjà inscrit?</p>
            </>
          )}
        </div>
        <div
          className={`form-field animate__animated animate__backInUp ${
            errorPhoneNumber ? "error" : ""
          }`}
        >
          <IonIcon icon={phonePortrait} />
          <input
            value={phoneNumber || ""}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Numéro de téléphone portable (06)"
            type="tel"
          />
        </div>
        {showPseudo && !isSignIn && (
          <div
            className={`form-field animate__animated animate__backInUp ${
              warnPseudo ? "warn" : ""
            } ${errorPseudo ? "danger" : ""}`}
          >
            <IonIcon icon={personOutline} />
            <Input
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Pseudo"
            />
            {warnPseudo && (
              <p color="warning">
                Votre pseudo doit faire au moins 3 caractères
              </p>
            )}
            {errorPseudo && <p color="danger">Pseudo existant</p>}
          </div>
        )}
      </div>
      <div id={`recaptcha-container-${page}`} className="recaptcha-container" />
      {showBtnValidate && (
        <div className="form-field-button animate__animated animate__backInUp">
          <IonButton color="primary" onClick={signIn}>
            Valider
            <IonIcon slot="end" icon={caretForward} />
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default ConnectionView;
