import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline, cloudOutline } from "ionicons/icons";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import React, { useCallback, useEffect, useState } from "react";

import "./index.scss";
import { GoogleSearchResponse, SearchType } from "../../../../types";

type ModalSelectImageProps = {
  onDismiss: (link: string) => void;
  search: SearchType;
};

const ModalLoading = () => (
  <IonRow className="modal-loading-content">
    {[0, 1, 2, 3, 4, 5, 6, 7].map((key) => (
      <IonCol size="6" key={`thumbnail-${key}`}>
        <IonThumbnail>
          <IonSkeletonText animated />
        </IonThumbnail>
      </IonCol>
    ))}
  </IonRow>
);

const ModalSelectImage = (props: ModalSelectImageProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>([]);
  const { search, onDismiss } = props;

  const openBrowser = useCallback(() => {
    if (search) {
      InAppBrowser.create(
        `https://www.google.fr/imghp?q=${search.q}`,
        "_system"
      );
    }
    onDismiss("");
  }, [search, onDismiss]);

  useEffect(() => {
    if (!search) {
      onDismiss("");
    } else {
      fetch(
        `https://www.googleapis.com/customsearch/v1?cx=b8a8657c69e356961&key=AIzaSyC6rb4imeJdqabeEqNqQWrvfliQKbqBDNY&searchType=image&q=${search.q}&imgSize=medium&imgType=photo`
      )
        .then((res) => {
          if (!res || res.status !== 200) {
            openBrowser();
            return;
          }
          res
            .json()
            .then((data: GoogleSearchResponse) => {
              if (!data || !data.items) {
                openBrowser();
                return;
              }
              const dataFormatted = data.items.map((item) => item.link);
              if (!dataFormatted || dataFormatted.length === 0) {
                openBrowser();
              }
              setImages(dataFormatted);
            })
            .catch(openBrowser);
        })
        .catch(openBrowser)
        .finally(() => setLoading(false));
    }
  }, [search, onDismiss, openBrowser]);

  return (
    <React.Fragment>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onDismiss("")}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Sélectionner une image</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {loading && <ModalLoading />}
          {!loading && (
            <IonRow className="modal-image-container">
              {images.map((image) => (
                <IonCol
                  size="6"
                  onClick={() => {
                    onDismiss(image);
                  }}
                >
                  <img src={image} alt="" />
                </IonCol>
              ))}
              <IonCol size="12">
                <IonButton
                  color="tertiary"
                  expand="full"
                  onClick={() => openBrowser()}
                >
                  Ouvrir dans navigateur
                  <IonIcon name={cloudOutline} slot="end" color="light" />
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </React.Fragment>
  );
};

export default ModalSelectImage;
