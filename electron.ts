import { session } from "electron";
import * as electron from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow: Electron.BrowserWindow | null;

app.allowRendererProcessReuse = true;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    if (mainWindow) {
        mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
        mainWindow.on("closed", () => (mainWindow = null));
    }
}

app.on("ready", () => {
    createWindow();

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders["User-Agent"] =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36";
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
