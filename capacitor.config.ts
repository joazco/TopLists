import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.joazco.toplists",
  appName: "TopLists",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#4c4637",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#bfb9ac",
    },
    Keyboard: {
      resize: "none",
    },
  },
};

export default config;
