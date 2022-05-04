const removeArray = [
  "flowData",
  "stepsCount",
  "flowName",
  "previewStepCount",
  "tabInfo",
  "existingFlowName",
  "token",
  "progress",
  "applicationName",
];

function onCompleted(details) {
  const { tabId, url } = details;
  chrome.storage.sync.get(["tabInfo"], function (data) {
    let urlDomian = url.split("/")[2];
    let targetDomain = data.tabInfo.url.split("/")[2];
    console.log("New Url");
    console.log(urlDomian);
    console.log("Target Url");
    console.log(targetDomain);
    if (urlDomian.includes(targetDomain)) {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["inject_script.js"],
        },
        () => {
          chrome.scripting.executeScript(
            {
              target: { tabId },
              files: ["foreground.bundle.js"],
            },
            () => {
              console.log("Injected and executed on tab update");
            }
          );
        }
      );
    }
  });
  console.log("on Navigation Completed");
}

function onExtensionClick(tab) {
  chrome.storage.sync.remove(removeArray);
  chrome.runtime.onMessage.addListener(onMessage);
  chrome.tabs.onRemoved.addListener(onTabRemove);
  chrome.webNavigation.onCompleted.addListener(onCompleted);
  chrome.storage.sync.set({ tabInfo: { url: tab.url } });
  if (tab.url.includes("http") && tab.status == "complete") {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["inject_script.js"],
      },
      () => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["foreground.bundle.js"],
          },
          () => {
            console.log("Injected and executed");
          }
        );
      }
    );
  }
}

function onTabRemove(tabId, removeInfo) {
  console.log("REMOVE INFO OBJECT ---> ");
  console.log(removeInfo);
  chrome.storage.sync.remove(removeArray);
}

function onMessage(request, sender, sendResponse) {
  chrome.storage.sync.remove(removeArray);
  if (request.pageState) {
    console.log(request.pageState);
  }
  if (request.removeListeners) {
    chrome.tabs.onRemoved.removeListener(onTabRemove);
    chrome.webNavigation.onCompleted.removeListener(onCompleted);
    chrome.tabs.onUpdated.removeListener(onTabUpdated);
  }
  sendResponse({ listenersState: "removed" });
}

chrome.action.onClicked.addListener(onExtensionClick);
