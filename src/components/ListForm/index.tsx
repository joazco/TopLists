import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { ListViewComponent } from "..";
import { ListFormProps } from "../../types";
import {
  ListFormContent,
  StepComponent,
  InformationComponent,
  TopsListComponent,
} from "./components";

const ListForm = (props: ListFormProps) => {
  const {
    list,
    step,
    setStep,
    handleChangeOpenPublic,
    handleChangeTitle,
    handleChangeDescription,
    handleChangeTopNumber,
    handleChangeTitleItem,
    handleChangeImgItem,
    handleChangeDescriptionItem,
    handleAddTag,
    handleRemoveTag,
  } = props;
  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <StepComponent step={step} onChangeStep={(s) => setStep(s)} />
        </IonCol>
      </IonRow>
      {step === 0 && (
        <ListFormContent>
          <InformationComponent
            list={list}
            handleChangeTitle={handleChangeTitle}
            handleChangeDescription={handleChangeDescription}
            handleChangeOpenPublic={handleChangeOpenPublic}
            handleChangeTopNumber={handleChangeTopNumber}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
          />
        </ListFormContent>
      )}
      {step === 1 && (
        <ListFormContent>
          <TopsListComponent
            list={list}
            handleChangeTitleItem={handleChangeTitleItem}
            handleChangeImgItem={handleChangeImgItem}
            handleChangeDescriptionItem={handleChangeDescriptionItem}
          />
        </ListFormContent>
      )}
      {step === 2 && (
        <ListFormContent>
          <h2>Prévisualisation</h2>
          <ListViewComponent list={list} preset="form" />
        </ListFormContent>
      )}
    </IonGrid>
  );
};

export default ListForm;
