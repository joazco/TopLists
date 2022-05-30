import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline, shareSocial } from "ionicons/icons";
import React from "react";
import { useShareTop } from "../../hooks";

import { ListViewComponentProps } from "../../types";

import "./index.scss";

const imgRegex = new RegExp(/(https?:\/\/.*\.(?:png|jpg))/i);

const ListViewComponentContent = ({
  list,
}: Pick<ListViewComponentProps, "list">) => {
  const { title, description, items, topNumber, tags, author } = list;

  const imageIsValid = (img?: string) => {
    if (img?.match(imgRegex)) return true;
    return false;
  };
  return (
    <IonGrid className="list-top-view">
      <IonRow>
        <IonCol>
          <h1>{title}</h1>
          <p>{description}</p>
          <p className="list-top-view-author">
            <b>
              <i>par {author}</i>
            </b>
          </p>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          {tags.map((tag, i) => (
            <IonBadge key={i}>{tag} </IonBadge>
          ))}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          {items
            .filter((_item, i) => i < topNumber)
            .map(({ order, title: titleItem, img, description }) => (
              <div
                key={order}
                className="list-top-item animate__animated animate__backInLeft"
              >
                {img && (
                  <div className="list-top-item-img-content">
                    <img src={img} alt={titleItem} />
                    {/* {imageIsValid(img) ? (
                      <img src={img} alt={titleItem} />
                    ) : (
                      <div>Image invalide</div>
                    )} */}
                  </div>
                )}
                <div className="list-top-item-header-content">
                  <h2>
                    #{order} {titleItem}
                  </h2>
                </div>
                {/* {description && (
                  <div className="list-top-item-header-description">
                    <p>{description}</p>
                  </div>
                )} */}
              </div>
            ))}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const ListViewComponent = (props: ListViewComponentProps) => {
  const { list, preset = "default", onCloseModal } = props;
  const { title } = list;
  const share = useShareTop();

  if (preset === "form") {
    return <ListViewComponentContent list={list} />;
  }

  return (
    <React.Fragment>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => onCloseModal && onCloseModal()}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className="list-top-view-header-title">{title}</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={() => share(list)}>
              <IonIcon slot="icon-only" icon={shareSocial} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ListViewComponentContent list={list} />
      </IonContent>
    </React.Fragment>
  );
};

export default ListViewComponent;
