let active = false;
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key === ';') {
    active = !active;
    title = active ? 'Extension Activated' : 'Extension Deactivated';
    message = active
      ? 'Select the text and press Ctrl + Y to save the text'
      : 'Press Ctrl + ; to activate the extension again';
    chrome.runtime.sendMessage({
      type: 'notification',
      title: title,
      message: message,
    });
    if (active) {
      document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'y') {
          handleSelection();
          chrome.runtime.sendMessage({
            type: 'notification',
            title: 'Content Saved',
            message: 'Selected text saved successfully',
          });
        }
      });
    }
  }
});

function handleSelection() {
  const text = window.getSelection().toString();
  const url = window.location.href;
  let date = new Date();
  date = date.toLocaleDateString('in');
  chrome.runtime.sendMessage({
    type: 'saveText',
    text: text,
    url: url,
    date: date,
  });
}
