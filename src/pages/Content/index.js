// Define extension status
let active = false;

// Listen for keyboard shortcuts
document.addEventListener('keydown', function (event) {
  // Extension activation shortcut
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
      // Listen for text selection
      document.addEventListener('keydown', function (event) {
        // Save text shortcut
        if (event.ctrlKey && event.key === 'y') {
          handleSelection();
        }
      });
    }
  }
});

// Save selected text
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
