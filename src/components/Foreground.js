import React from "react";
import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../../AppContext";
import { MdClose, MdLogout } from "react-icons/md";
import { GoAlert, GoCheck, GoEye, GoMegaphone, GoX } from "react-icons/go";
import Tooltip from "./Tooltip";
import {
  createFlow,
  deleteTaskFlow,
  viewFlows,
  logout,
  viewFeedback,
} from "../action/action";
import { toast } from "react-hot-toast";
import {
  RiArrowGoBackFill as Left,
  RiArrowGoForwardFill as Right,
  RiDeleteBin6Line,
  RiPencilFill,
} from "react-icons/ri";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { MdOutlineAppRegistration } from "react-icons/md";
import { GoCommentDiscussion } from "react-icons/go";
import { GoPrimitiveDot } from "react-icons/go";
import ReactLoading from "react-loading";
import { getFlowData } from "../helper/flowData";
import { BiSearchAlt, BiFilterAlt } from "react-icons/bi";
import { VIEW__FLOWS__SUCCESS } from "../action/actionType";
import Annoucement from "./Annoucement";
import {
  AnnouncementBox,
  Arrow,
  Badge,
  Button,
  ButtonRounded,
  ButtonWrapper,
  CloseButton,
  CurrentFlowBox,
  CurrentFlowInfo,
  ErrorMessage,
  Feedback,
  FilterIcon,
  FlexBox,
  FlowManager,
  FormBox,
  FormHeading,
  HighlighterTooltip,
  HoverHighlighter,
  Icon,
  InfoBox,
  Input,
  InputBox,
  Loader,
  PopupWrapper,
  PreviewBox,
  Ruler,
  Settings,
  ToastBox,
  ToastButtonBox,
  ToastMessage,
} from "../styled-component";
import PreviewDescriptionTooltip from "./PreviewTooltip";

function removeScrollListener() {
  if ("container" in window) {
    console.log(window);
    window.container.removeEventListener("scroll", window.handleScroll);
  } else {
    window.removeEventListener("scroll", window.handleScroll);
  }
}

function onScrollEnd(container, target, tooltipRequisites, callback) {
  let timerId = null;
  let isScrolling = null;

  function calculateTooltipPosition() {
    const { top, left, width, height, pos } = getTargetPosition(target);
    const { title = "", message = "", relX, relY } = tooltipRequisites;
    const arrowPos = getArrowPosition(pos);
    const {
      top: t,
      left: l,
      translateX,
      translateY,
    } = getTooltipPosition(pos, top, left, width, height, relX, relY);
    return {
      value: true,
      top: t,
      left: l,
      translateX,
      translateY,
      arrowPos,
      title,
      taskMessage: message,
      relX,
      relY,
    };
  }

  if (!("window" in container)) {
    window.container = container;
  }
  window.handleScroll = function () {
    isScrolling = true;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      isScrolling = false;
      if (!isScrolling) {
        callback(calculateTooltipPosition());
      }
    }, 25);
  };
  container.addEventListener("scroll", window.handleScroll);
  timerId = setTimeout(() => {
    callback(calculateTooltipPosition());
  }, 30);
}

function closestScrollableParent(target) {
  if (target.tagName === "BODY") return window;
  let computedstyle = window.getComputedStyle(target);
  if (["scroll"].includes(computedstyle.getPropertyValue("overflow-y"))) {
    return target;
  }
  return closestScrollableParent(target.parentElement);
}

function disableClick() {
  document.body.style.pointerEvents = "none";
}

function enableClick() {
  document.body.style.pointerEvents = "auto";
}

function getXPathForElement(element) {
  const idx = (sib, name) =>
    sib
      ? idx(sib.previousElementSibling, name || sib.localName) +
        (sib.localName == name)
      : 1;
  const segs = (elm) =>
    !elm || elm.nodeType !== 1
      ? [""]
      : elm.id && document.getElementById(elm.id) === elm
      ? [`id("${elm.id}")`]
      : [
          ...segs(elm.parentNode),
          elm instanceof HTMLElement
            ? `${elm.localName}[${idx(elm)}]`
            : `*[local-name() = "${elm.localName}"][${idx(elm)}]`,
        ];
  return segs(element).join("/");
}

const getTooltipPosition = (pos, top, left, width, height, relX, relY) => {
  let [translateX, translateY] = [0, 0];
  let offX = (relX * width) / 100;
  let offY = (relY * height) / 100;

  const arrowOffset = 15;

  switch (pos) {
    case "center":
    case "top": {
      top += offY + arrowOffset;
      left += offX;
      translateX = -50;
      break;
    }
    case "left": {
      left += offX + arrowOffset;
      top += offY - 15;
      break;
    }
    case "right": {
      top += offY - 15;
      left += offX - arrowOffset;
      translateX = -100;
      break;
    }
    case "bottom": {
      top += offY - arrowOffset;
      left += offX;
      translateX = -50;
      translateY = -100;
      break;
    }
    case "topleft": {
      top += offY + arrowOffset;
      left += offX;
      break;
    }
    case "topright": {
      top += offY + arrowOffset;
      left += offX + 25;
      translateX = -100;
      break;
    }
    case "bottomleft": {
      top += offY - arrowOffset;
      left += offX - 15;
      translateY = -100;
      break;
    }
    case "bottomright": {
      top += offY - arrowOffset;
      left += offX + 25;
      translateX = -100;
      translateY = -100;
      break;
    }
  }

  return {
    top,
    left,
    translateX,
    translateY,
  };
};

const getArrowPosition = (targetPos) => {
  let arrowPosition = {
    top: {
      top: 0,
      left: "50%",
      transform: "translate(-50%, -50%) rotate(45deg)",
    },
    right: {
      top: "20px",
      right: 0,
      transform: `translate(50%, -50%) rotate(45deg)`,
    },
    left: {
      top: "20px",
      left: 0,
      transform: `translate(-50%, -50%) rotate(45deg)`,
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: `translate(-50%, -50%) rotate(45deg)`,
    },
    topLeft: {
      top: 0,
      left: "15px",
      transform: `translate(0 , -50%) rotate(45deg)`,
    },
    topRigft: {
      top: 0,
      right: "15px",
      transform: `translate(0 , -50%) rotate(45deg)`,
    },
    bottomRight: {
      top: "100%",
      right: "15px",
      transform: `translate(0, -50%) rotate(45deg)`,
    },
    bottomLeft: {
      top: "100%",
      left: "15px",
      transform: `translate(0, -50%) rotate(45deg)`,
    },
  };
  switch (targetPos) {
    case "center":
    case "top": {
      return arrowPosition.top;
    }
    case "left": {
      return arrowPosition.left;
    }
    case "right": {
      return arrowPosition.right;
    }
    case "bottom": {
      return arrowPosition.bottom;
    }
    case "bottomright": {
      return arrowPosition.bottomRight;
    }
    case "topleft": {
      return arrowPosition.topLeft;
    }
    case "bottomleft": {
      return arrowPosition.bottomLeft;
    }
    case "topright": {
      return arrowPosition.topRigft;
    }
  }
};

const getTargetPosition = (element) => {
  let pos = [];
  let [OfTop, OfLeft, OfRight, OfBottom] = [50, 200, 200, 50];
  let { top, left, width, height } = element.getBoundingClientRect();
  if (top <= OfTop) {
    pos.push("top");
  } else if (top + height >= document.documentElement.clientHeight - OfBottom) {
    pos.push("bottom");
  }

  if (left <= OfLeft) {
    pos.push("left");
  } else if (left + width >= document.documentElement.clientWidth - OfRight) {
    pos.push("right");
  }

  return {
    top,
    left,
    width,
    height,
    pos: pos.join("") || "center",
  };
};

const getTargetClickPosition = (e, top, left, width, height) => {
  let [clickX, clickY] = [Math.round(e.clientX), Math.round(e.clientY)];
  let [perX, perY] = [
    Math.round(((clickX - left) / width) * 100),
    Math.round(((clickY - top) / height) * 100),
  ];
  return {
    relX: perX,
    relY: perY,
  };
};

function Foreground() {
  const {
    dispatch,
    state: {
      login: { token, databaseID },
      flows,
      feedback,
    },
  } = useContext(AppContext);

  const [flowName, setFlowName] = useState("");
  const [toggleCreateFlowPopup, setToggleCreateFlowPopup] = useState(false);
  const [progress, setProgress] = useState({
    state: "off",
  });
  const [toggleFeedback, setToggleFeddback] = useState(false);
  const [box, setBox] = useState({ value: false });
  const [showTooltip, setTooltip] = useState({
    value: false,
  });
  const [showExistingFlow, setShowExistingFlow] = useState(false);
  const [applicationName, setApplicationName] = useState("");
  const [init, setInit] = useState(false);
  const [toggleAnnouncement, setToggleAnnouncement] = useState(false);
  const [toggleViewMode, setToggleViewMode] = useState(false);

  const previewStepCount = useRef({ value: 1 });

  const stepsCount = useRef(0);

  const targetElem = useRef({
    index: null,
    tagName: "",
  });

  const { current: prevCord } = useRef({ x: 0, y: 0 });

  const flowData = useRef({});

  const stopFlowView = () => {
    removeScrollListener();
    setToggleViewMode(false);
    setTooltip({ value: false });
  };

  const showPreviousTooltip = () => {
    previewStepCount.current = {
      value:
        previewStepCount.current.value === 1
          ? 1
          : previewStepCount.current.value - 1,
      action: "prev",
    };
    viewFlow(flowName);
  };

  const showNextTooltip = () => {
    previewStepCount.current = {
      value:
        previewStepCount.current.value >= stepsCount.current
          ? stepsCount.current
          : previewStepCount.current.value + 1,
      action: "next",
    };

    viewFlow(flowName);
  };

  const appendPreviewTooltip = (target, info) => {
    const { message, title, targetClickOffsetX, targetClickOffsetY } = info;

    let scrollableContainer = closestScrollableParent(target);

    const tooltipRequisites = {
      title,
      message,
      relX: targetClickOffsetX,
      relY: targetClickOffsetY,
    };

    onScrollEnd(scrollableContainer, target, tooltipRequisites, setTooltip);

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  };

  const addRestriction = (e) => {
    const target = e.target;
    e.preventDefault(); // to stop Focus Events on Target Element
    e.stopPropagation(); // to stop Focus Events on Target Element
    disableClick();
    const xPath = getXPathForElement(target);
    targetElem.current = {
      xPath,
      tagName: target.tagName,
    };
    prevCord.x = 0;
    prevCord.y = 0;
    appendTooltip(e);
    setInit(false);
    window.currentTarget.removeEventListener("pointerdown", addRestriction);
  };

  const handleHoverInpect = (e) => {
    const target = e.target;

    if (!target.tagName) return;

    let { pos, top, left, width, height } = getTargetPosition(target);

    if (prevCord.x === left && prevCord.y === top) return;

    if (window.currentTarget && target !== window.currentTarget) {
      window.currentTarget.removeEventListener("pointerdown", addRestriction);
    }

    window.currentTarget = target;

    prevCord.x = left;
    prevCord.y = top;

    let translateX = "-3px";
    let translateY = 0;

    switch (pos) {
      case "top":
      case "topright":
      case "topleft": {
        translateY = height + 10 + "px";
        break;
      }
      case "center":
      case "left":
      case "right":
      case "bottom":
      case "bottomleft":
      case "bottomright": {
        translateY = "calc(-100% - 10px)";
        break;
      }
    }

    setBox({
      value: true,
      translateX,
      translateY,
      top,
      left,
      width,
      height,
      tagName: target.tagName,
    });

    target.addEventListener("pointerdown", addRestriction, false); // to prevent target element onClick handler while inspecting
  };

  const appendTooltip = (e) => {
    const target = e.target;
    const scrollableContainer = closestScrollableParent(target);
    const { top, left, width, height, pos } = getTargetPosition(target);
    const { relX, relY } = getTargetClickPosition(e, top, left, width, height);
    const tooltip_requisites = {
      relX,
      relY,
    };
    setBox({ value: false });
    onScrollEnd(scrollableContainer, target, tooltip_requisites, setTooltip);
  };

  const handleLogout = () => {
    disableClick();
    toast(
      (tst) => (
        <ToastBox>
          <div>
            <ToastMessage>
              <GoAlert /> Process will clear your data!
            </ToastMessage>
            <ToastButtonBox>
              <button
                onClick={() => {
                  enableClick();
                  logout(dispatch, databaseID, token, tst.id);
                  toast.remove(tst.id);
                }}
              >
                <GoCheck />
              </button>
              <button
                onClick={() => {
                  enableClick();
                  toast.remove(tst.id);
                }}
              >
                <GoX />
              </button>
            </ToastButtonBox>
          </div>
        </ToastBox>
      ),
      {
        id: "page__change__popup",
        duration: Infinity,
      }
    );
  };

  const handleRemoveHoverInpect = (e) => {
    window.currentTarget.removeEventListener("pointerdown", addRestriction);
    enableClick();
    if (e.code === "Escape") {
      chrome.storage.sync.set({
        flowData: flowData.current,
        stepsCount: stepsCount.current,
        previewStepCount: previewStepCount.current.value,
        progress: stepsCount.current > 0 ? "paused" : "off",
        flowName,
        applicationName,
        toggleViewMode: false,
        init,
      });
      setProgress({ state: stepsCount.current > 0 ? "paused" : "off" });
      setInit(false);
      setBox({ value: false });
      setTooltip({ value: false });
    }
  };

  const addHoverInspect = () => {
    if (!flowName) {
      toast((tst) => (
        <ToastBox>
          <div>
            <ToastMessage>
              <GoAlert /> Use Case is required to proceed !
            </ToastMessage>
          </div>
        </ToastBox>
      ));
      return;
    }
    enableClick();
    previewStepCount.current = {
      value: 1,
    };
    setInit(true);
    setProgress({ state: "on" });
    setToggleCreateFlowPopup(false);
  };

  const initFlowCreation = (value) => {
    setToggleViewMode(false);
    setToggleCreateFlowPopup(value);
    setTooltip({ value: false });
    stepsCount.current = 0;
    setShowExistingFlow(false);
  };

  useEffect(() => {
    if (showExistingFlow) viewFlows(dispatch, databaseID, token);
  }, [showExistingFlow]);

  function isCurrentDomain(targetUrl) {
    const getDomain = (url) => {
      return url.split("/")[2].split(".").slice(-2)[0];
    };

    const currentDomain = getDomain(window.location.href);

    const targetUrlDomain = getDomain(targetUrl);

    return currentDomain === targetUrlDomain;
  }

  const findTarget = (targetInfo) => {
    let { tagName, xPath } = targetInfo;

    let elements = Array.from(
      document.body.querySelectorAll(tagName.toLowerCase())
    );

    const target = elements.find(
      (element) => getXPathForElement(element) === xPath
    );

    return target;
  };

  const viewFlow = (taskName) => {
    const { targetUrl, targetElement } =
      flowData.current[taskName]["step" + previewStepCount.current.value];

    if (isCurrentDomain(targetUrl)) {
      if (targetUrl === window.location.href) {
        const target = findTarget(targetElement);
        if (!target) {
          toast(
            (tst) => (
              <ToastBox>
                <div>
                  <ToastMessage>
                    <GoAlert /> Failed to load tooltip!
                  </ToastMessage>
                </div>
              </ToastBox>
            ),
            {
              id: "flow__view__error__popup",
            }
          );
        } else {
          target.style.pointerEvents = "auto";

          target.addEventListener("pointerdown", onTargetClicked);

          const onTargetClicked = (e) => {
            if (previewStepCount.current === stepsCount.current) {
              disableClick();
              toast(
                (tst) => (
                  <PopupWrapper toggle={true}>
                    <ToastBox>
                      <div>
                        <ToastMessage>
                          <GoVerified /> Flow Completed!
                        </ToastMessage>
                        <ToastButtonBox single>
                          <button onClick={enableClick}>
                            <GoX />
                          </button>
                        </ToastButtonBox>
                      </div>
                    </ToastBox>
                  </PopupWrapper>
                ),
                {
                  id: "flow__completed__popup",
                }
              );
              setToggleViewMode(false);
              // setTooltip({ value: false });
            } else {
              previewStepCount.current = {
                value:
                  previewStepCount.current.value >= stepsCount.current
                    ? stepsCount.current
                    : previewStepCount.current.value + 1,
                action: "next",
              };

              chrome.storage.sync.set({
                flowData: flowData.current,
                stepsCount: stepsCount.current,
                previewStepCount: previewStepCount.current.value,
                progress: progress.state,
                flowName,
                applicationName,
                init,
                toggleViewMode: true,
              });
            }

            target.removeEventListener("pointerdown", onTargetClicked);
          };

          const info =
            flowData.current[taskName]["step" + previewStepCount.current.value];

          appendPreviewTooltip(target, info);
        }
      } else {
        disableClick();
        toast(
          (tst) => (
            <ToastBox>
              <div>
                <ToastMessage>
                  <GoAlert />
                  Tooltip appears to be on a different page proceed:-
                </ToastMessage>
                <ToastButtonBox>
                  <button
                    onClick={() => {
                      enableClick();
                      handlePageChange(taskName);
                    }}
                  >
                    <GoCheck />
                  </button>
                  <button
                    onClick={() => {
                      enableClick();
                      switch (previewStepCount.current.action) {
                        case "prev": {
                          previewStepCount.current = {
                            value: previewStepCount.current.value + 1,
                          };
                          break;
                        }
                        case "next": {
                          previewStepCount.current = {
                            value: previewStepCount.current.value - 1,
                          };
                          break;
                        }
                      }
                      toast.remove(tst.id);
                    }}
                  >
                    <GoX />
                  </button>
                </ToastButtonBox>
              </div>
            </ToastBox>
          ),
          {
            id: "page__change__popup",
            duration: Infinity,
          }
        );
      }
    } else {
      disableClick();
      toast(
        (tst) => (
          <ToastBox>
            <div>
              <ToastMessage>
                <GoAlert />
                Flow does not belong to this domain visit:-
              </ToastMessage>
              <ToastButtonBox>
                <button
                  onClick={() => {
                    enableClick();
                    toast.remove(tst.id);
                  }}
                >
                  <GoCheck />
                </button>
                <button
                  primary
                  onClick={() => {
                    enableClick();
                    const port = chrome.runtime.connect({
                      name: "content_script",
                    });
                    port.postMessage({ type: "newTab", url: targetUrl });
                    toast.remove(tst.id);
                  }}
                >
                  <GoX />
                </button>
              </ToastButtonBox>
            </div>
          </ToastBox>
        ),
        {
          id: "flow__view__error__popup",
          duration: Infinity,
        }
      );
    }
  };

  const discardProgress = () => {
    enableClick();
    setToggleViewMode(false);
    setTooltip({ value: false });
    setFlowName("");
    setApplicationName("");
    setInit(false);
    setProgress({ state: "off" });
    flowData.current[flowName] = {};
    stepsCount.current = 0;
    chrome.storage.sync.remove([
      "applicationName",
      "flowData",
      "stepsCount",
      "flowName",
      "previewStepCount",
      "progress",
    ]);
    chrome.storage.sync.set({ tabUrl: window.location.href });
  };

  const handlePageChange = (taskName) => {
    chrome.storage.sync.set({
      flowData: flowData.current,
      flowName: taskName,
      stepsCount: stepsCount.current,
      previewStepCount: previewStepCount.current.value,
      progress: progress.state,
      applicationName,
      init,
      toggleViewMode: true,
    });

    let URL_TO_NAVIGATE =
      flowData.current[taskName]["step" + previewStepCount.current.value]
        ?.targetUrl;

    window.location.href = URL_TO_NAVIGATE;
  };

  const viewExistingFlow = (flow) => {
    setShowExistingFlow(false);

    const { applicationTaskFlowUseCase, taskList } = flow;

    setFlowName(applicationTaskFlowUseCase);

    flowData.current[applicationTaskFlowUseCase] = {};

    taskList.forEach((task) => {
      flowData.current[applicationTaskFlowUseCase]["step" + task.stepNumber] = {
        targetElement: {
          tagName: task.htmlTag,
          xPath: task.xPath,
        },
        message: task.taskMessage,
        targetUrl: task.targetURL,
        title: task.title,
        targetClickOffsetX: task.targetClickOffsetX,
        targetClickOffsetY: task.targetClickOffsetY,
      };
    });

    stepsCount.current = taskList.length;
    previewStepCount.current.value = 1;

    setToggleViewMode(true);

    viewFlow(applicationTaskFlowUseCase);
  };

  const submitData = () => {
    setToggleViewMode(false);
    chrome.storage.sync.remove([
      "flowData",
      "flowName",
      "stepsCount",
      "previewStepCount",
      "applicationName",
    ]);
    setTooltip({ value: false });
    const data = getFlowData(flowData.current, flowName, applicationName);
    createFlow(dispatch, databaseID, token, data, setProgress);
  };

  const deleteExistingFlow = (flowUseCaseName) => {
    disableClick();
    toast(
      (tst) => (
        <ToastBox>
          <div>
            <ToastMessage>
              <GoAlert /> Are you sure?
            </ToastMessage>
            <ToastButtonBox>
              <button
                onClick={() => {
                  enableClick();
                  deleteTaskFlow(dispatch, databaseID, token, flowUseCaseName);
                  toast.remove(tst.id);
                }}
              >
                <GoCheck />
              </button>
              <button
                onClick={() => {
                  enableClick();
                  toast.remove(tst.id);
                }}
              >
                <GoX />
              </button>
            </ToastButtonBox>
          </div>
        </ToastBox>
      ),
      {
        id: "flow__delete_popup",
        duration: Infinity,
      }
    );
  };

  const handleFlowSearch = (e) => {};

  useEffect(() => {
    if (init) {
      document.body.addEventListener("keydown", handleRemoveHoverInpect);
      document.body.addEventListener("pointermove", handleHoverInpect);
      return () => {
        document.body.removeEventListener("keydown", handleRemoveHoverInpect);
        document.body.removeEventListener("pointermove", handleHoverInpect);
      };
    }
  }, [init]);

  useEffect(() => {
    if (toggleFeedback) {
      viewFeedback(dispatch, databaseID, token);
    }
  }, [toggleFeedback]);

  useEffect(() => {
    chrome.storage.sync.get(
      [
        "flowData",
        "stepsCount",
        "flowName",
        "previewStepCount",
        "progress",
        "applicationName",
        "toggleViewMode",
      ],
      function (savedData) {
        if (Object.keys(savedData).length > 0) {
          stepsCount.current = savedData.stepsCount;
          previewStepCount.current = { value: savedData.previewStepCount };
          setInit(savedData.init);
          if (savedData.flowName) {
            flowData.current[savedData.flowName] =
              savedData.flowData[savedData.flowName];
            if (savedData.toggleViewMode) {
              setToggleViewMode(savedData.toggleViewMode);
              setTimeout(() => {
                viewFlow(savedData.flowName);
              }, 50);
            }
            setFlowName(savedData.flowName);
            setApplicationName(savedData.applicationName);
            setProgress({ state: savedData.progress });
          }
        }
      }
    );
  }, []);

  return (
    <>
      <div>
        <Settings
          toggle={
            (["paused", "off"].includes(progress.state) && !toggleViewMode) ||
            undefined
          }
        >
          <FlexBox>
            <Button primary onClick={() => setToggleAnnouncement(true)}>
              <GoMegaphone />
            </Button>
            {token && (
              <Button onClick={handleLogout}>
                <MdLogout /> <span>Logout</span>
              </Button>
            )}
            <Button onClick={() => setShowExistingFlow(true)}>
              {" "}
              Flow Manager
            </Button>
            {progress.state === "paused" && stepsCount.current > 0 && (
              <Button
                onClick={() => {
                  setToggleViewMode(true);
                  viewFlow(flowName);
                }}
              >
                <GoEye /> <span>Preview</span>
              </Button>
            )}{" "}
          </FlexBox>
          <FlexBox>
            {["off"].includes(progress.state) && (
              <Button
                primary
                onClick={() => {
                  disableClick();
                  initFlowCreation(true);
                }}
              >
                Create New Flow
              </Button>
            )}
            {stepsCount.current > 0 &&
              ["paused", "on"].includes(progress.state) && (
                <Button type="button" onClick={discardProgress}>
                  Discard{" "}
                </Button>
              )}
            {stepsCount.current > 0 && progress.state === "paused" && (
              <Button type="button" onClick={addHoverInspect}>
                Continue{" "}
              </Button>
            )}
            {stepsCount.current > 0 &&
              ["paused", "on"].includes(progress.state) && (
                <Button onClick={submitData}>Save </Button>
              )}
            <Button
              type="button"
              primary
              onClick={() => setToggleFeddback(true)}
            >
              <GoCommentDiscussion />
            </Button>
          </FlexBox>
        </Settings>

        <PopupWrapper toggle={toggleCreateFlowPopup}>
          <FormBox
            onSubmit={(e) => {
              e.preventDefault();
              addHoverInspect();
            }}
            toggle={toggleCreateFlowPopup}
          >
            <FormHeading>Create Flow</FormHeading>
            <InputBox>
              <Icon as={MdOutlineAppRegistration} />
              <Input
                placeholder="Application name..."
                onChange={(e) => setApplicationName(e.target.value)}
                value={applicationName}
                type="text"
              />
            </InputBox>

            <InputBox>
              <Icon as={RiPencilFill} />
              <Input
                placeholder="Flow use case..."
                onChange={(e) => setFlowName(e.target.value)}
                value={flowName}
                type="text"
              />
            </InputBox>
            <Ruler />
            <ButtonWrapper>
              <Button
                type="button"
                onClick={() => {
                  enableClick();
                  initFlowCreation(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" primary>
                Add
              </Button>
            </ButtonWrapper>
          </FormBox>
        </PopupWrapper>
      </div>
      {box.value && (
        <>
          <HoverHighlighter
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
            }}
          ></HoverHighlighter>
          <HighlighterTooltip
            style={{
              top: box.top,
              left: box.left,
              transform: `translate(${box.translateX}, ${box.translateY})`,
            }}
          >
            {box.tagName}
          </HighlighterTooltip>
        </>
      )}
      {showTooltip.value &&
        (toggleViewMode ? (
          <PreviewDescriptionTooltip
            {...{
              previewStepCount,
              ...showTooltip,
              showPreviousTooltip,
              showNextTooltip,
              stepsCount,
            }}
          >
            <Arrow style={{ ...showTooltip.arrowPos }}></Arrow>
          </PreviewDescriptionTooltip>
        ) : (
          <Tooltip
            {...{
              setProgress,
              setToggleViewMode,
              targetElem,
              stepsCount,
              setTooltip,
              flowName,
              flowData,
              ...showTooltip,
              applicationName,
              applicationName,
              disableClick,
              enableClick,
              setInit,
              removeScrollListener,
            }}
          >
            <Arrow style={{ ...showTooltip.arrowPos }}></Arrow>
          </Tooltip>
        ))}
      <FlowManager toggle={showExistingFlow}>
        <ButtonRounded
          style={{ marginBottom: "10px", marginTop: "10px" }}
          as={MdClose}
          onClick={() => setShowExistingFlow(false)}
        />
        <FlexBox>
          <InputBox height="50px">
            <Icon as={BiSearchAlt} />
            <input
              onChange={handleFlowSearch}
              type="text"
              placeholder="Search flows..."
            />
          </InputBox>
          <FilterIcon as={BiFilterAlt} />
        </FlexBox>
        {flows.isLoading ? (
          <Loader
            style={{
              backgroundColor: "transparent",
              boxShadow: "0 0 0 0 white",
            }}
          >
            <ReactLoading type="spinningBubbles" height={60} width={60} />
          </Loader>
        ) : flows.data.length > 0 ? (
          <ul>
            {flows.data.map((flow, index) => {
              return (
                <li key={flow.taskID}>
                  <span>{flow.applicationTaskFlowUseCase}</span>
                  <Ruler />
                  <ButtonWrapper
                    style={{
                      placeContent: "end",
                      gridTemplateColumns: "repeat(2, max-content)",
                    }}
                  >
                    <Button
                      style={{
                        padding: "5px",
                        width: "max-content",
                        height: "max-content",
                      }}
                      onClick={() =>
                        deleteExistingFlow(flow.applicationTaskFlowUseCase)
                      }
                    >
                      <RiDeleteBin6Line /> <span>Delete</span>
                    </Button>

                    <Button
                      style={{
                        padding: "5px 10px",
                        width: "max-content",
                        height: "max-content",
                      }}
                      primary
                      onClick={() => viewExistingFlow(flow)}
                    >
                      <BsFillEyeFill />
                      <span>View</span>
                    </Button>
                  </ButtonWrapper>
                </li>
              );
            })}
          </ul>
        ) : (
          <ErrorMessage>No Existing Flows !</ErrorMessage>
        )}
      </FlowManager>
      <InfoBox toggle={progress.state === "on" || undefined}>
        Press <span>ESC</span> to interact with the page
      </InfoBox>
      <PreviewBox toggle={toggleViewMode || undefined}>
        <span>
          <GoPrimitiveDot /> viewing...
        </span>
        <button onClick={() => stopFlowView()}>
          <GoX />
        </button>
      </PreviewBox>
      <Feedback toggle={toggleFeedback || undefined}>
        <ul>
          {feedback.isLoading ? (
            <ReactLoading
              type="spinningBubbles"
              height={50}
              width={50}
              color="black"
            />
          ) : feedback.data.length > 0 ? (
            feedback.data[0].feedBackQuestions.map(
              (
                {
                  feedBackQuestion,
                  feedBackQuestionOptions,
                  feedBackQuestionType,
                },
                index
              ) => {
                return (
                  <li key={index}>
                    <p>
                      Question {index + 1} <span>{feedBackQuestion}</span>{" "}
                    </p>
                    <ul>
                      {feedBackQuestionOptions.map(({ image, text }, index) => {
                        return (
                          <li key={index}>
                            {" "}
                            <input
                              data-value={text}
                              type={
                                feedBackQuestionType === "radio-button"
                                  ? "radio"
                                  : "checkbox"
                              }
                            />{" "}
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
            )
          ) : (
            <ErrorMessage>No Data Available !</ErrorMessage>
          )}
          <Ruler />
          <ButtonWrapper>
            <Button onClick={() => setToggleFeddback(false)}>Cancel</Button>
            <Button primary>Send</Button>
          </ButtonWrapper>
        </ul>
      </Feedback>
      <Annoucement
        toggle={toggleAnnouncement}
        setToggle={setToggleAnnouncement}
      />
    </>
  );
}

export default Foreground;
