import { IonBadge, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { addSharp, closeOutline } from "ionicons/icons";
import { useEffect, useReducer, useState } from "react";
import { Input } from "../../..";
import { ListFormProps } from "../../../../types";
import RadioButtonComponent from "../../../RadioButtonComponent";
import reducer, { defaultState } from "./reducer";

const InformationComponent = (
  props: Pick<
    ListFormProps,
    | "list"
    | "handleChangeOpenPublic"
    | "handleChangeTitle"
    | "handleChangeDescription"
    | "handleChangeTopNumber"
    | "handleAddTag"
    | "handleRemoveTag"
  >
) => {
  const {
    list,
    handleChangeTitle,
    handleChangeDescription,
    handleChangeOpenPublic,
    handleChangeTopNumber,
    handleAddTag,
    handleRemoveTag,
  } = props;

  const [currTag, setCurrTag] = useState<string>("");
  const { title, description, openPublic, topNumber, tags } = list;
  const [state, dispatch] = useReducer(reducer, {
    showDescription: title !== "",
    showOpenPublic: title !== "",
    showTags: title !== "",
    showTopNumber: title !== "",
  });

  const { showDescription, showOpenPublic, showTopNumber, showTags } = state;

  useEffect(() => {
    if (title !== "") {
      setTimeout(() => dispatch("showDescription"));
      setTimeout(() => dispatch("showOpenPublic"), 500);
      setTimeout(() => dispatch("showTopNumber"), 1000);
      setTimeout(() => dispatch("showTags"), 1500);
    } else {
      dispatch("hideOpenTop");
    }
  }, [title]);

  return (
    <IonGrid className="list-form-content-content">
      <IonRow>
        <IonCol>
          <h2>Informations de la liste de top</h2>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <div className="form-content">
            <label className="required" htmlFor="title">
              Titre
            </label>
            <div className="form-field">
              <Input
                value={title}
                placeholder="Liste des meilleurs films"
                id="title"
                onChange={(e) => handleChangeTitle(e.target.value)}
              />
            </div>
          </div>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          {showDescription && (
            <div className="form-content animate__animated animate__backInUp">
              <label htmlFor="description">Déscription de votre liste</label>
              <div className="form-field">
                <Input
                  value={description || ""}
                  placeholder="Liste des meilleurs films d'après moi"
                  id="description"
                  onChange={(e) => handleChangeDescription(e.target.value)}
                  long
                />
              </div>
            </div>
          )}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          {showOpenPublic && (
            <div className="form-content animate__animated animate__backInUp">
              <label className="required">Liste publique</label>
              <RadioButtonComponent
                choice1Label="Oui"
                choice2Label="Non"
                value={openPublic}
                onChange={handleChangeOpenPublic}
              />
            </div>
          )}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          {showTopNumber && (
            <div className="form-content animate__animated animate__backInUp">
              <label className="required">Top de 5 ou de 10 maximum</label>
              <RadioButtonComponent
                choice1Label="5"
                choice2Label="10"
                preset="choice"
                value={topNumber === 5}
                onChange={handleChangeTopNumber}
              />
            </div>
          )}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          {showTags && (
            <div className="animate__animated animate__backInUp">
              <div className="form-content ">
                <label htmlFor="tagAdd">Ajout de tag</label>
                <div className="form-field">
                  <Input
                    placeholder="films, musiques, séries, ...."
                    id="tagAdd"
                    onChange={(e) => {
                      setCurrTag(e.target.value);
                    }}
                    value={currTag}
                    maxSize={25}
                  />
                  <IonIcon
                    icon={addSharp}
                    onClick={() => {
                      if (currTag === "") return;
                      handleAddTag(currTag);
                      setCurrTag("");
                    }}
                  />
                </div>
              </div>
              <div className="tags-content">
                {tags.map((tag, i) => (
                  <IonBadge key={i}>
                    {tag}{" "}
                    <IonIcon
                      icon={closeOutline}
                      onClick={() => {
                        handleRemoveTag(tag);
                      }}
                    />
                  </IonBadge>
                ))}
              </div>
            </div>
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default InformationComponent;
