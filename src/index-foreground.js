import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AppContext, AppContextProvider } from "../AppContext";
import Foreground from "./components/Foreground";
import LoaderWrapper from "./components/Loader";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import "./styles/global.scss";
import { getSavedToken } from "./action/action";

const AuthWrapper = () => {
  const {
    dispatch,
    state: {
      login: { auth, token, isLoading },
    },
  } = useContext(AppContext);

  useEffect(() => {
    getSavedToken(dispatch);
  }, []);

  return isLoading ? null : token ? <Foreground /> : <Login />;
};

createRoot(document.getElementById("dap__ext__foreground")).render(
  <AppContextProvider>
    <AuthWrapper />
    <Toaster
      toastOptions={{
        duration: 1000,
        style: {
          maxWidth: "60vw",
        },
      }}
      containerStyle={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translate(-50%)",
        zIndex: 99999999999,
        padding: "10px",
      }}
    />
    <LoaderWrapper />
  </AppContextProvider>
);
