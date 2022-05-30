import { isPlatform } from "@ionic/react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useCallback } from "react";

const useStatusBar = () => {
  const isCordova = isPlatform("cordova");
  const setStatusBarStyleDark = () => {
    return StatusBar.setStyle({ style: Style.Dark });
  };

  const setStatusBarStyleLight = () => {
    return StatusBar.setStyle({ style: Style.Light });
  };

  const updateStatusBar = useCallback(
    (darkMode: boolean) => {
      if (!isCordova) return;
      StatusBar.setOverlaysWebView({ overlay: false });
      if (darkMode) {
        setStatusBarStyleDark();
        StatusBar.setBackgroundColor({ color: "#4c4637" });
      } else {
        setStatusBarStyleLight();
        StatusBar.setBackgroundColor({ color: "#f7f1e3" });
      }
    },
    [isCordova]
  );

  return {
    updateStatusBar,
  };
};

export default useStatusBar;
