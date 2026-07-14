/*
  Circuit — embeddable voice sales assistant launcher
  --------------------------------------------------
  Drop this on any page:

    <script src="https://YOUR-HOST/circuit-embed.js"
            data-src="https://YOUR-HOST/circuit-widget.html"
            data-position="bottom-right"
            data-accent="#e8a33d"></script>

  data-src        required — full URL where circuit-widget.html is hosted
  data-position   optional — "bottom-right" (default) or "bottom-left"
  data-accent     optional — accent color for the launcher button, default #e8a33d
*/
(function () {
  var thisScript = document.currentScript;
  var widgetSrc = thisScript.getAttribute('data-src');
  var position = thisScript.getAttribute('data-position') || 'bottom-right';
  var accent = thisScript.getAttribute('data-accent') || '#e8a33d';

  if (!widgetSrc) {
    console.error('[circuit-embed] Missing required data-src attribute pointing to circuit-widget.html');
    return;
  }

  var side = position === 'bottom-left' ? 'left' : 'right';

  var bubble = document.createElement('button');
  bubble.setAttribute('aria-label', 'Open Circuit electrical assistant');
  bubble.innerHTML =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="#1a1300">' +
    '<path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/>' +
    '</svg>';
  bubble.style.cssText = [
    'position:fixed', 'bottom:24px', side + ':24px', 'width:60px', 'height:60px',
    'border-radius:50%', 'border:none', 'background:' + accent,
    'box-shadow:0 8px 24px rgba(0,0,0,0.35)', 'cursor:pointer', 'z-index:2147483000',
    'display:flex', 'align-items:center', 'justify-content:center', 'transition:transform .15s'
  ].join(';');
  bubble.onmouseenter = function () { bubble.style.transform = 'scale(1.06)'; };
  bubble.onmouseleave = function () { bubble.style.transform = 'scale(1)'; };

  var frameWrap = document.createElement('div');
  frameWrap.style.cssText = [
    'position:fixed', 'bottom:96px', side + ':24px', 'width:380px', 'height:620px',
    'max-width:calc(100vw - 32px)', 'max-height:calc(100vh - 130px)',
    'border-radius:14px', 'overflow:hidden', 'box-shadow:0 20px 60px rgba(0,0,0,0.4)',
    'display:none', 'z-index:2147483000', 'background:#16181c'
  ].join(';');

  var iframe = document.createElement('iframe');
  iframe.src = widgetSrc;
  iframe.title = 'Circuit electrical sales assistant';
  iframe.allow = 'microphone';
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  frameWrap.appendChild(iframe);

  document.body.appendChild(bubble);
  document.body.appendChild(frameWrap);

  var open = false;
  function setOpen(next) {
    open = next;
    frameWrap.style.display = open ? 'block' : 'none';
    bubble.style.display = open ? 'none' : 'flex';
  }

  bubble.addEventListener('click', function () { setOpen(true); });

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'circuit-close') setOpen(false);
  });
})();