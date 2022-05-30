import { IonContent, IonPage } from "@ionic/react";

import "./index.scss";

const MaxListsCreatedComponent = () => {
  return (
    <IonPage>
      <IonContent id="max-lists-created-page">
        <div>
          <div>
            <h1>:(</h1>
          </div>
          <div>
            <h2>Vous ne pouvez pas créer plus de 10 listes de top</h2>
          </div>
          <div>
            <p>
              Pourquoi je ne peux plus créer de liste? L'application est
              totalement gratuite et pour le moment, afin d'éviter un coup
              important d'utilisation de la base de données, vous êtes limité à
              10 listes.
              <br />
              Merci pour votre compréhension.
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MaxListsCreatedComponent;
