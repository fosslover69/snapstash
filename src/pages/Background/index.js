function saveText(text, url, date) {
  let urlName = url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/
  )[1];
  chrome.storage.local.get(['selectedArray'], function (result) {
    let storedArray = result.selectedArray || [];
    const selectObject = {
      id: storedArray.length,
      site: urlName,
      date: date,
      content: text,
      url: url,
    };
    storedArray.push(selectObject);
    chrome.storage.local.set({ selectedArray: storedArray });
  });
}

function sendNotification(title, message) {
  const options = {
    type: 'basic',
    title: title,
    message: message,
    iconUrl: './icon-128.png',
  };
  chrome.notifications.create(options);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'saveText') {
    saveText(request.text, request.url, request.date);
  } else if (request.type === 'notification') {
    sendNotification(request.title, request.message);
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'saveSnap',
    title: 'Save to Snaps',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'saveSnap') {
    const text = info.selectionText;
    const url = info.pageUrl;
    let date = new Date();
    date = date.toLocaleDateString('in');
    saveText(text, url, date);
    sendNotification('Content Saved', 'Selected text saved successfully');
  }
});
