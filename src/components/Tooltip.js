import React, { useState, useContext } from "react";
import { CgClose } from "react-icons/cg";
import { AppContext } from "../../AppContext";
import toast from "react-hot-toast";
import { FaAngleRight } from "react-icons/fa";
import { getFlowData } from "../helper/flowData";
import {
  Button,
  ButtonRounded,
  ButtonWrapper,
  PopupWrapper,
  TooltipBox,
} from "../styled-component";
import { createFlow } from "../action/action";

const Tooltip = (props) => {
  const {
    targetElem,
    setToggleViewMode,
    top,
    left,
    relX,
    relY,
    flowName,
    setTooltip,
    flowData,
    stepsCount,
    translateY,
    translateX,
    applicationName,
    setProgress,
    enableClick,
    setInit,
    removeScrollListener,
    children,
  } = props;

  const [data, setData] = useState({
    title: "",
    message: "",
  });

  const {
    dispatch,
    state: {
      login: { token, databaseID },
    },
  } = useContext(AppContext);

  const submitData = () => {
    if (!data.title || !data.message) {
      toast.error("No fields can be empty!");
      return;
    }
    stepsCount.current++;
    removeScrollListener();
    setToggleViewMode(false);
    enableClick();
    setInit(true);
    setTooltip({ value: false });
    flowData.current[flowName] = {
      ...flowData.current[flowName],
      ["step" + stepsCount.current]: {
        title: data.title,
        message: data.message,
        targetElement: targetElem.current,
        targetUrl: window.location.href,
        targetClickOffsetX: relX,
        targetClickOffsetY: relY,
      },
    };
    chrome.storage.sync.remove([
      "applicationName",
      "flowData",
      "stepsCount",
      "flowName",
      "previewStepCount",
      "progress",
      "toggleViewMode",
      "init",
    ]);
    const flowData = getFlowData(flowData.current, flowName, applicationName);
    createFlow(dispatch, databaseID, token, flowData, setProgress);
  };

  const handleNextStep = (e) => {
    if (!data.title || !data.message) {
      toast.error("No fields can be empty!");
      return;
    }
    removeScrollListener();
    enableClick();
    stepsCount.current++;
    setInit(true);
    setTooltip({ value: false });
    flowData.current[flowName] = {
      ...flowData.current[flowName],
      ["step" + stepsCount.current]: {
        title: data.title,
        message: data.message,
        targetElement: targetElem.current,
        targetUrl: window.location.href,
        targetClickOffsetX: relX,
        targetClickOffsetY: relY,
      },
    };
  };

  const handleDismisTooltip = () => {
    enableClick();
    setInit(true);
    setTooltip({ value: false });
    targetElem.current = null;
    removeScrollListener();
  };

  return (
    <PopupWrapper toggle={true}>
      <TooltipBox
        style={{
          top: top + "px",
          left: left + "px",
          transform: `translate(${translateX}%, ${translateY}%)`,
        }}
      >
        <ButtonRounded
          style={{ position: "absolute", top: "15px", right: "15px" }}
          as={CgClose}
          onClick={handleDismisTooltip}
        />
        <input
          placeholder="Title"
          value={data.title}
          onChange={(e) =>
            setData((prev) => ({ ...prev, title: e.target.value }))
          }
          type="text"
        />
        <textarea
          value={data.message}
          placeholder="Description..."
          onChange={(e) =>
            setData((prev) => ({ ...prev, message: e.target.value }))
          }
        />
        <ButtonWrapper>
          <Button primary onClick={submitData}>
            Done
          </Button>
          <Button onClick={handleNextStep}>
            Next <FaAngleRight />
          </Button>
        </ButtonWrapper>
        {children}
      </TooltipBox>
    </PopupWrapper>
  );
};

export default Tooltip;
