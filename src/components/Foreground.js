import React from "react";
import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../../AppContext";
import { MdClose } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import "./Foreground.scss";
import Tooltip from "./Tooltip";
import {
  createFlow,
  deleteTaskFlow,
  logout,
  viewFlows,
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
import { GoPrimitiveDot } from "react-icons/go";
import ReactLoading from "react-loading";
import { getFlowData } from "../helper/flowData";

function Foreground() {
  const {
    dispatch,
    state: {
      login: { token },
      flows,
    },
  } = useContext(AppContext);

  const [flowName, setFlowName] = useState("");
  const flowNameRef = useRef(null);
  const [isFlowActive, setFlowActive] = useState(false);
  const [progress, setProgress] = useState({
    state: "off",
  });
  const [existingFlowName, setExistingFlowName] = useState({ value: null });
  const [box, setBox] = useState({ value: false });
  const [init, setInit] = useState({ forTooltip: false, forAll: false });
  const [showTooltip, setTooltip] = useState({ value: false, top: 0, left: 0 });
  const [showExistingFlow, setShowExistingFlow] = useState(false);
  const [applicationName, setApplicationName] = useState("");

  const previewMode = useRef(false);

  const previewStepCount = useRef({ value: 1, action: "next" });

  const stepsCount = useRef(0);

  const escapeRef = useRef(false);

  const existingFlowNameRef = useRef(null);

  const targetElem = useRef({
    index: null,
    tagName: "",
  });

  const { current: prevCord } = useRef({ x: 0, y: 0 });

  const flowData = useRef({});

  const clickedElement = useRef([]);

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

  const addRestriction = (e) => {
    if (escapeRef.current) return;
    e.preventDefault();
    const target = e.target;
    clickedElement.current.push(target);
    const xPath = getXPathForElement(target);
    target.style.pointerEvents = "none";
    appendTooltip(e);
    targetElem.current = {
      xPath,
      tagName: target.tagName,
    };
    setInit({ forAll: true, forTooltip: false });
    prevCord.x = 0;
    prevCord.y = 0;
    setTimeout(() => {
      target.style.pointerEvents = "auto";
    }, 400);
  };

  const handleHoverInpect = (e) => {
    const target = e.target;

    if (!target.tagName) return;

    let domRect = target.getBoundingClientRect();

    if (prevCord.x === domRect.x && prevCord.y === domRect.y) return;

    prevCord.x = domRect.x;
    prevCord.y = domRect.y;

    target.addEventListener("pointerdown", addRestriction);

    let box = {
      left: domRect.left + window.scrollX,
      top: domRect.top + window.scrollY,
      height: domRect.height,
      width: domRect.width,
      tagName: target.tagName,
    };

    let offsetY = box.top - 50 < 0 ? 60 : -60;
    box.offsetY = offsetY;

    setBox({ value: true, ...box });
  };

  const appendTooltip = (e, title = "", taskMessage = "") => {
    let top = e.clientY + window.scrollY;
    let left = e.clientX + window.scrollX;
    let translateY;
    let [clientX, clientY] = [e.clientX, e.clientY];
    let arrowPosition = {
      up: {
        top: 0,
        left: "50%",
        transform: "translate(-50%, -50%) rotate(45deg)",
      },
      right: {
        top: "50%",
        right: 0,
        transform: `translate(50%, -50%) rotate(45deg)`,
      },
      left: {
        top: "50%",
        left: 0,
        transform: `translate(-50%, -50%) rotate(45deg)`,
      },
      down: {
        bottom: 0,
        left: "50%",
        transform: `translate(50%, -50%) rotate(45deg)`,
      },
      topLeft: {
        top: 0,
        left: "15px",
        transform: `translate(0 , -50%) rotate(45deg)`,
      },
    };
    let arrowPos = arrowPosition.up;

    if (clientX <= 325 / 2) {
      (top += 25), (left -= 20), (arrowPos = arrowPosition.topLeft);
    } else if (window.innerWidth - clientX <= 325 / 2 - 25) {
      left -= 350 + 25;
      translateY = -50;
      arrowPos = arrowPosition.right;
    } else {
      top += 25;
      left -= 350 / 2;
    }

    setTooltip({
      value: true,
      top,
      left,
      translateY,
      arrowPos,
      title,
      taskMessage,
    });
  };

  const handleLogout = () => {
    document.body.style.pointerEvents = "none";
    toast(
      (tst) => (
        <div>
          <h4>Process will clear your data. SURE!</h4>
          <span className="logout__popup__buttons">
            <button
              onClick={() => {
                document.body.style.pointerEvents = "auto";
                logout(dispatch, token, tst.id);
              }}
            >
              Proceed
            </button>
            <button
              onClick={() => {
                document.body.style.pointerEvents = "auto";
                toast.dismiss(tst.id);
              }}
            >
              Dismiss
            </button>
          </span>
        </div>
      ),
      {
        id: "page__change__popup",
        duration: Infinity,
      }
    );
  };

  const handleRemoveHoverInpect = (e) => {
    if (e.code === "Escape") {
      chrome.storage.sync.set({
        flowData: flowData.current,
        flowName: flowNameRef.current,
        existingFlowName: existingFlowNameRef.current,
        stepsCount: stepsCount.current,
        previewStepCount: previewStepCount.current.value,
        progress: progress.state === "off" ? "off" : "paused",
        applicationName,
      });
      clickedElement.current.forEach((element) => {
        element.style.pointerEvents = "auto";
        element.removeEventListener("pointerdown", addRestriction);
      });
      setProgress((prev) => ({
        state: prev.state === "off" ? "off" : "paused",
      }));
      escapeRef.current = true;
      setInit({ forAll: false, forTooltip: false });
      setBox({ value: false });
      setTooltip({ value: false });
    }
  };

  const addHoverInspect = () => {
    if (!flowName) {
      toast.error("Use Case is required to proceed !");
      return;
    }
    flowNameRef.current = flowName;
    previewStepCount.current = {
      value: 1,
    };
    setProgress({ state: "on" });
    setInit({ forAll: true, forTooltip: true });
    escapeRef.current = false;
    setFlowActive(false);
  };

  const initFlowCreation = (value) => {
    setExistingFlowName({ value: null });
    existingFlowNameRef.current = null;
    previewMode.current = false;
    setTooltip({ value: false });
    stepsCount.current = 0;
    setShowExistingFlow(false);
    setFlowActive(value);
  };

  useEffect(() => {
    if (showExistingFlow) viewFlows(dispatch, token);
  }, [showExistingFlow]);

  const handlePrev = () => {
    previewStepCount.current = {
      value:
        previewStepCount.current.value === 1
          ? 1
          : previewStepCount.current.value - 1,
      action: "prev",
    };

    if (existingFlowName.value) {
      handlePreview(false, existingFlowName.value);
    } else {
      handlePreview(false, flowNameRef.current);
    }
  };

  const handleNext = () => {
    previewStepCount.current = {
      value:
        previewStepCount.current.value >= stepsCount.current
          ? stepsCount.current
          : previewStepCount.current.value + 1,
      action: "next",
    };
    if (existingFlowName.value) {
      handlePreview(false, existingFlowName.value);
    } else {
      handlePreview(false, flowNameRef.current);
    }
  };

  const handlePreview = (shouldToggle, taskName) => {
    const {
      targetUrl,
      targetElement: { tagName, xPath },
    } = flowData.current[taskName]["step" + previewStepCount.current.value];

    const currentDomain = window.location.href
      .split("/")[2]
      .split(".")
      .slice(-2)[0];

    const targetUrlDomain = targetUrl.split("/")[2].split(".").slice(-2)[0];

    if (currentDomain !== targetUrlDomain) {
      document.body.style.pointerEvents = "none";
      toast(
        (tst) => (
          <div>
            <h4 style={{ display: "inline-block", marginRight: "7px" }}>
              Flow does not belong to this domain! Visit
            </h4>
            <p className="domain__change__popup">{targetUrlDomain}</p>
            <span className="domain__change__popup__buttons">
              <button
                onClick={() => {
                  document.body.style.pointerEvents = "auto";
                  setExistingFlowName({ value: null });
                  existingFlowNameRef.current = null;
                  chrome.runtime
                    .sendMessage({
                      openNewTab: { value: true, url: targetUrl },
                    })
                    .then((res) => console.log(res))
                    .catch((err) => {});
                  toast.dismiss(tst.id);
                }}
              >
                Visit
              </button>
              <button
                onClick={() => {
                  setExistingFlowName({ value: null });
                  existingFlowNameRef.current = null;
                  document.body.style.pointerEvents = "auto";
                  toast.dismiss(tst.id);
                }}
              >
                Dismiss
              </button>
            </span>
          </div>
        ),
        {
          id: "flow__view__error__popup",
          duration: Infinity,
        }
      );
      return;
    }

    if (targetUrl === window.location.href) {
      if (shouldToggle) {
        previewMode.current = !previewMode.current;
        setTooltip({ value: previewMode.current });
      }

      if (!previewMode.current) return;

      let elements = Array.from(
        document.body.querySelectorAll(tagName.toLowerCase())
      );

      const target = elements.find(
        (element) => getXPathForElement(element) === xPath
      );

      if (!target) {
        document.body.style.pointerEvents = "none";
        toast(
          (tst) => (
            <div>
              <h4 style={{ display: "inline-block", marginRight: "7px" }}>
                Failed to load tooltip. Apologies!
              </h4>
              <span className="flow__view__error__popup__button">
                <button
                  onClick={() => {
                    setExistingFlowName({ value: null });
                    existingFlowNameRef.current = null;
                    document.body.style.pointerEvents = "auto";
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
                    toast.dismiss(tst.id);
                  }}
                >
                  Dismiss
                </button>
              </span>
            </div>
          ),
          {
            id: "flow__view__error__popup",
            duration: Infinity,
          }
        );
        return;
      }

      const handleTarget = (e) => {
        const target = e.target;

        if (previewStepCount.current === stepsCount.current) {
          previewMode.current = false;
          setTooltip({ value: false });
        }

        target.removeEventListener("mousedown", handleTarget);
      };

      target.addEventListener("mousedown", handleTarget);

      let rect = target.getBoundingClientRect();
      const box = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      };

      const { title, message } =
        flowData.current[taskName]["step" + previewStepCount.current.value];

      appendTooltip(box, title, message);
    } else {
      document.body.style.pointerEvents = "none";
      toast(
        (tst) => (
          <div>
            <h4>Seems like tooltip is on a different page.</h4>
            <p className="page__change__popup__target__url">{targetUrl}</p>
            <span className="page__change__popup__buttons">
              <button onClick={handlePageChange}>Proceed</button>
              <button
                onClick={() => {
                  document.body.style.pointerEvents = "auto";
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
                  toast.dismiss(tst.id);
                }}
              >
                Dismiss
              </button>
            </span>
          </div>
        ),
        {
          id: "page__change__popup",
          duration: Infinity,
        }
      );
    }
  };

  const continueProgress = () => {
    addHoverInspect();
  };

  const discardProgress = () => {
    previewMode.current = false;
    setTooltip({ value: false });
    flowNameRef.current = null;
    setFlowName("");
    setApplicationName("");
    setProgress({ state: "off" });
    flowData.current[flowNameRef.current] = {};
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

  const handlePageChange = () => {
    chrome.storage.sync.set({
      flowData: flowData.current,
      flowName: flowNameRef.current,
      existingFlowName: existingFlowNameRef.current,
      stepsCount: stepsCount.current,
      previewStepCount: previewStepCount.current.value,
      progress: progress.state,
      applicationName,
    });

    document.body.style.pointerEvents = "auto";

    let taskFlowName = existingFlowNameRef.current || flowNameRef.current;

    let URL_TO_NAVIGATE =
      flowData.current[taskFlowName]["step" + previewStepCount.current.value]
        ?.targetUrl;

    window.location.href = URL_TO_NAVIGATE;
  };

  const handleExistingFlowPreview = (flow) => {
    const { applicationTaskFlowUseCase, taskList } = flow;

    existingFlowNameRef.current = applicationTaskFlowUseCase;

    setExistingFlowName({ value: applicationTaskFlowUseCase });
    setShowExistingFlow(false);

    flowData.current[applicationTaskFlowUseCase] = {};

    taskList.forEach(
      ({ stepNumber, targetURL, taskMessage, title, htmlTag, xPath }) => {
        flowData.current[applicationTaskFlowUseCase]["step" + stepNumber] = {
          targetElement: {
            tagName: htmlTag,
            xPath,
          },
          message: taskMessage,
          targetUrl: targetURL,
          title,
        };
      }
    );

    stepsCount.current = taskList.length;
    previewStepCount.current = {
      value: 1,
    };

    handlePreview(true, applicationTaskFlowUseCase);
  };

  const submitData = () => {
    previewMode.current = false;
    chrome.storage.sync.remove([
      "flowData",
      "flowName",
      "stepsCount",
      "previewStepCount",
      "applicationName",
    ]);
    setTooltip({ value: false });
    setInit({ forAll: false, forTooltip: false });
    const data = getFlowData(
      flowData.current,
      flowNameRef.current,
      applicationName
    );
    createFlow(dispatch, data, token, setProgress);
  };

  const handleFlowDelete = (flowUseCaseName) => {
    if (existingFlowNameRef.current === flowUseCaseName) {
      setExistingFlowName({ value: null });
      existingFlowNameRef.current = null;
    }
    deleteTaskFlow(dispatch, flowUseCaseName, token);
  };

  useEffect(() => {
    if (init.forAll) {
      document.body.addEventListener("keydown", handleRemoveHoverInpect);
    }

    if (init.forAll && init.forTooltip) {
      document.body.style.overflowX = "hidden";
      document.body.addEventListener("pointermove", handleHoverInpect);
    }

    return () => {
      document.body.style.overflowX = "visible";
      document.body.removeEventListener("pointermove", handleHoverInpect);
      document.body.removeEventListener("keydown", handleRemoveHoverInpect);
    };
  }, [init.forTooltip, init.forAll]);

  useEffect(() => {
    chrome.storage.sync.get(
      [
        "flowData",
        "stepsCount",
        "flowName",
        "previewStepCount",
        "existingFlowName",
        "progress",
        "applicationName",
      ],
      function (savedData) {
        if (Object.keys(savedData).length > 0) {
          stepsCount.current = savedData.stepsCount;
          previewStepCount.current = { value: savedData.previewStepCount };
          if (savedData.flowName) {
            setFlowName(savedData.flowName);
            flowNameRef.current = savedData.flowName;
            setApplicationName(savedData.applicationName);
            setProgress({ state: savedData.progress });
            flowData.current[savedData.flowName] =
              savedData.flowData[savedData.flowName];
          }
          if (savedData.existingFlowName) {
            existingFlowNameRef.current = savedData.existingFlowName;
            setExistingFlowName({ value: savedData.existingFlowName });
            flowData.current[savedData.existingFlowName] =
              savedData.flowData[savedData.existingFlowName];
          }
        }
      }
    );
  }, []);

  return (
    <>
      <div data-isopen={init.forAll} className="extention__ui__wrapper">
        <footer className="extension__footer">
          <div>
            {token && (
              <button onClick={handleLogout} className="ext__btn">
                <BiLogOutCircle className="icon" /> Logout
              </button>
            )}
            <button
              onClick={() => setShowExistingFlow(true)}
              className="ext__btn"
            >
              {" "}
              Flow Manager
            </button>
            {existingFlowName.value ? (
              <button
                data-toggle={previewMode.current}
                onClick={() => handlePreview(true, existingFlowName.value)}
                className="ext__btn"
              >
                <GoPrimitiveDot className="icon" />{" "}
                {previewMode.current ? (
                  <span>{existingFlowName.value}</span>
                ) : (
                  <span>Preview</span>
                )}
              </button>
            ) : (
              progress.state !== "off" &&
              stepsCount.current > 0 && (
                <button
                  data-toggle={previewMode.current}
                  onClick={() => handlePreview(true, flowNameRef.current)}
                  className="ext__btn"
                >
                  <GoPrimitiveDot className="icon" />{" "}
                  {previewMode.current ? (
                    <span>{flowName}</span>
                  ) : (
                    <span>Preview</span>
                  )}
                </button>
              )
            )}{" "}
            {showTooltip.value && previewMode.current && (
              <>
                <button
                  disabled={previewStepCount.current.value === 1}
                  onClick={handlePrev}
                  className="ext__btn"
                  data-type="prev"
                >
                  <Left className="icon" /> Prev
                </button>
                <button
                  disabled={
                    previewStepCount.current.value === stepsCount.current
                  }
                  onClick={handleNext}
                  className="ext__btn"
                  data-type="next"
                >
                  Next <Right className="icon" />{" "}
                </button>
              </>
            )}
          </div>
          <div>
            {["off"].includes(progress.state) && (
              <button
                data-type="create"
                onClick={() => initFlowCreation(true)}
                className="ext__btn"
              >
                Create New Flow
              </button>
            )}
            {["paused", "on"].includes(progress.state) &&
              !existingFlowName.value && (
                <button
                  data-type="discard"
                  className="ext__btn"
                  onClick={discardProgress}
                >
                  Discard{" "}
                </button>
              )}
            {progress.state === "paused" && !existingFlowName.value && (
              <button
                data-type="continue"
                className="ext__btn"
                onClick={continueProgress}
              >
                Continue{" "}
              </button>
            )}
            {stepsCount.current > 0 &&
              ["paused", "on"].includes(progress.state) &&
              !existingFlowName.value && (
                <button
                  data-type="save"
                  className="ext__btn"
                  onClick={submitData}
                >
                  Save{" "}
                </button>
              )}
          </div>
        </footer>

        <p className="hover__inspect__alert">
          Press <span>ESC</span> to interact with the page
        </p>

        <div data-toggle={isFlowActive} className="flow__name__popup">
          <h1 className="flow__name__title">Create Flow</h1>
          <div>
            <MdOutlineAppRegistration className="input__icon" />
            <input
              placeholder="Application name..."
              onChange={(e) => setApplicationName(e.target.value)}
              value={applicationName}
            ></input>
          </div>
          <div>
            <RiPencilFill className="input__icon" />
            <input
              placeholder="Flow use case..."
              onChange={(e) => setFlowName(e.target.value)}
              value={flowName}
            ></input>
          </div>
          <div className="flow__popup__btns">
            <button onClick={() => initFlowCreation(false)}>Cancel</button>
            <button onClick={addHoverInspect}>Add</button>
          </div>
        </div>
      </div>
      {box.value && (
        <>
          <div
            onClick={appendTooltip}
            style={{
              top: box.top - 5,
              left: box.left - 10,
              width: box.width + 20 + "px",
              height: box.height + 10 + "px",
            }}
            className="hover__area__box"
          ></div>
          <p
            style={{ top: box.top + box.offsetY, left: box.left - 10 }}
            className="hover__tooltip"
          >
            {box.tagName}
          </p>
        </>
      )}
      {showTooltip.value && (
        <Tooltip
          {...{
            previewStepCount,
            setProgress,
            previewMode,
            targetElem,
            stepsCount,
            setTooltip,
            flowName,
            flowData,
            ...showTooltip,
            setInit,
            applicationName,
          }}
        >
          <div
            style={{ ...showTooltip.arrowPos }}
            className="main__tooltip__arrow"
          ></div>
        </Tooltip>
      )}
      <ul className="ext__flow__manager" data-toggle={showExistingFlow}>
        <MdClose onClick={() => setShowExistingFlow(false)} className="icon" />
        {progress.state === "paused" ? (
          <li>
            <p> Task Flow in progress </p>
            {flowName}
            {existingFlowName.value && (
              <button
                aria-label="button"
                onClick={() => {
                  chrome.storage.sync.remove(["existingFlowName"]);
                  setExistingFlowName({ value: null });
                  existingFlowNameRef.current = null;
                  const steps = Object.keys(flowData.current[flowName]);
                  stepsCount.current = steps.length;
                  previewStepCount.current = {
                    value: 1,
                  };
                  handlePreview(true, flowNameRef.current);
                }}
              >
                Preview
              </button>
            )}
          </li>
        ) : (
          <li>No task flow in progress</li>
        )}
        {flows.isLoading ? (
          <li data-type="loader">
            <ReactLoading type="spin" height={30} width={30} color="black" />
          </li>
        ) : flows.data.length > 0 ? (
          [1, ...flows.data].map((flow, index) => {
            if (flow === 1) {
              return (
                <li data-type="title" key={flow}>
                  Existing flows
                </li>
              );
            } else {
              return (
                <li key={flow.taskID}>
                  <span>{index}</span> {flow.applicationTaskFlowUseCase}
                  <div>
                    <button
                      onClick={() =>
                        handleFlowDelete(flow.applicationTaskFlowUseCase)
                      }
                    >
                      <RiDeleteBin6Line className="icon" /> Delete
                    </button>
                    {existingFlowName.value ===
                    flow.applicationTaskFlowUseCase ? (
                      <button
                        onClick={() => {
                          setExistingFlowName({ value: null });
                          existingFlowNameRef.current = null;
                          previewMode.current = false;
                          setTooltip({ value: false });
                        }}
                      >
                        <BsFillEyeSlashFill className="icon" />
                        Stop
                      </button>
                    ) : (
                      <button onClick={() => handleExistingFlowPreview(flow)}>
                        <BsFillEyeFill className="icon" />
                        View
                      </button>
                    )}
                  </div>
                </li>
              );
            }
          })
        ) : (
          <li>No existing flows available</li>
        )}
      </ul>
    </>
  );
}

export default Foreground;
