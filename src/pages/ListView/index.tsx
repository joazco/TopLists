import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SplashScreen } from "@capacitor/splash-screen";
import { useEffect, useState } from "react";
import { RefresherEventDetail } from "@ionic/core";

import "./index.scss";
import { ListComponent, ListViewComponent } from "../../components";
import { List, ListViewProps } from "../../types";
import { useFirebaseList } from "../../hooks";
import logo from "../../logo.png";
import useStatusBar from "../../hooks/useStatusBar";

const ListView: React.FC<ListViewProps> = ({ darkMode }: ListViewProps) => {
  const [lists, setLists] = useState<List[]>([]);
  const [showPage, setShowPage] = useState<List | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState<boolean>(false);

  const { getListPublic, getListPublicNext } = useFirebaseList();
  const { updateStatusBar } = useStatusBar();

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    setLoading(true);
    setLists([]);
    setInfiniteDisabled(false);
    getListPublic()
      .then((values) => {
        setLists(values);
      })
      .finally(() => {
        event.detail.complete();
        setLoading(false);
      });
  };

  const loadData = (ev: any) => {
    setTimeout(() => {
      getListPublicNext().then((values) => {
        ev.target.complete();
        if (values.length === 0) {
          setInfiniteDisabled(true);
        } else {
          setLists(Array.from(lists.concat(values)));
        }
      });
    }, 500);
  };

  const filterChange = (value: string) => {
    setLoading(true);
    setLists([]);
    setInfiniteDisabled(false);
    getListPublic(value)
      .then((values) => {
        setLists(values);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    updateStatusBar(darkMode);
  }, [darkMode, updateStatusBar]);

  useEffect(() => {
    getListPublic()
      .then((values) => {
        setLists(values);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        SplashScreen.hide();
      });
  }, [getListPublic]);

  return (
    <IonPage>
      <IonHeader className="header-home">
        <IonToolbar>
          <IonTitle className="header-toolbar-title-home">
            <img src={logo} alt="logo TopLists" />
            {/* <span> TopLists</span> */}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent id="pageListsTop">
        <IonRefresher
          slot="fixed"
          onIonRefresh={doRefresh}
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonGrid>
          <IonRow>
            <IonCol>
              <h1>Listes publiques</h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSearchbar
                onIonChange={(e) => filterChange(e.detail.value!)}
                type="text"
                placeholder="Rechercher"
                debounce={500}
              ></IonSearchbar>
            </IonCol>
          </IonRow>
          {loading && (
            <IonRow>
              <IonCol>
                <p>Chargement des tops....</p>
              </IonCol>
            </IonRow>
          )}
          <IonRow>
            <IonCol>
              <ListComponent
                preset="allPublic"
                lists={lists}
                onClickList={(l) => setShowPage(l)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonInfiniteScroll
              onIonInfinite={loadData}
              threshold="100px"
              disabled={isInfiniteDisabled}
            >
              <IonInfiniteScrollContent
                loadingSpinner="bubbles"
                loadingText="Chargement des tops...."
              ></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </IonRow>
        </IonGrid>
        <IonModal
          isOpen={showPage !== null}
          onDidDismiss={() => setShowPage(null)}
        >
          {showPage && (
            <ListViewComponent
              list={showPage}
              onCloseModal={() => setShowPage(null)}
            />
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ListView;
