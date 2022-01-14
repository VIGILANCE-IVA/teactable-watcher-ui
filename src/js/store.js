import { createStore } from "framework7/lite";
import _ from "lodash";
import xtend from "xtend";

const store = createStore({
  state: {
    anomalies: JSON.parse(_.defaultTo(localStorage.getItem("anomalies"), "{}")),
    cfg: JSON.parse(_.defaultTo(localStorage.getItem("cfg"), "{}")),
    token: _.defaultTo(localStorage.getItem("X-Access-Token"), undefined),
    running: JSON.parse(_.defaultTo(localStorage.getItem("running"), "false")),
  },
  getters: {
    anomalies({ state }) {
      return state.anomalies;
    },
    running({ state }) {
      return state.running;
    },
    token({ state }) {
      return state.token;
    },
    cfg({ state }) {
      return state.cfg;
    },
  },
  actions: {
    setAnomalies({ state }, anomalies) {
      state.anomalies = xtend(anomalies, state.anomalies);
      localStorage.setItem("anomalies", JSON.stringify(state.anomalies));
    },

    setCfg({ state }, cfg) {
      state.cfg = xtend(state.cfg, cfg);
      localStorage.setItem("cfg", JSON.stringify(state.cfg));
    },

    setToken({ state }, token) {
      state.token = token;
      localStorage.setItem("X-Access-Token", state.token);
    },

    setRunning({ state }, running) {
      state.running = running;
      localStorage.setItem("running", JSON.stringify(running));
    },

    unsetToken({ state }) {
      state.token = undefined;
      localStorage.removeItem("X-Access-Token");
    },
  },
});
export default store;
