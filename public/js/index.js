 const videoCard = document.getElementById('videoCard');
  const videoPlayer = document.getElementById('videoPlayer');
  const statusBar = document.getElementById('statusBar');
  const saveBtn = document.getElementById('saveBtn');

  let currentVideoUrl = null;

  function setStatus(type, msg) {
    if (type === 'loading') {
      statusBar.innerHTML = `<div class="spinner"></div><span>${msg}</span>`;
    } else if (type === 'ok') {
      statusBar.innerHTML = `<div class="dot ok"></div><span>${msg}</span>`;
    } else if (type === 'err') {
      statusBar.innerHTML = `<div class="dot err"></div><span>${msg}</span>`;
    } else {
      statusBar.innerHTML = '';
    }
  }

  async function download() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) { setStatus('err', 'Please paste a TikTok URL first'); return; }

    setStatus('loading', 'Fetching video…');
    videoCard.style.display = 'none';
    currentVideoUrl = null;

    try {
      const res = await fetch(`https://quicktok-grab.onrender.com/tiktok/download?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      
      if (data.success && data.data && data.data.length > 0) {
        currentVideoUrl = data.data[0].url;
        videoPlayer.src = currentVideoUrl;
        videoCard.style.display = 'block';
        setStatus('ok', 'Video loaded successfully');
      } else {
        setStatus('err', 'No video found for this URL');
      }
    } catch (err) {
      setStatus('err', 'Could not reach server');
    }
  }

  async function saveVideo() {
    if (!currentVideoUrl) return;

    saveBtn.textContent = 'Saving…';
    saveBtn.disabled = true;

    try {
      const res = await fetch(currentVideoUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'quicktok-' + Date.now() + '.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      saveBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Save video`;
      saveBtn.disabled = false;
    } catch (err) {
      setStatus('err', 'Could not save video');
      saveBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3 3-3M2 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Save video`;
      saveBtn.disabled = false;
    }
  }