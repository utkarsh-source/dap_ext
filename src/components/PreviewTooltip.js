import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  Button,
  ButtonWrapper,
  PopupWrapper,
  PreviewTooltip,
} from "../styled-component";

const PreviewDescriptionTooltip = (props) => {
  const {
    title,
    taskMessage,
    top,
    left,
    translateX,
    translateY,
    previewStepCount,
    showPreviousTooltip,
    showNextTooltip,
    stepsCount,
    children,
  } = props;

  return (
    <PopupWrapper toggle={true}>
      <PreviewTooltip
        style={{
          top: top + "px",
          left: left + "px",
          transform: `translate(${translateX}%, ${translateY}%)`,
        }}
      >
        <p>{title}</p>
        <div>
          {" "}
          <p>{taskMessage}</p>
        </div>
        <ButtonWrapper>
          <Button
            disabled={previewStepCount.current.value === 1}
            onClick={showPreviousTooltip}
          >
            <FaAngleLeft /> Prev
          </Button>
          <Button
            disabled={previewStepCount.current.value === stepsCount.current}
            onClick={showNextTooltip}
            primary
          >
            Next <FaAngleRight />{" "}
          </Button>
        </ButtonWrapper>
        {children}
      </PreviewTooltip>
    </PopupWrapper>
  );
};

export default PreviewDescriptionTooltip;
