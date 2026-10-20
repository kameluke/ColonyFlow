const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const http = require('http');
const net = require('net');

let mainWindow = null;
let serverInstance = null;

function getAvailablePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function startNextServer() {
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
  const nextDir = app.isPackaged ? path.join(process.resourcesPath, 'app') : path.join(__dirname, '..');
  
  const next = require('next');
  const nextApp = next({ dev: isDev, dir: nextDir });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const port = await getAvailablePort(3000);

  return new Promise((resolve) => {
    serverInstance = http.createServer((req, res) => {
      handle(req, res);
    });

    serverInstance.listen(port, '127.0.0.1', () => {
      console.log(`ColonyFlow server listening on http://127.0.0.1:${port}`);
      resolve(port);
    });
  });
}

function createMainWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    title: 'ColonyFlow',
    icon: path.join(__dirname, '../build/icon.png'),
    backgroundColor: '#f5f5f7',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupNativeMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: 'ColonyFlow',
      submenu: [
        { role: 'about', label: 'About ColonyFlow' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide', label: 'Hide ColonyFlow' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit ColonyFlow' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Print / Save as PDF…',
          accelerator: 'CmdOrCtrl+P',
          click: (_item, win) => {
            const target = win || BrowserWindow.getFocusedWindow();
            if (target) target.webContents.executeJavaScript('window.print()').catch(() => {});
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(async () => {
  setupNativeMenu();
  try {
    const port = await startNextServer();
    createMainWindow(port);
  } catch (err) {
    console.error('Failed to start ColonyFlow internal server:', err);
    dialog.showErrorBox('ColonyFlow Launch Error', `Failed to start ColonyFlow internal server:\n${err.stack || err.message || err}`);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && serverInstance) {
      const port = serverInstance.address().port;
      createMainWindow(port);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverInstance) {
    serverInstance.close();
  }
});
