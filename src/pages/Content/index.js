let active = false;
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key === ';') {
    active = !active;
    if (active) {
      document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'y') {
          handleSelection();
        }
      });
    }
  }
});

function handleSelection() {
  const text = window.getSelection().toString();
  const url = window.location.href;
  let date = new Date();
  chrome.runtime.sendMessage({
    type: 'saveText',
    text: text,
    url: url,
    date: date,
  });
}
