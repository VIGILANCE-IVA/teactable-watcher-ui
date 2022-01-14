import { App, f7, f7ready, Link, Toolbar, View, Views } from "framework7-react";
import React from "react";
import cordovaApp from "../js/cordova-app";
import { getDevice } from "../js/framework7-custom.js";
import routes from "../js/routes";
import store from "../js/store";

const MyApp = () => {
  const device = getDevice();
  // Framework7 Parameters
  const f7params = {
    name: "watcher", // App name
    theme: "auto", // Automatic theme detection

    id: "com.vigilance.watcher", // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,

    // Input settings
    input: {
      scrollIntoViewOnFocus: device.cordova && !device.electron,
      scrollIntoViewCentered: device.cordova && !device.electron,
    },
    // Cordova Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };

  f7ready(() => {
    // Init cordova APIs (see cordova-app.js)
    if (f7.device.cordova) {
      cordovaApp.init(f7);
    }

    // Call F7 APIs here
  });

  return (
    <App {...f7params}>
      {/* Views/Tabs container */}
      <Views tabs className="safe-areas">
        {/* Tabbar for switching views-tabs */}
        <Toolbar tabbar labels bottom>
          <Link
            tabLink="#view-home"
            tabLinkActive
            iconIos="f7:square_list_fill"
            iconMd="material:view_list"
            text="Anomalies"
          />
          <Link
            tabLink="#view-settings"
            iconIos="f7:gear"
            iconAurora="f7:gear"
            iconMd="material:settings"
            text="Settings"
          />
        </Toolbar>

        {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
        <View id="view-home" main tab tabActive url="/" />

        {/* Settings View */}
        <View id="view-settings" name="settings" tab url="/settings/" />
      </Views>
    </App>
  );
};

export default MyApp;
