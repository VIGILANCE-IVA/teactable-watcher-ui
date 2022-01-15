import {
  Block,
  f7,
  Fab,
  Link,
  List,
  ListItem,
  Navbar,
  NavRight,
  NavTitle,
  Page,
  useStore,
} from "framework7-react";
import _ from "lodash";
import moment from "moment";
import randomColor from "randomcolor";
import React, { useEffect, useRef, useState } from "react";
import xtend from "xtend";
import ApiManager from "../js/api";
import socketManager from "../js/io";
import store from "../js/store";

const HomePage = ({ f7router }) => {
  const token = useStore("token");
  const api = ApiManager(token);
  const running = useStore("running");
  const anomalies = useStore("anomalies");

  useEffect(() => {
    const socket = socketManager(token);

    socket.on("notification", (data) => {
      var notification = f7.notification.create(
        xtend({ icon: '<i class="f7-icons">bell_fill</i>' }, data)
      );
      notification.open();
    });

    socket.on("anomaly", (data) => {
      store.dispatch("setAnomalies", data);
    });

    socket.on("predictions", console.log);
  }, []);

  const getAnomalies = () => {
    api.get("/anomalies").then((response) => {
      store.dispatch("setAnomalies", response.data);
    });
  };

  const getStatus = () => {
    api.get("/status").then((response) => {
      store.dispatch("setRunning", response.data.running);
    });
  };

  const startStop = () => {
    api.post(running ? "/stop" : "/start", {}).then((response) => {
      store.dispatch("setRunning", !running);
    });
  };

  const formatted = () => {
    let output = [];

    for (var key in anomalies) {
      let exact = anomalies[key].filter((item) => item.exact);
      exact = exact.map((item) => {
        const date = moment(item.time, "DD-MM-YYYY HH:mm:ss");

        return xtend(item, {
          date: new Date(date.year(), date.month(), date.date()),
          hours: date.hours(),
          minutes: date.minutes(),
          seconds: date.format("ss"),
          title: item.class,
          color: randomColor(),
          formatted_time: date.format("hh:mm:ss a"),
        });
      });

      output = output.concat(exact);
    }

    return _.orderBy(
      output,
      function (o) {
        return moment(o.time, "DD-MM-YYYY HH:mm:ss");
      },
      ["desc"]
    );
  };

  useEffect(getStatus, []);
  useEffect(getAnomalies, []);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const today = new Date(year, month, day);
  const events = formatted();
  const [eventItems, setEventItems] = useState([]);
  const calendarRef = useRef(null);

  const renderEvents = (calendar) => {
    const currentDate = calendar.value[0];
    const currentEvents = events.filter(
      (event) =>
        event.date.getTime() >= currentDate.getTime() &&
        event.date.getTime() < currentDate.getTime() + 24 * 60 * 60 * 1000
    );

    const newEventItems = [];
    if (currentEvents.length) {
      currentEvents.forEach((event) => {
        const hours = event.hours;
        let minutes = event.minutes;
        if (minutes < 10) minutes = `0${minutes}`;
        newEventItems.push({
          title: event.title,
          time: `${hours}:${minutes}:${event.seconds}`,
          color: event.color,
          formatted_time: event.formatted_time,
        });
      });
    }
    setEventItems([...newEventItems]);
  };
  const onPageInit = (page) => {
    const $ = f7.$;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    calendarRef.current = f7.calendar.create({
      containerEl: "#calendar",
      toolbar: false,
      value: [today],
      events,
      on: {
        init(calendar) {
          setTimeout(() => {
            $(".navbar-calendar-title").text(
              `${monthNames[calendarRef.current.currentMonth]}, ${
                calendarRef.current.currentYear
              }`
            );
          }, 0);

          f7.navbar.size(f7.navbar.getElByPage(page.el));
          calendar.$el.addClass("no-safe-area-right");
          renderEvents(calendar);
        },
        monthYearChangeStart() {
          $(".navbar-calendar-title").text(
            `${monthNames[calendarRef.current.currentMonth]}, ${
              calendarRef.current.currentYear
            }`
          );
          f7.navbar.size(f7.navbar.getElByPage(page.el));
        },
        change(calendar) {
          renderEvents(calendar);
        },
      },
    });
  };

  const onPageBeforeRemove = () => {
    calendarRef.current.destroy();
  };

  return (
    <Page
      name="home"
      onPageInit={onPageInit}
      onPageBeforeRemove={onPageBeforeRemove}
    >
      {/* Top Navbar */}
      <Navbar sliding={false} noShadow>
        <NavTitle>
          ANOMALIES <span className="subtitle navbar-calendar-title"></span>
        </NavTitle>
        <NavRight>
          <Link
            iconIos="f7:square_arrow_right"
            iconMd="material:exit_to_app"
            onClick={() => {
              store.dispatch("unsetToken");
              f7router.refreshPage();
            }}
          />
        </NavRight>
      </Navbar>

      {/* Page content */}
      <Block
        id="calendar"
        strong
        className="no-padding no-margin no-hairline-top"
      />
      <List
        id="calendar-events"
        noHairlines
        className="no-margin no-safe-area-left"
      >
        {eventItems.map((item, index) => (
          <ListItem key={index} title={item.title} after={item.formatted_time}>
            <div
              className="event-color"
              style={{ backgroundColor: item.color }}
              slot="root-start"
            ></div>
          </ListItem>
        ))}
        {eventItems.length === 0 && (
          <ListItem>
            <span className="text-color-gray" slot="title">
              No anomalies detected on this date!
            </span>
          </ListItem>
        )}
      </List>

      <Fab
        position="center-bottom"
        slot="fixed"
        text={running ? "Stop" : "Start"}
        onClick={startStop}
      >
        {/* <Icon ios="f7:plus" md="material:add" /> */}
      </Fab>
    </Page>
  );
};
export default HomePage;
