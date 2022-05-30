import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  arrowForwardSharp,
  saveSharp,
  trashBinSharp,
  closeOutline,
  shareSocial,
} from "ionicons/icons";
import React from "react";
import {
  ConnectionView,
  ListForm,
  MaxListsCreatedComponent,
} from "../../components";
import { AppendViewProps, Step } from "../../types";
import "./index.css";
import useAppendView from "./useAppendView";

const AppendViewWrapper = ({
  isModal = false,
  children,
}: {
  isModal?: boolean;
  children: React.ReactNode;
}) => {
  if (isModal) {
    return <>{children}</>;
  }
  return <IonPage>{children}</IonPage>;
};

const AppendView = (props: AppendViewProps) => {
  const {
    user,
    list,
    step,
    loadingSave,
    isEdit,
    title,
    maxListsDone,
    setUser,
    setStep,
    handleChangeTitle,
    handleChangeDescription,
    handleChangeOpenPublic,
    handleChangeTopNumber,
    handleAddTag,
    handleRemoveTag,
    handleChangeTitleItem,
    handleChangeImgItem,
    handleChangeDescriptionItem,
    canUpStep,
    clearForm,
    onCloseModal,
    share,
  } = useAppendView(props);

  if (!user) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <ConnectionView page="1" onConnected={(user) => setUser(user)} />
        </IonContent>
      </IonPage>
    );
  }

  if (maxListsDone) {
    return <MaxListsCreatedComponent />;
  }

  return (
    <AppendViewWrapper isModal={isEdit}>
      <React.Fragment>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              {isEdit && (
                <IonButton onClick={() => onCloseModal && onCloseModal()}>
                  <IonIcon slot="icon-only" icon={closeOutline} />
                </IonButton>
              )}
            </IonButtons>
            <IonTitle>{title}</IonTitle>
            <IonButtons slot="primary">
              {list.title !== "" && (
                <IonButton onClick={clearForm}>
                  <IonIcon slot="icon-only" icon={trashBinSharp} />
                </IonButton>
              )}
              {isEdit && (
                <IonButton onClick={() => share(list)}>
                  <IonIcon slot="icon-only" icon={shareSocial} />
                </IonButton>
              )}
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="content-padding">
          <ListForm
            list={list}
            step={step}
            setStep={setStep}
            handleChangeTitle={handleChangeTitle}
            handleChangeDescription={handleChangeDescription}
            handleChangeOpenPublic={handleChangeOpenPublic}
            handleChangeTopNumber={handleChangeTopNumber}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            handleChangeTitleItem={handleChangeTitleItem}
            handleChangeImgItem={handleChangeImgItem}
            handleChangeDescriptionItem={handleChangeDescriptionItem}
          />
          {canUpStep((step + 1) as Step) && (
            <IonFab
              vertical="bottom"
              horizontal="center"
              slot="fixed"
              className="animate__animated animate__backInUp"
            >
              <IonFabButton
                onClick={() => setStep((step + 1) as Step)}
                disabled={loadingSave}
              >
                {loadingSave ? (
                  <IonSpinner name="lines" />
                ) : (
                  <IonIcon icon={step === 2 ? saveSharp : arrowForwardSharp} />
                )}
              </IonFabButton>
            </IonFab>
          )}
        </IonContent>
      </React.Fragment>
    </AppendViewWrapper>
  );
};

export default AppendView;
