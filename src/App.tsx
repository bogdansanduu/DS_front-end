import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import SignIn from "./components/authentication/SignIn";
import SidebarNav from "./components/sidebar/SidebarNav";
import { RootState } from "./types";
import { INITIAL_STATE_USER } from "./store/reducers/UserReducer";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Main = styled.div`
  flex-grow: 25;
  padding-top: 65px;
`;

function App() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");

    if (localStorageToken) {
      setToken(localStorageToken);
    } else {
      navigate("/home");
    }
  }, [token, navigate, currentUser]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("CONSUMPTION_EXCEEDED", (data) => {
      if (currentUser === INITIAL_STATE_USER) {
        return;
      }

      const { userId, message } = data;

      if (userId === currentUser.id) {
        toast(message, {
          closeOnClick: true,
          autoClose: 5000,
          position: "top-right",
        });

        console.log("CONSUMPTION_EXCEEDED", data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  return token ? (
    <Container>
      <ToastContainer />
      <SidebarNav setToken={setToken} />
      <Main>
        <Outlet />
      </Main>
    </Container>
  ) : (
    <SignIn setToken={setToken} />
  );
}

export default App;
