
let currentZoom = 1;                 
const ZOOM_STEP = 0.1;              
const MAX_ZOOM = 5;                 
const MIN_ZOOM = 0.2;               


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
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    wrapVideo(video);  

    video.style.transform = `scale(${currentZoom})`;
    video.style.transformOrigin = 'center center';
  });
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
  const videos = document.querySelectorAll('video');

  let anyUnwrapped = false;
  videos.forEach(v => {
    if (!v.parentElement?.classList.contains('vz-wrapper')) {
      anyUnwrapped = true;
    }
  });
  if (anyUnwrapped) applyZoom();
});
observer.observe(document.body, { childList: true, subtree: true });