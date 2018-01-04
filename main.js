const {app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const RippleAPI = require('ripple-lib').RippleAPI;
const Request = require('request');
const api = new RippleAPI({server: 'wss://s1.ripple.com:443'});
const addresses = [
    'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    'rEr3hxu5aim5tDWwH7H8BK47K91tR8c7FM',
    'rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y',
    'rU6NJQXBwCEVagpTeEev19bDnMfWeG3nVC',
    'r4HrNJtMQnyytALNBBCkfYRkw5Pc4izFFo',
    'rsoGpiGJqNijUPBtkUhhwpK8jwTW5zTGAQ',
    'rhXZDebYFALnTyWhFFPQJNqREGa27JPYiA',
    'rLzutsN392joFzuKpmfaays6cQ5SvfRBKd',
    'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
    'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
    'rUTKsx2VToAmqHGHs6vniP8KYu4Vg8RWKi',
    'rJCZWcLeQM222ctHGRC2CwZqsQLhVepQgo',
    'rLMPP2o22VvWDYevzfHvhHKzRUS81gzsSd'
  ];
// Keep a global reference of the window object, if you don't, the window will be closed automatically when the Javascript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({width: 900, height: 950, show: false});

  // Show when rendering is ready.
  win.once('ready-to-show', () => {
    win.show();
  });
  
  // Open Debugging Tools
  //win.openDevTools();

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object. Usually you would store windows in an array if your app supports multi windows, 
    // this is the time when you should define the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it is common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
  if (win == null) {
    createWindow()
  }
});

// APP LOGIC

exports.addresses = addresses;

function connect() {
  return new Promise((resolve, reject) => {
    if (api.isConnected()) {
      resolve(null);
    } else {
      api.connect().then(() => {
        resolve(null);
      }, error => {
        reject(error);
      });
    }
  });
}

exports.getRippleWalletValue = (item) => {
  return new Promise((resolve, reject) => {
    connect().then(() => {
      api.getBalances(item).then(balances => {
        resolve(balances);
      }, error => {
        reject(error);
      });
    }, error => {
      reject(error);
    });
  });
}

exports.getLedgerVersion = () => {
  return connect().then(() => {
    return api.getLedgerVersion();
  });
}

exports.getRippleMarketValue = function() {
  return new Promise((resolve, reject) => {
    Request.get("https://api.coinmarketcap.com/v1/ticker/ripple/", (error, response, body) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.parse(body));
    });
  });
}
