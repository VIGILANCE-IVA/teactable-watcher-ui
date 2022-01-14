import {
  BlockFooter,
  Button,
  f7,
  List,
  ListInput,
  LoginScreenTitle,
  Page,
} from "framework7-react";
import React, { useState } from "react";
import ApiManager from "../js/api";
import store from "../js/store";

const LoginPage = ({ f7router }) => {
  let api = ApiManager();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const addToken = (_token) => {
    store.dispatch("setToken", _token);
    f7router.refreshPage();
  };

  const login = () => {
    api
      .post("/auth/login", {
        username,
        password,
      })
      .then((response) => {
        addToken(response.data.token);
      })
      .catch((err) => {
        f7.toast.show({
          text: err.response?.data?.message || err.message,
          position: "top",
          closeTimeout: 3000,
        });
      });
  };

  return (
    <Page noToolbar noNavbar noSwipeback loginScreen>
      <LoginScreenTitle>Login</LoginScreenTitle>
      <List form>
        <ListInput
          label="Username"
          type="text"
          placeholder="Username"
          value={username}
          onInput={(e) => {
            setUsername(e.target.value);
          }}
        />
        <ListInput
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onInput={(e) => {
            setPassword(e.target.value);
          }}
        />
      </List>
      <List>
        <Button fill style={{ margin: "0 10px 0px 10px" }} onClick={login}>
          Log In
        </Button>
        <BlockFooter>&copy; Vigilance IVA</BlockFooter>
      </List>
    </Page>
  );
};

export default LoginPage;
