import React, { createContext, useReducer, useState } from "react";
import {
  CREATE__FLOW__FAIL,
  CREATE__FLOW__SUCCESS,
  CREATE__FLOW__REQUEST,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  VIEW__FLOWS__REQUEST,
  VIEW__FLOWS__SUCCESS,
  VIEW__FLOWS__FAIL,
  DELETE__FLOW__FAIL,
  DELETE__FLOW__SUCCESS,
  TOKEN__REQUEST,
  TOKEN__SUCCESS,
  TOKEN__FAIL,
} from "./src/action/actionType";
const AppContext = createContext({});

const initialState = {
  isLoading: false,
  login: {
    auth: false,
    token: null,
    typeOfUser: null,
    isLoading: true,
  },
  flows: {
    data: [],
    isLoading: false,
  },
};

const reducer = (state, { type, payload }) => {
  console.log(type);
  switch (type) {
    case CREATE__FLOW__REQUEST:
      return { ...state, isLoading: true };
    case CREATE__FLOW__SUCCESS:
      return { ...state, isLoading: false };
    case CREATE__FLOW__FAIL:
      return { ...state, isLoading: false };

    case TOKEN__REQUEST:
      return { ...state, login: { ...state.login, isLoading: true } };
    case TOKEN__SUCCESS:
      return {
        ...state,
        login: {
          auth: payload.auth,
          typeOfUser: payload.typeOfUser,
          token: payload.token,
          isLoading: false,
        },
      };
    case TOKEN__FAIL:
      return { ...state, login: { ...state.login, isLoading: false } };

    case DELETE__FLOW__FAIL:
      return { ...state, isLoading: true };
    case DELETE__FLOW__SUCCESS:
      return { ...state, isLoading: false };
    case DELETE__FLOW__FAIL:
      return { ...state, isLoading: false };

    case VIEW__FLOWS__REQUEST:
      return { ...state, flows: { ...state.flows, isLoading: true } };
    case VIEW__FLOWS__SUCCESS:
      return {
        ...state,
        flows: { ...state.flows, data: payload, isLoading: false },
      };
    case VIEW__FLOWS__FAIL:
      return { ...state, flows: { ...state.flows, isLoading: false } };

    case LOGIN_REQUEST:
      return { ...state, isLoading: true };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        login: {
          auth: payload.auth,
          typeOfUser: payload.typeOfUser,
          token: payload.token,
        },
      };
    case LOGIN_FAIL:
      return { ...state, isLoading: false };

    case LOGOUT_REQUEST:
      return { ...state, isLoading: true };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        login: {
          auth: false,
          token: null,
          typeOfUser: null,
        },
      };
    case LOGOUT_FAIL:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

const AppContextProvider = ({ children }) => {
  const [toggleForm, setFormToggle] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch, toggleForm, setFormToggle };

  return (
    <AppContext.Provider value={{ ...value }}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
