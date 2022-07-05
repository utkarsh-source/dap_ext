import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import ReactLoading from "react-loading";
import { Loader, PopupWrapper } from "../styled-component";

const LoaderWrapper = function () {
  const {
    state: { isLoading },
  } = useContext(AppContext);

  return isLoading ? (
    <PopupWrapper toggle={true}>
      <Loader>
        <ReactLoading
          type="spinningBubbles"
          height={60}
          width={60}
          color="#354259"
        />
      </Loader>
    </PopupWrapper>
  ) : null;
};

export default LoaderWrapper;
