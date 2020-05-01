"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var electron = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow;
app.allowRendererProcessReuse = true;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        titleBarStyle: "hidden",
        frame: false,
        transparent: true,
        vibrancy: "dark",
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    if (mainWindow) {
        mainWindow.loadURL(isDev ? "http://localhost:3000" : "file://" + path.join(__dirname, "../build/index.html"));
        mainWindow.on("closed", function () { return (mainWindow = null); });
    }
}
app.on("ready", function () {
    createWindow();
    electron_1.session.defaultSession.webRequest.onBeforeSendHeaders(function (details, callback) {
        details.requestHeaders["User-Agent"] =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36";
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
});
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});
