import {
  BlockTitle,
  f7,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  NavRight,
  Page,
  Toggle,
  useStore,
} from "framework7-react";
import React, { useEffect, useState } from "react";
import xtend from "xtend";
import ApiManager from "../js/api";
import store from "../js/store";

const SettingsPage = () => {
  const api = ApiManager(useStore("token"));
  const cfg = useStore("cfg");
  const [data, setData] = useState(cfg);

  const getCfg = () => {
    api.get("/cfg").then((response) => {
      store.dispatch("setCfg", response.data);
    });
  };

  const save = () => {
    api.post("/cfg", data).then(() => {
      store.dispatch("setCfg", data);
      f7.toast.show({ text: "Saved successfully!", closeTimeout: 3000 });
    });
  };

  const setState = (key, value) => {
    setData(xtend(data, { [key]: value }));
  };

  useEffect(getCfg, []);

  return (
    <Page name="settings">
      <Navbar title="Settings">
        <NavRight>
          <Link
            iconIos="f7:floppy_disk"
            iconMd="material:save"
            onClick={save}
          />
        </NavRight>
      </Navbar>

      <BlockTitle>General</BlockTitle>
      <List noHairlinesMd>
        <ListInput
          label="Anomaly class"
          type="text"
          placeholder="People"
          defaultValue={cfg.anomaly_class}
          onChange={(e) => setState("anomaly_class", e.target.value)}
        />

        <ListInput
          label="Scene"
          type="text"
          defaultValue={cfg.scene}
          onChange={(e) => setState("scene", e.target.value)}
        />
      </List>
      <BlockTitle>SCHEDULE</BlockTitle>
      <List noHairlinesMd>
        <ListItem>
          <span>Auto start</span>
          <Toggle
            defaultChecked={cfg.cron?.run}
            onChange={(e) =>
              setState(
                "cron",
                xtend(cfg.cron, data.cron, { run: e.target.checked })
              )
            }
          />
        </ListItem>
        <ListInput
          label="Timezone"
          type="text"
          defaultValue={cfg.timezone}
          onChange={(e) => setState("timezone", e.target.value)}
        />
        <ListInput
          label="Start time (Everyday At)"
          type="text"
          defaultValue={cfg.cron?.start_time}
          onChange={(e) =>
            setState(
              "cron",
              xtend(cfg.cron, data.cron, { start_time: e.target.value })
            )
          }
        />
        <ListInput
          label="Stop time (Everyday At)"
          type="text"
          defaultValue={cfg.cron?.stop_time}
          onChange={(e) =>
            setState(
              "cron",
              xtend(cfg.cron, data.cron, { stop_time: e.target.value })
            )
          }
        />
      </List>
      <BlockTitle>NOTIFICATIONS</BlockTitle>
      <List noHairlinesMd>
        <ListItem>
          <span>SMS</span>
          <Toggle
            defaultChecked={cfg.sms_notifications}
            onChange={(e) => setState("sms_notifications", e.target.checked)}
          />
        </ListItem>
        <ListInput
          label="Phone"
          type="tel"
          placeholder="0"
          defaultValue={cfg.notification_phone_number}
          onChange={(e) =>
            setState("notification_phone_number", e.target.value)
          }
        />
        <ListInput
          label="SMS Key (softphone.koodeyo.com)"
          type="text"
          placeholder="0"
          defaultValue={cfg.softphone_key}
          onChange={(e) => setState("softphone_key", e.target.value)}
        />
        <ListInput
          type="textarea"
          label="Alert Message"
          placeholder="Body"
          defaultValue={cfg.alert_message}
          onChange={(e) => setState("alert_message", e.target.value)}
        />
      </List>
      <BlockTitle>SESSION</BlockTitle>
      <List noHairlinesMd>
        <ListInput
          label="Prediction count"
          type="number"
          placeholder="0"
          defaultValue={cfg.prediction_count}
          onChange={(e) => setState("prediction_count", e.target.value)}
        />
        <ListInput
          label="Timeout"
          type="number"
          placeholder="0"
          defaultValue={cfg.session_timeout}
          onChange={(e) => setState("session_timeout", e.target.value)}
        />
        <ListInput
          label="Watch interval"
          type="number"
          placeholder="0"
          defaultValue={cfg.watch_interval}
          onChange={(e) => setState("watch_interval", e.target.value)}
        />
      </List>
      <BlockTitle>SERVICE</BlockTitle>
      <List noHairlinesMd>
        <ListInput
          label="URL"
          type="url"
          placeholder="URL"
          defaultValue={cfg.service}
          onChange={(e) => setState("service", e.target.value)}
        />
        <ListInput
          label="Webhook"
          type="url"
          placeholder="URL"
          defaultValue={cfg.service_data?.webhook}
          onChange={(e) =>
            setState(
              "service_data",
              xtend(cfg.service_data, data.service_data, {
                webhook: e.target.value,
              })
            )
          }
        />
        <ListInput
          label="Video URL"
          type="text"
          placeholder="URL"
          defaultValue={cfg.service_data?.video_uri}
          onChange={(e) =>
            setState(
              "service_data",
              xtend(cfg.service_data, data.service_data, {
                video_uri: e.target.value,
              })
            )
          }
        />
        <ListInput
          label="Delay"
          type="number"
          placeholder="0"
          defaultValue={cfg.service_data?.delay}
          onChange={(e) =>
            setState(
              "service_data",
              xtend(cfg.service_data, data.service_data, {
                delay: e.target.value,
              })
            )
          }
        />
      </List>
    </Page>
  );
};

export default SettingsPage;
