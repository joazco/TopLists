import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { ListViewComponent } from "../../components";
import { useFirebaseList } from "../../hooks";
import { List } from "../../types";

const TopViewLoadingView = () => (
  <IonList>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <React.Fragment key={i}>
        <IonItem lines="none">
          <IonThumbnail slot="start" style={{ width: "100%" }}>
            <IonSkeletonText animated />
          </IonThumbnail>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
        </IonItem>
      </React.Fragment>
    ))}
  </IonList>
);

type TopViewProps = {
  id?: string;
  onDismiss: () => void;
};

const TopView = ({ id, onDismiss }: TopViewProps) => {
  const [list, setList] = useState<List | null>(null);
  const { getListFromId } = useFirebaseList();

  useEffect(() => {
    if (id) {
      getListFromId(id)
        .then((result) => {
          const data = result.data();
          if (data) {
            setList(result.data() as List);
          } else {
            onDismiss();
          }
        })
        .catch(onDismiss);
    }
  }, [id, getListFromId, onDismiss]);

  if (list === null) {
    return (
      <React.Fragment>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => onDismiss()}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <TopViewLoadingView />
        </IonContent>
      </React.Fragment>
    );
  }

  return <ListViewComponent list={list} onCloseModal={() => onDismiss()} />;
};

export default TopView;
