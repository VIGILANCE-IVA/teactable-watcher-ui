import NotFoundPage from "../pages/404.jsx";
import HomePage from "../pages/home.jsx";
import LoginPage from "../pages/login.jsx";
import SettingsPage from "../pages/settings.jsx";

var routes = [
  {
    path: "/",
    async: function ({ resolve }) {
      var store = this.app.store;
      resolve({
        component: store.state.token ? HomePage : LoginPage,
      });
    },
  },
  {
    path: "/settings/",
    component: SettingsPage,
  },

  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
