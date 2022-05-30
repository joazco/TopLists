import { IonCol, IonRow } from "@ionic/react";
import "../../index.scss";

const ListFormContent: React.FC = ({ children }) => (
  <IonRow className="animate__animated animate__fadeInLeftBig animate__faster list-form-content">
    <IonCol>{children}</IonCol>
  </IonRow>
);

export default ListFormContent;
