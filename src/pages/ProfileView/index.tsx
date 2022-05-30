import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { person } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import { AppendView } from "..";
import { ConnectionView, ListComponent } from "../../components";
import ProfileInfoComponent from "../../components/ProfileInfoComponent";
import { AppContext } from "../../contexts";
import { useFirebaseList } from "../../hooks";
import { List, ProfileViewProps } from "../../types";
import "./index.scss";

const ProfileView: React.FC<ProfileViewProps> = (props: ProfileViewProps) => {
  const { darkMode, setDarkMode } = props;
  const [userList, setUserList] = useState<List[]>([]);
  const [showEditPage, setShowEditPage] = useState<List | null>(null);
  const { getListFromUser } = useFirebaseList();
  const appContext = useContext(AppContext);
  const { user, setUser } = appContext;

  useEffect(() => {
    if (user) {
      getListFromUser(user.uid, (lists) => setUserList(lists));
    }
  }, [user, getListFromUser]);

  if (!user) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <ConnectionView page="2" onConnected={(user) => setUser(user)} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={person} /> Profil
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent id="pageProfile">
        <IonGrid>
          <IonRow>
            <ProfileInfoComponent
              user={user}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </IonRow>
          <IonRow>
            <IonCol>
              <h3>Liste de vos tops :</h3>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <ListComponent
                lists={userList}
                onClickList={(l) => setShowEditPage(l)}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonModal
          isOpen={showEditPage !== null}
          onDidDismiss={() => setShowEditPage(null)}
        >
          <AppendView
            {...props}
            defaultStep={2}
            defaultListProps={showEditPage || undefined}
            onCloseModal={() => setShowEditPage(null)}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ProfileView;
