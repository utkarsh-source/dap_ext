import React, { useState, useContext } from "react";
import { CgClose } from "react-icons/cg";
import { BsFillInfoCircleFill } from "react-icons/bs";
import "./Tooltip.scss";
import { AppContext } from "../../AppContext";
import toast from "react-hot-toast";

function Tooltip(props) {
  const {
    targetElem,
    previewMode,
    top,
    left,
    flowName,
    setTooltip,
    flowData,
    stepsCount,
    translateY,
    setInit,
    title,
    taskMessage,
    previewStepCount,
  } = props;

  const [data, setData] = useState({
    title: "",
    message: "",
  });

  const {
    dispatch,
    state: {
      login: { auth, token },
    },
  } = useContext(AppContext);

  const handleNextStep = (e) => {
    if (!data.title || !data.message) {
      toast.error("No fields can be empty!");
      return;
    }
    stepsCount.current++;
    setTooltip({ value: false });
    setInit({ forAll: true, forTooltip: true });
    flowData.current[flowName] = {
      ...flowData.current[flowName],
      ["step" + stepsCount.current]: {
        title: data.title,
        message: data.message,
        targetElement: targetElem.current,
        targetUrl: window.location.href,
      },
    };
  };

  const handleDismisTooltip = () => {
    setInit({ forAll: true, forTooltip: true });
    setTooltip({ value: false });
    targetElem.current = null;
  };

  return (
    <div
      style={{
        top: top + "px",
        left: left + "px",
        transform: `translateY(${translateY}%)`,
      }}
      className="main__tooltip"
    >
      {previewMode.current ? (
        <div className="preview__mode__wrapper">
          <div className="preview__badge">{previewStepCount.current.value}</div>
          <h2 className="preview__title">{title}</h2>
          <p className="preview__desc">{taskMessage}</p>
        </div>
      ) : (
        <>
          <div className="title__bar">
            <BsFillInfoCircleFill className="show__icon" />
            {previewMode.current ? (
              <h2>{title}</h2>
            ) : (
              <input
                placeholder="Title"
                value={data.title}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, title: e.target.value }))
                }
                type="text"
                className="title"
              ></input>
            )}
            {!previewMode.current && (
              <CgClose
                onClick={handleDismisTooltip}
                className="tooltip__close__btn"
              />
            )}
          </div>
          <div className="main__tooltip__box">
            <input
              placeholder="Description..."
              value={data.message}
              onChange={(e) =>
                setData((prev) => ({ ...prev, message: e.target.value }))
              }
              type="text"
              className="desc"
            ></input>

            <button onClick={handleNextStep} className="ext__tooltip__btn">
              Next
            </button>
          </div>
        </>
      )}
      {props.children}
    </div>
  );
}

export default Tooltip;
