import { Manager } from "socket.io-client";

export default (token) => {
  const manager = new Manager(process.env.BASE_URL, {
    reconnectionDelayMax: 10000,
    query: {},
    extraHeaders: {
      "X-Access-Token": token,
    },
  });

  return manager.socket("/");
};
