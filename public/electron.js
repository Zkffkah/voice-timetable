'use strict';

const { app, BrowserWindow, Tray, Menu ,nativeImage,ipcMain} = require('electron');
const windowStateKeeper = require('electron-window-state');

const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
} = require('electron-devtools-installer');

const path = require('path');
const isDev = require('electron-is-dev');
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd'),
});

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const getIcon = () => {
    if (process.platform === 'win32')
        return `${path.join(__dirname, '/icons/icon.ico')}`;
    if (process.platform === 'darwin')
        return `${path.join(__dirname, '/icons/icon.icns')}`;
    return `${path.join(__dirname, '/icons/16x16.png')}`;
};

let mainWindow, tray, contextMenu;

const createWindow = async () => {
    installExtension(REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS);

    let mainWindowState = windowStateKeeper({
        defaultWidth: isDev?800:400,
        defaultHeight: isDev?400:250,
    });

    mainWindow = new BrowserWindow({
        title: 'Voice Clock',
        show: false,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        focusable: true,
        icon: getIcon(),
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        titleBarStyle: 'hidden',
        backgroundColor: '#282c34',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
        },
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`,
    );

    mainWindow.once('ready-to-show', () => {
        // mainWindow.show();
        if (isDev) {
            installExtension(REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS);
            mainWindow.webContents.openDevTools();
        }
    });

    mainWindow.on('closed', () => (mainWindow = null));

    // Tray ///////////////////////////////////////////////////////////
    console.log(getIcon())
    let trayIcon = nativeImage.createFromPath(`${path.join(__dirname, '/icons/IconTemplate.png')}`);
    trayIcon = trayIcon.resize({
       width: 16,
       height: 16
     });
    tray = new Tray(trayIcon);

    // if (isDev) {
    //     contextMenu = Menu.buildFromTemplate([
    //         {
    //             label: 'Developer Tools',
    //             async click() {
    //                 await installExtension(
    //                     REACT_DEVELOPER_TOOLS,
    //                     REDUX_DEVTOOLS,
    //                 );
    //                 mainWindow.toggleDevTools();
    //             },
    //         },
    //         { type: 'separator' },
    //         {
    //             label: 'Exit',
    //             role: 'quit',
    //         },
    //     ]);
    // } else {
    //     contextMenu = Menu.buildFromTemplate([
    //         {
    //             label: 'Exit',
    //             role: 'quit',
    //         },
    //     ]);
    // }

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    tray.setToolTip('Voice Clock');

    // tray.setContextMenu(contextMenu);
    ipcMain.on('update-title-tray-window-event', function(event, title) {
        tray.setTitle(title);
    });

    // Tray End ////////////////////////////////////////////////////////
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
if (!isDev) {
    app.setLoginItemSettings({
        openAtLogin: true,
    })
}

