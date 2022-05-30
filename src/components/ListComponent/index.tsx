import { IonBadge, IonIcon } from "@ionic/react";
import { caretForward, cloud, cloudOfflineOutline } from "ionicons/icons";
import React from "react";
import { DefaultImg } from "..";
import { ListComponentProps } from "../../types";

import "./index.scss";

const ListComponent = (props: ListComponentProps) => {
  const { preset = "default", lists, onClickList } = props;

  return (
    <div className="list-content">
      {lists.map((l, i) => {
        const itemWithImg = l.items.find((item) => item.img && item.img !== "");
        return (
          <div
            key={`list-${i}`}
            className="list-content-card animate__animated animate__backInUp"
            onClick={() => onClickList(l)}
          >
            <div className="list-content-card-img">
              <DefaultImg src={itemWithImg?.img} alt={l.title} />
            </div>

            <div className="list-content-card-icon-title">
              <h4 className="list-content-card-icon-title-title">
                {l.title}
                {preset === "default" && (
                  <IonIcon icon={l.openPublic ? cloud : cloudOfflineOutline} />
                )}
              </h4>
              <span className="list-content-card-icon-title-description">
                {l.description}
              </span>
              <div className="list-content-card-icon-title-tags">
                {l.tags.map((tag, j) => (
                  <IonBadge key={`tag-${i}-${j}`}>{tag}</IonBadge>
                ))}
              </div>
              <div className="list-content-card-icon-title-author">
                <b>
                  <i>par {l.author}</i>
                </b>
              </div>
            </div>
            <div className="list-content-card-icon-forward">
              <span>
                <IonIcon icon={caretForward} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListComponent;
