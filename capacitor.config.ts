import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anandafashions.app",
  appName: "Ananda Fashions",
  webDir: "dist-app",
  server: {
    androidScheme: "https",
    url: "https://ananda-fashions.netlify.app/app",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#50050F",
      showSpinner: false,
    },
  },
};

export default config;
