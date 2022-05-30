import { IonIcon, IonToggle, useIonAlert } from "@ionic/react";
import { close, logOut, moon } from "ionicons/icons";
import { useConnection, useGoogleAppleTester } from "../../hooks";
import { ProfileInfoComponentProps } from "../../types";
import PseudoComponent from "../PseudoComponent";

import "./index.scss";

const ProfileInfoComponent = (props: ProfileInfoComponentProps) => {
  const { user, darkMode, setDarkMode } = props;
  const { pseudo, phoneNumber } = user;
  const [present] = useIonAlert();
  const { logOut: SignOut, deleteCurrentUser } = useConnection();
  const { isTester, disconnectTester } = useGoogleAppleTester();

  return (
    <div className="profile-content animate__animated animate__flipInX">
      <div>
        <PseudoComponent pseudo={pseudo} />
      </div>
      <div>
        <div className="profile-content-row">
          <div>Pseudo</div>
          <div>
            <b>{pseudo}</b>
          </div>
        </div>
        <div className="profile-content-row">
          <div>Numéro de téléphone</div>
          <div>
            <b>{phoneNumber}</b>
          </div>
        </div>
        <div className="profile-dark-mode">
          <IonToggle
            id="themeToggle"
            color="primary"
            checked={darkMode}
            onIonChange={(e) => setDarkMode(e.detail.checked)}
          />
          <IonIcon icon={moon} />
        </div>
        <br />
        <div className="profile-content-row">
          <div
            className="profile-content-row-delete"
            onClick={() => {
              present({
                header: "Confirmation",
                message:
                  "Êtes-vous sûr de vouloir supprimer votre compte? Tous vos tops seront supprimés de la base de données",
                buttons: [
                  "Annuler",
                  {
                    text: "Ok",
                    handler: () => {
                      deleteCurrentUser();
                    },
                  },
                ],
              });
            }}
          >
            <i>
              Supprimer mon compte <IonIcon icon={close} />
            </i>
          </div>
        </div>
        <div className="profile-content-row">
          <div
            className="profile-content-row-delete"
            onClick={() => (isTester ? disconnectTester() : SignOut())}
          >
            <i>
              Déconnexion <IonIcon icon={logOut} />
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoComponent;
