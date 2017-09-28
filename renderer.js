// This file is loaded by the index.html file and will
// be executed in the renderer process for that window.
// If index.html was loaded via 'chrome://brave', you can
// talk to the main browser process using chrome.ipcRenderer

console.log(chrome);

let webviews = [];
setInterval(() => {
  for (let i = 0; i < webviews.length; i++) {
    let webview = webviews[i];
    if (webview.parentNode) {
      webview.parentNode.removeChild(webview);
    }
  }
  for (let i = 0; i < 10; i++) {
    let webview = document.createElement('webview');
    webview.setAttribute('src', 'https://google.com');
    document.body.appendChild(webview);
    webviews.push(webview);
  }
}, 1000);