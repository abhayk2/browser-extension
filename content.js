
let currentZoom = 1;
const ZOOM_STEP = 0.1;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.2;

function findTarget() {
  const video = document.querySelector('video');
  if (video) return video;

  const iframes = document.querySelectorAll('iframe');
  for (const iframe of iframes) {
    const src = iframe.src || '';
    if (
      src.includes('hotmart') ||
      src.includes('wistia') ||
      src.includes('youtube') ||
      src.includes('vimeo') ||
      src.includes('embed')
    ) {
      return iframe;
    }
  }
  return null;
}

function wrapVideo(video) {

  if (video.parentElement?.classList.contains('vz-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.classList.add('vz-wrapper');

  wrapper.style.display = 'inline-block';
  wrapper.style.overflow = 'hidden';
  wrapper.style.lineHeight = '0';
  wrapper.style.width = video.offsetWidth + 'px';
  wrapper.style.height = video.offsetHeight + 'px';


  video.parentNode.insertBefore(wrapper, video);
  wrapper.appendChild(video);


  video.style.width = '100%';
  video.style.height = '100%';
  video.style.display = 'block';
}


function applyZoom() {
  const target = findTarget();
  if (!target) return;

  wrapVideo(target);
  target.style.transform = `scale(${currentZoom})`;
  target.style.transformOrigin = 'center center';
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'zoomIn') {
    currentZoom = Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP);
    applyZoom();
  } else if (message.action === 'zoomOut') {
    currentZoom = Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP);
    applyZoom();
  } else if (message.action === 'zoomReset') {
    currentZoom = 1;
    applyZoom();
  }
  sendResponse({ zoom: currentZoom });
  return true;
});


const observer = new MutationObserver(() => {
  const target = findTarget();
  if (target && !target.parentElement?.classList.contains('vz-wrapper')) {
    applyZoom();
  }
});
observer.observe(document.body, { childList: true, subtree: true });