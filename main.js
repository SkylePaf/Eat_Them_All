const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')           // ← nécessaire sur Arch

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: width,
    height: height,
    kiosk: true,
    fullscreen: false,
    icon: path.join(__dirname, 'src', 'assets', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.setMenu(null)
  win.loadFile(path.join(__dirname, 'src', 'index.html'))

  win.webContents.on('did-finish-load', () => {
    const targetResolution = { width: 1920, height: 1080 }
    const screenSize = win.getBounds()
    const zoomFactor = Math.min(
      screenSize.width / targetResolution.width,
      screenSize.height / targetResolution.height
    )
    win.webContents.setZoomFactor(zoomFactor)
    win.webContents.setVisualZoomLevelLimits(1, 1)
  })

  win.setResizable(false)

  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools()
  })

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