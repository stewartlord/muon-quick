const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let fileUrl = (filePath) => {
  // It's preferrable to call path.resolve but it's not available
  // because process.cwd doesn't exist in renderers like in file URL
  // drops in the URL bar.
  if (!path.isAbsolute(filePath) && process.cwd) {
    filePath = path.resolve(filePath)
  }
  let fileUrlPath = filePath.replace(/\\/g, '/')

  // Windows drive letter must be prefixed with a slash
  if (fileUrlPath[0] !== '/') {
    fileUrlPath = '/' + fileUrlPath
  }

  return encodeURI('file://' + fileUrlPath)
}

let getBraveExtUrl = function (relativeUrl) {
  if (relativeUrl === undefined) {
    relativeUrl = ''
  }

  return 'chrome-extension://' + 'mnojpmjdmbbfmejpflffifhffcmidifd' + '/' + relativeUrl
}

let getBraveIndexPath = function (relateivePath = '') {
  return fileUrl(
      path.resolve(__dirname, '..', '..') + '/app/extensions/brave/' + relateivePath).replace('file://', 'chrome://brave')
}

let getBraveExtIndexHTML = function () {
  return process.env.NODE_ENV === 'development'
    ? getBraveIndexPath('index-dev.html')
    : getBraveIndexPath('index.html')
}

let getExtensionsPath = function (extensionDir) {
  return (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test')
    // the path is different for release builds because extensions are not in the asar file
    ? path.join(__dirname, '..', '..', '..', 'extensions', extensionDir)
    : path.join(__dirname, '..', '..', 'app', 'extensions', extensionDir)
}

// Takes Content Security Policy flags, for example { 'default-src': '*' }
// Returns a CSP string, for example 'default-src: *;'
let concatCSP = (cspDirectives) => {
  let csp = ''
  for (let directive in cspDirectives) {
    csp += directive + ' ' + cspDirectives[directive] + '; '
  }
  return csp.trim()
}

// Returns the Chromium extension manifest for the braveExtension
// The braveExtension handles about: pages, ad blocking, and a few other things
let generateBraveManifest = () => {
  const indexHTML = getBraveExtIndexHTML()

  let baseManifest = {
    name: 'brave',
    manifest_version: 2,
    version: '1.0',
    background: {
      scripts: [ 'content/scripts/idleHandler.js' ],
      persistent: true
    },
    content_scripts: [
      {
        run_at: 'document_start',
        all_frames: true,
        matches: ['http://www.glennbeck.com/*'],
        js: [
          'content/scripts/siteHack-glennbeck.com.js'
        ]
      },
      {
        run_at: 'document_start',
        all_frames: true,
        matches: ['https://www.washingtonpost.com/*', 'https://www.youtube.com/*'],
        css: [
          'content/styles/removeEmptyElements.css'
        ]
      },
      {
        run_at: 'document_start',
        all_frames: true,
        matches: ['<all_urls>'],
        include_globs: [
          'http://*/*', 'https://*/*', 'file://*', 'data:*', 'about:srcdoc'
        ],
        exclude_globs: [
          indexHTML
        ],
        match_about_blank: true,
        js: [
          'content/scripts/util.js',
          'content/scripts/navigator.js',
          'content/scripts/blockFlash.js',
          'content/scripts/blockCanvasFingerprinting.js',
          'content/scripts/block3rdPartyContent.js',
          'content/scripts/inputHandler.js'
        ],
        css: [
          'brave-default.css'
        ]
      },
      {
        run_at: 'document_end',
        all_frames: true,
        matches: ['<all_urls>'],
        include_globs: [
          'http://*/*', 'https://*/*', 'file://*', 'data:*', 'about:srcdoc'
        ],
        exclude_globs: [
          indexHTML
        ],
        js: [
          'content/scripts/adInsertion.js',
          'content/scripts/pageInformation.js',
          'content/scripts/flashListener.js'
        ]
      },
      {
        run_at: 'document_end',
        all_frames: false,
        matches: ['<all_urls>'],
        include_globs: [
          'http://*/*', 'https://*/*', 'file://*', 'data:*', 'about:srcdoc',
          indexHTML,
          getBraveExtUrl('about-*.html'),
          getBraveExtUrl('about-*.html') + '#*'
        ],
        exclude_globs: [
          getBraveExtUrl('about-blank.html'),
          getBraveExtUrl('about-blank.html') + '#*'
        ],
        js: [
          'content/scripts/spellCheck.js',
          'content/scripts/themeColor.js'
        ]
      },
      {
        run_at: 'document_start',
        js: [
          'content/scripts/util.js',
          'content/scripts/inputHandler.js'
        ],
        matches: [
          '<all_urls>'
        ],
        include_globs: [
          indexHTML,
          getBraveExtUrl('about-*.html'),
          getBraveExtUrl('about-*.html') + '#*'
        ],
        exclude_globs: [
          getBraveExtUrl('about-blank.html'),
          getBraveExtUrl('about-blank.html') + '#*'
        ]
      }
    ],
    permissions: [
      'externally_connectable.all_urls', 'tabs', '<all_urls>', 'contentSettings', 'idle'
    ],
    externally_connectable: {
      matches: [
        '<all_urls>'
      ]
    },
    incognito: 'split',
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAupOLMy5Fd4dCSOtjcApsAQOnuBdTs+OvBVt/3P93noIrf068x0xXkvxbn+fpigcqfNamiJ5CjGyfx9zAIs7zcHwbxjOw0Uih4SllfgtK+svNTeE0r5atMWE0xR489BvsqNuPSxYJUmW28JqhaSZ4SabYrRx114KcU6ko7hkjyPkjQa3P+chStJjIKYgu5tWBiMJp5QVLelKoM+xkY6S7efvJ8AfajxCViLGyDQPDviGr2D0VvIBob0D1ZmAoTvYOWafcNCaqaejPDybFtuLFX3pZBqfyOCyyzGhucyCmfBXJALKbhjRAqN5glNsUmGhhPK87TuGATQfVuZtenMvXMQIDAQAB'
  }

  let cspDirectives = {
    'default-src': '\'self\'',
    'form-action': '\'none\'',
    'style-src': '\'self\' \'unsafe-inline\'',
    'img-src': '* data: file://*',
    'frame-src': '\'self\' https://buy.coinbase.com https://brave.com'
  }

  if (process.env.NODE_ENV === 'development') {
    // allow access to webpack dev server resources
    let devServer = 'localhost:' + process.env.npm_package_config_port
    cspDirectives['default-src'] = '\'self\' http://' + devServer
    cspDirectives['connect-src'] = ['\'self\'',
      'http://' + devServer,
      'ws://' + devServer].join(' ')
    cspDirectives['style-src'] = '\'self\' \'unsafe-inline\' http://' + devServer
  }

  baseManifest.content_security_policy = concatCSP(cspDirectives)

  return baseManifest
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  const session = electron.session;
  session.defaultSession.extensions.load(getExtensionsPath('brave'), generateBraveManifest(), 'component');

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Muon Quick Start',
    width: 800, height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(getBraveExtIndexHTML());

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
