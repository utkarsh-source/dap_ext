import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AppContext, AppContextProvider } from "../AppContext";
import Foreground from "./components/Foreground";
import LoaderWrapper from "./components/Loader";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { getSavedToken } from "./action/action";
import { useLayoutEffect } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { theme } from "./theme";

const AuthWrapper = () => {
  const {
    dispatch,
    state: {
      isLoading,
      login: { token },
    },
  } = useContext(AppContext);

  useLayoutEffect(() => {
    getSavedToken(dispatch);
  }, []);

  return isLoading ? null : token ? <Foreground /> : <Login />;
};

createRoot(
  document
    .getElementById("dap__ext__foreground")
    .shadowRoot.querySelector("#react-root")
).render(
  <StyleSheetManager
    target={document.getElementById("dap__ext__foreground").shadowRoot}
  >
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <AuthWrapper />
        <Toaster
          toastOptions={{
            duration: 1000,
          }}
          containerStyle={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translate(-50%)",
            zIndex: 2147483647,
            pointerEvents: "auto",
            width: 0,
            height: 0,
            overflow: "visible",
            isolation: "isolate",
          }}
        />
        <LoaderWrapper />
      </AppContextProvider>
    </ThemeProvider>
  </StyleSheetManager>
);
