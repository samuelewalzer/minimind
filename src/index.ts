import electron, { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import { database as db } from "./database";
import { getSmartResponse } from "./aiService";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // icon: path.join(__dirname, "assets", "icon"),
    height: 1000,
    minHeight: 850,
    width: 1400,
    minWidth: 1200,
    icon: "./assets/icon.png",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// Menu.setApplicationMenu(null)

// Menu.setApplicationMenu(null);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";

if (process.env.NODE_ENV === "development") {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Handler for Tasks
ipcMain.handle("ADD_TASK", async (event, task) => {
  db.addTask(task);
});

ipcMain.handle("GET_TASKS", async () => {
  return db.getTasks();
});

ipcMain.handle("DELETE_TASK", async (event, taskId) => {
  db.deleteTask(taskId);
});

ipcMain.handle("EDIT_TASK", async (event, task) => {
  db.editTask(task);
});

ipcMain.handle(
  "TOGGLE_TASK_COMPLETED",
  async (event, taskId, completedStatus) => {
    db.toggleTaskCompletion(taskId, completedStatus);
  }
);

ipcMain.handle("TASK_HAS_SUBTASKS", async (event, taskId) => {
  return db.taskHasSubtasks(taskId);
});

// Handler for Subtasks

ipcMain.handle("TOGGLE_SUBTASK_COMPLETION", async (event, subtaskId) => {
  db.toggleSubtaskCompletion(subtaskId);
});

ipcMain.handle("GET_SUBTASKS_FROM_PARENT", async (event, parentTaskId) => {
  return db.getSubtasksFromParent(parentTaskId);
});

// Handle for gamification
ipcMain.handle("GET_COMPLETED_TODAY_COUNT", async () => {
  return db.getCompletedTodayCount();
});

// Handler for SmartInput
ipcMain.handle("ADD_SMART_RESPONSE", async (event, input, requestId) => {
  return getSmartResponse(input, requestId);
});

ipcMain.handle("SHOW_DB", async () => {
  const userDataPath = electron.app.getPath("userData");
  shell.openPath(userDataPath);
});