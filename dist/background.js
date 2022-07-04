chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    switch (msg.type) {
      case "newTab": {
        chrome.tabs.create({
          url: request.url,
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

function removeListeners() {
  chrome.tabs.onRemoved.removeListener(onTabRemove);
  chrome.tabs.onUpdated.removeListener(onTabUpdate);
}

function addListeners() {
  chrome.tabs.onRemoved.addListener(onTabRemove);
  chrome.tabs.onUpdated.addListener(onTabUpdate);
}

function onTabUpdate(tabId, changeInfo, tab) {
  const { status, url } = changeInfo;
  if (status !== "complete") return;
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

function onTabRemove() {
  chrome.storage.sync.clear();
  chrome.tabs.onActivated.removeListener(onActiveChange);
  removeListeners();
}

// function onMessage(request, sender, sendResponse) {
//   switch (request.type) {
//     case "newTab": {
//       chrome.tabs.create(
//         {
//           url: request.url,
//         },
//         () => sendResponse("Created")
//       );
//       break;
//     }
//   }
// }

function onExtensionClick(tab) {
  chrome.tabs.onActivated.removeListener(onActiveChange);
  removeListeners();
  if (tab.url.includes("http") && tab.status == "complete") {
    chrome.storage.sync.clear(function () {
      addListeners();
      chrome.tabs.onActivated.addListener(onActiveChange);
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

function onActiveChange({ tabId }) {
  chrome.storage.sync.get(["tabId"], function (data) {
    if (data.tabId === tabId) {
      addListeners();
    } else {
      removeListeners();
    }
  });
}

chrome.action.onClicked.addListener(onExtensionClick);
