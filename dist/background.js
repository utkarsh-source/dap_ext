function removeListeners() {
  chrome.runtime.onMessage.removeListener(onMessage);
  chrome.tabs.onRemoved.removeListener(onTabRemove);
  chrome.webNavigation.onDOMContentLoaded.removeListener(onDOMContentLoaded);
}

function addListeners() {
  chrome.runtime.onMessage.addListener(onMessage);
  chrome.tabs.onRemoved.addListener(onTabRemove);
  chrome.webNavigation.onDOMContentLoaded.addListener(onDOMContentLoaded);
}

function onDOMContentLoaded(details) {
  const { tabId, url } = details;
  chrome.storage.sync.get(["tabUrl"], function (data) {
    if (!url.includes("http")) return;
    let tabUrlDomain = data.tabUrl.split("/")[2].split(".").slice(-2)[0];
    let newUrlDomain = url.split("/")[2].split(".").slice(-2)[0];
    if (tabUrlDomain !== newUrlDomain) return;
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["inject_script.js"],
      },
      () => {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["foreground.bundle.js"],
        });
      }
    );
  });
}

function onTabRemove() {
  chrome.storage.sync.clear();
  removeListeners();
}

function onMessage(request, sender, sendResponse) {
  if (request.closeExt) {
    chrome.storage.sync.clear();
    chrome.tabs.query({ active: true }, (tab) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab[0].id },
          files: ["remove_script.js"],
        },
        () => {
          sendResponse("Extension Closed");
          removeListeners();
        }
      );
    });
  } else if (request.openNewTab?.value) {
    chrome.tabs.create({
      url: request.openNewTab.url,
    });
  }
}

function onExtensionClick(tab) {
  chrome.storage.sync.clear(function () {
    addListeners();
    chrome.storage.sync.set({ tabUrl: tab.url });
  });
  if (tab.url.includes("http") && tab.status == "complete") {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["inject_script.js"],
      },
      () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["foreground.bundle.js"],
        });
      }
    );
  }
}

chrome.action.onClicked.addListener(onExtensionClick);
