import axios from "../../axios";
import {
  CREATE__FLOW__FAIL,
  CREATE__FLOW__REQUEST,
  CREATE__FLOW__SUCCESS,
  DELETE__FLOW__FAIL,
  DELETE__FLOW__REQUEST,
  DELETE__FLOW__SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  TOKEN__FAIL,
  TOKEN__REQUEST,
  TOKEN__SUCCESS,
  VIEW__FLOWS__FAIL,
  VIEW__FLOWS__REQUEST,
  VIEW__FLOWS__SUCCESS,
} from "./actionType";
import { toast } from "react-hot-toast";

export const getSavedToken = (dispatch) => {
  dispatch({ type: TOKEN__REQUEST });
  chrome.storage.sync.get(["token", "auth", "typeOfUser"]).then((response) => {
    if (!response.token) {
      dispatch({ type: TOKEN__FAIL });
    } else {
      dispatch({
        type: TOKEN__SUCCESS,
        payload: {
          token: response.token,
          auth: response.auth,
          typeOfUser: response.typeOfUser,
        },
      });
    }
  });
};

export const createFlow = (dispatch, toolTipData, token, setProgress) => {
  dispatch({ type: CREATE__FLOW__REQUEST });
  axios
    .post(`/Extension/Dashboard/Tasks/createTaskFlow`, toolTipData, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      const { data, status, Message } = response.data;
      if (status != 200) throw data;
      setProgress({ state: "off" });
      dispatch({ type: CREATE__FLOW__SUCCESS });
      toast.success("Task Flow Published!");
    })
    .catch((err) => {
      dispatch({ type: CREATE__FLOW__FAIL });
      if (typeof err !== "object") {
        toast.error(err);
      } else {
        toast.error(
          err.message || err.response.message || "Something went wrong!"
        );
      }
    });
};

export const deleteTaskFlow = (dispatch, flowUseCaseName, token) => {
  dispatch({ type: DELETE__FLOW__REQUEST });
  axios
    .delete(`/Extension/Dashboard/Tasks/deleteTaskFlow/${flowUseCaseName}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      const { data, status, Message } = response.data;
      if (status != 200) throw data;
      dispatch({ type: DELETE__FLOW__SUCCESS });
      viewFlows(dispatch, token);
      toast.success("Flow Deleted!");
    })
    .catch((err) => {
      dispatch({ type: DELETE__FLOW__FAIL });
      if (typeof err !== "object") {
        toast.error(err);
      } else {
        toast.error(
          err.message || err.response.message || "Something went wrong!"
        );
      }
    });
};

export const viewFlows = (dispatch, token) => {
  dispatch({ type: VIEW__FLOWS__REQUEST });
  axios
    .get(`/Extension/Dashboard/Tasks/viewAllTaskFlow`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      const { taskFlows, status, data } = response.data;
      if (status != 200) throw data;
      dispatch({ type: VIEW__FLOWS__SUCCESS, payload: taskFlows });
    })

    .catch((err) => {
      dispatch({ type: VIEW__FLOWS__FAIL });
      if (typeof err !== "object") {
        toast.error(err);
      } else {
        toast.error(
          err.message || err.response.message || "Something went wrong!"
        );
      }
    });
};

export const login = (dispatch, formData) => {
  dispatch({ type: LOGIN_REQUEST });
  axios
    .post(`Login`, formData)
    .then((response) => {
      const { auth, typeOfUser, data, status, token = null } = response.data;
      if (status != 200) throw data;
      dispatch({ type: LOGIN_SUCCESS, payload: { auth, token, typeOfUser } });
      chrome.storage.sync.set({ token, auth, typeOfUser });
      toast.success("Logged in!");
    })
    .catch((err) => {
      dispatch({ type: LOGIN_FAIL });
      if (typeof err !== "object") {
        toast.error(err);
      } else {
        toast.error(
          err.message || err.response.message || "Something went wrong!"
        );
      }
    });
};

export const logout = (dispatch, token, toastId) => {
  dispatch({ type: LOGOUT_REQUEST });
  axios
    .get(`Extension/Dashboard/Logout`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      const { auth, data, token, status } = response.data;
      if (status != 200) throw data;
      dispatch({ type: LOGOUT_SUCCESS, payload: { auth, token } });
      chrome.storage.sync.clear();
      toast.dismiss(toastId);
      toast.success("Logged out!");
    })

    .catch((err) => {
      dispatch({ type: LOGOUT_FAIL });
      if (typeof err !== "object") {
        toast.error(err);
      } else {
        toast.error(
          err.message || err.response.message || "Something went wrong!"
        );
      }
    });
};
