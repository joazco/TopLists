import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonAlert,
  useIonModal,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  addCircleOutline,
  listCircleOutline,
  personOutline,
} from "ionicons/icons";
import { App as AppCapacitor, URLOpenListenerEvent } from "@capacitor/app";

import { ListView, AppendView, ProfileView, TopView } from "./pages";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "animate.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./App.scss";
import "./darkMode.scss";
import { AppContext } from "./contexts";
import {
  useConnection,
  useFirebaseVersion,
  useGoogleAppleTester,
} from "./hooks";
import { UserFirebaseStorage } from "./types";
import useDatabase from "./hooks/useLocalDatabase";

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "m",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};
const appVersion: string = "1.0.0";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const App: React.FC = () => {
  const [user, setUser] = useState<UserFirebaseStorage | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deepLinkId, setDeepLinkId] = useState<string>("");
  const { onCheckLogged } = useConnection();
  const { setItem, getItem } = useDatabase();
  const checkVersion = useFirebaseVersion();
  const [present] = useIonAlert();
  const [presentTopView, dismiss] = useIonModal(TopView, {
    id: deepLinkId,
    onDismiss: () => {
      setDeepLinkId("");
      dismiss();
    },
  });

  const changeDarkMode = (dk: boolean) => {
    prefersDark.removeEventListener("change", () => {});
    setItem<boolean>("activateDarkMode", dk).then(() => setDarkMode(dk));
  };

  useEffect(() => {
    AppCapacitor.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      const slug = event.url.split(".app").pop();
      if (slug) {
        setDeepLinkId(slug.replace("/", ""));
      }
    });
  }, []);

  useEffect(() => {
    onCheckLogged((u) => setUser(u));
  }, [onCheckLogged]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    getItem<boolean>("activateDarkMode")
      .then((activateDarkMode) => {
        if (typeof activateDarkMode !== "undefined") {
          setDarkMode(activateDarkMode);
        } else {
          setDarkMode(prefersDark && prefersDark.matches);
          prefersDark.addListener((e) => {
            document.body.classList.toggle("dark", e.matches);
          });
        }
      })
      .catch(() => {
        const localPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        );
        setDarkMode(localPrefersDark && localPrefersDark.matches);
        localPrefersDark.addListener((e) => {
          document.body.classList.toggle("dark", e.matches);
        });
      });
  }, [getItem]);
  useEffect(() => {
    if (deepLinkId !== "") {
      presentTopView();
    }
  }, [deepLinkId, presentTopView]);

  useEffect(() => {
    checkVersion(appVersion).then((v) => {
      if (v !== appVersion) {
        present({
          header: "Mise à jour",
          message: "Il y a une mise à jour à télécharger",
          backdropDismiss: false,
          buttons: [
            {
              text: "Télécharger",
              handler: () => {
                return false;
              },
            },
          ],
        });
      }
    });
  }, [present, checkVersion]);

  console.log(user);

  return (
    <IonApp>
      <AppContext.Provider value={{ user, setUser }}>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route
                exact
                path="/create"
                render={(props) => <AppendView {...props} isEdit={false} />}
              />
              <Route
                path="/profile"
                render={(props) => (
                  <ProfileView
                    {...props}
                    darkMode={darkMode}
                    setDarkMode={changeDarkMode}
                  />
                )}
              />
              <Route
                exact
                path="/list"
                render={() => <ListView darkMode={darkMode} />}
              />
              <Route exact path="/">
                <Redirect to="/list" />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom" className="ion-no-border">
              <IonTabButton tab="list" href="/list">
                <IonIcon icon={listCircleOutline} />
              </IonTabButton>
              <IonTabButton tab="create" href="/create">
                <IonIcon icon={addCircleOutline} />
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <IonIcon icon={personOutline} />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </AppContext.Provider>
    </IonApp>
  );
};

export default App;
