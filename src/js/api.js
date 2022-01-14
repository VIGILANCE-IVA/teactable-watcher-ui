import axios from "axios";

export default (token) => {
  return axios.create({
    baseURL: `${process.env.BASE_URL}/api`,
    headers: { "X-Access-Token": token },
  });
};
