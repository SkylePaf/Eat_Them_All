const { app, BrowserWindow } = require('electron')
const path = require('path')

// Fix GPU sur certains drivers Linux
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,
    icon: path.join(__dirname, 'src', 'assets', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.setMenu(null)                          // Supprime la barre de menu
  win.loadFile(path.join(__dirname, 'src', 'index.html'))

  win.webContents.on('did-finish-load', () => {
        const targetResolution = { width: 1920, height: 1080 };
        const screenSize = win.getBounds();
        const zoomFactor = Math.min(
            screenSize.width / targetResolution.width,
            screenSize.height / targetResolution.height
        );
        win.webContents.setZoomFactor(zoomFactor);
        win.webContents.setVisualZoomLevelLimits(1, 1);
  });

  win.setResizable(false);

  // Désactive F12 / Inspecter
  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools()
  })

  // Désactive le clic droit
  win.webContents.on('context-menu', (e) => {
    e.preventDefault()
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})