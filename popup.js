document.getElementById('zoom-in').addEventListener('click', () => {
  sendAction('zoomIn');
});

document.getElementById('zoom-out').addEventListener('click', () => {
  sendAction('zoomOut');
});

document.getElementById('zoom-reset').addEventListener('click', () => {
  sendAction('zoomReset');
});

function sendAction(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
      if (chrome.runtime.lastError) {
        document.getElementById('zoom-level').textContent = 'Not available on this page';
        return;
      }
      if (response.zoom) {
        document.getElementById('zoom-level').textContent =
          `Zoom: ${Math.round(response.zoom * 100)}%`;
      }
    });
  });
}