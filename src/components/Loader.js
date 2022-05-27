import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import ReactLoading from "react-loading";
import "./Loader.scss";

const LoaderWrapper = function () {
  const {
    state: {
      isLoading,
      login: { isLoading: loading },
    },
  } = useContext(AppContext);

  return isLoading || loading ? (
    <div className="loader__wrapper">
      <ReactLoading type="bars" height={70} width={70} color="#6f42c1" />
    </div>
  ) : null;
};

export default LoaderWrapper;
