import React, { useState, useContext, useRef, useEffect } from "react";
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
import { removeFocusTrapListener, trapFocus } from "./utils/trapFocus";

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
    timerRef,
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

  const tooltipRef = useRef();

  const submitData = () => {
    if (!data.title || !data.message) {
      toast.error("No fields can be empty!");
      return;
    }
    clearInterval(timerRef.current);
    stepsCount.current++;
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
    removeFocusTrapListener(tooltipRef.current);
    clearInterval(timerRef.current);
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
    clearInterval(timerRef.current);
    enableClick();
    setInit(true);
    setTooltip({ value: false });
    targetElem.current = null;
  };

  useEffect(() => {
    trapFocus(tooltipRef.current);
  }, []);

  return (
    <TooltipBox
      ref={tooltipRef}
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
        <Button primary onClick={() => {}}>
          Done
        </Button>
        <Button onClick={handleNextStep}>
          Next <FaAngleRight />
        </Button>
      </ButtonWrapper>
      {children}
    </TooltipBox>
  );
};

export default Tooltip;
