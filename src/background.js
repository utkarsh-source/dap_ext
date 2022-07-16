chrome.action.onClicked.addListener(onExtensionClick);

function onCommitted() {
  console.log("");
}

function removeListeners() {
  chrome.tabs.onRemoved.removeListener(onTabRemove);
  chrome.tabs.onUpdated.removeListener(onTabUpdate);
  chrome.webNavigation.onHistoryStateUpdated.removeListener(onCommitted);
}

function addListeners() {
  chrome.tabs.onRemoved.addListener(onTabRemove);
  chrome.tabs.onUpdated.addListener(onTabUpdate);
  chrome.webNavigation.onCommitted.addListener(onCommitted);
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    switch (msg.type) {
      case "newTab": {
        chrome.tabs.create({
          url: msg.url,
        });
        break;
      }
      case "unloadExtension": {
        console.log("Listeners removed");
        chrome.tabs.onActivated.removeListener(onActiveChange);
        removeListeners();
        break;
      }
    }
  });
});

function isExtensionLoaded() {
  if (!document.querySelector("#dap__ext__foreground")) {
    chrome.storage.sync.set({ dapLoaded: false });
  } else {
    chrome.storage.sync.set({ dapLoaded: true });
  }
}

function onTabUpdate(tabId, changeInfo, tab) {
  const { status, url } = changeInfo;
  if (status !== "complete") return;
  chrome.scripting.executeScript(
    {
      target: { tabId },
      func: isExtensionLoaded,
    },
    () => {
      chrome.storage.sync.get(["dapLoaded"], function (data) {
        if (!data.dapLoaded) {
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
        }
      });
    }
  );
}

function onTabRemove() {
  chrome.storage.sync.clear();
  chrome.tabs.onActivated.removeListener(onActiveChange);
  removeListeners();
}

function onActiveChange(activeInfo) {
  const { tabId } = activeInfo;
  chrome.storage.sync.get("tabId", function (data) {
    if (data.tabId === tabId) {
      addListeners();
    } else {
      removeListeners();
    }
  });
}

function onExtensionClick(tab) {
  chrome.tabs.onActivated.removeListener(onActiveChange);
  removeListeners();
  if (tab.url.includes("http") && tab.status == "complete") {
    chrome.storage.sync.clear(function () {
      chrome.tabs.onActivated.addListener(onActiveChange);
      addListeners();
      chrome.storage.sync.set({ tabUrl: tab.url, tabId: tab.id });
    });

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
