function saveText(text, url, date) {
  let urlName = url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/
  )[1];
  date = date.toLocaleDateString('in');
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'saveText') {
    saveText(request.text, request.url, request.date);
  }
});
