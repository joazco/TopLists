import { IonCol, IonGrid, IonIcon, IonRow, useIonModal } from "@ionic/react";
import { archiveSharp, imageOutline, readerOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { ListFormProps, SearchType, TopItem } from "../../../../types";
import { Input } from "../../..";
import ModalSelectImage from "../ModalSelectImage";

const TopsListComponent = (
  props: Pick<
    ListFormProps,
    | "list"
    | "handleChangeTitleItem"
    | "handleChangeImgItem"
    | "handleChangeDescriptionItem"
  >
) => {
  const {
    list,
    handleChangeTitleItem,
    handleChangeImgItem,
    handleChangeDescriptionItem,
  } = props;
  const { topNumber, items } = list;
  const [focusId, setFocusId] = useState<number | null>(null);
  const [search, setSearch] = useState<SearchType>(null);
  const handleDismiss = (link: string = "") => {
    if (search) {
      handleChangeImgItem(search.item, link);
      setSearch(null);
      dismiss();
    }
  };

  const [present, dismiss] = useIonModal(ModalSelectImage, {
    onDismiss: handleDismiss,
    search,
  });

  useEffect(() => {
    if (search) {
      present();
    }
  }, [search, present]);

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <h2>Ajouter vos tops dans l'ordre</h2>
        </IonCol>
      </IonRow>
      {items.map((item) => {
        const { title, order, img, description } = item;
        const isFocus = focusId === order;

        if (order > topNumber) return <React.Fragment key={order} />;

        return (
          <IonRow
            className={`top-form-row ${
              order === 1 ? "first" : "animate__animated animate__backInUp "
            } ${isFocus ? "focus" : ""}`}
            key={order}
          >
            <IonCol size="12">
              <div className="form-content">
                <label className="required">Titre du top n°{order}</label>
                <div className="form-field">
                  <IonIcon icon={readerOutline} />
                  <Input
                    value={title}
                    placeholder={
                      isFocus || title !== "" ? "" : "Batman the dark night"
                    }
                    id="title"
                    onChange={(e) =>
                      handleChangeTitleItem(item, e.target.value)
                    }
                    // onPaste={(e) =>
                    //   handleChangeTitleItem(
                    //     item,
                    //     e.clipboardData.getData("Text")
                    //   )
                    // }
                    onFocus={() => setFocusId(order)}
                    onBlur={() => setFocusId(null)}
                  />
                </div>
              </div>
            </IonCol>
            <IonCol size="12">
              <div className="form-content">
                <label>Lien de l'image</label>
                <div className="form-field">
                  <IonIcon icon={imageOutline} />
                  <Input
                    value={img || ""}
                    placeholder={
                      isFocus || title !== ""
                        ? ""
                        : "https://fr.web.img2.acsta.net/medias/nmedia/18/63/97/89/18949761.jpg"
                    }
                    id="img"
                    onChange={(e) => handleChangeImgItem(item, e.target.value)}
                    // onPaste={(e) =>
                    //   handleChangeImgItem(item, e.clipboardData.getData("Text"))
                    // }
                    onFocus={() => setFocusId(order)}
                    onBlur={() => setFocusId(null)}
                    long
                  />
                  <IonIcon
                    icon={archiveSharp}
                    onClick={() =>
                      title.trim() !== "" && setSearch({ item, q: title })
                    }
                  />
                </div>
              </div>
            </IonCol>
            {/* <IonCol size="12">
              <div className="form-content">
                <label >Note</label>
                <div className="form-field">
                  <IonIcon icon={documentOutline} />
                  <Input
                    value={description}
                    placeholder={
                      isFocus || title !== ""
                        ? ""
                        : "Batman est plus que jamais déterminé à éradiquer le crime organisé qui sème la terreur en ville..."
                    }
                    id="description"
                    onChange={(e) =>
                      handleChangeDescriptionItem(item, e.target.value)
                    }
                    // onPaste={(e) =>
                    //   handleChangeDescriptionItem(
                    //     item,
                    //     e.clipboardData.getData("Text")
                    //   )
                    // }
                    onFocus={() => setFocusId(order)}
                    onBlur={() => setFocusId(null)}
                    long
                  />
                </div>
              </div>
            </IonCol> */}
          </IonRow>
        );
      })}
    </IonGrid>
  );
};

export default TopsListComponent;
