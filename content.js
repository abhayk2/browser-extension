let currentZoom = 1;
const ZOOM_STEP = 0.1;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.2;

// Picks the largest visible video on the page instead of just the first one
function findTarget() {
  const videos = document.querySelectorAll('video');
  let best = null;
  let bestSize = 0;

  for (const video of videos) {
    const { width, height } = video.getBoundingClientRect();
    const size = width * height;
    if (size > bestSize) {
      bestSize = size;
      best = video;
    }
  }
  if (best) return best;

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

  // Use getBoundingClientRect instead of offsetWidth to avoid 0x0 bug
  const rect = video.getBoundingClientRect();
  wrapper.style.width = (rect.width || video.offsetWidth) + 'px';
  wrapper.style.height = (rect.height || video.offsetHeight) + 'px';

  video.parentNode.insertBefore(wrapper, video);
  wrapper.appendChild(video);
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.display = 'block';

  // Keep wrapper size in sync when video/window resizes
  const resizeObserver = new ResizeObserver(() => {
    const r = video.getBoundingClientRect();
    if (r.width > 0) wrapper.style.width = r.width + 'px';
    if (r.height > 0) wrapper.style.height = r.height + 'px';
  });
  resizeObserver.observe(video);

  // Remove zoom effect during native fullscreen
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      video.style.transform = 'none';
    } else {
      video.style.transform = `scale(${currentZoom})`;
    }
  });
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
  } else if (message.action === 'getZoom') {
    sendResponse({ zoom: currentZoom });
    return true;
  }
  sendResponse({ zoom: currentZoom });
  return true;
});

let debounceTimer = null;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const target = findTarget();
    if (target && !target.parentElement?.classList.contains('vz-wrapper')) {
      applyZoom();
    }
  }, 300);
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}