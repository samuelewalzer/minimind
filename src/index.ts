import { app, BrowserWindow, ipcMain } from "electron";
import { database as db } from "./database";
import path from "path";
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
    icon: path.join(__dirname, "assets", "icon.png"),
    height: 1500,
    width: 1200,
    minWidth: 1200,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

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
})

// Handler for Subtasks

ipcMain.handle(
  "TOGGLE_SUBTASK_COMPLETION",
  async (event, subtaskId) => {
    db.toggleSubtaskCompletion(subtaskId);
  }
);

ipcMain.handle("GET_SUBTASKS_FROM_PARENT", async (event, parentTaskId) => {
  return db.getSubtasksFromParent(parentTaskId);
});

// Handle for gamification
ipcMain.handle("GET_COMPLETED_TODAY_COUNT", async () => {
  return db.getCompletedTodayCount();
});

// Handler for SmartInput
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

ipcMain.handle("ADD_SMART_RESPONSE", async (event, input) => {
  console.log(input);
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that calculates the probability that the task given by the user can be done within 30 minutes. The probability score X is a number between 0 and 100. If the score X is below 50, split the task into subtasks with names S that take around 30 minutes. create as much as needed. I am going to provide a template for your output. Answer only with the json and no further text. The user gives you the name of the task and nothing more. X is my placeholder for the probability score. S is my placeholder for a name of a subtask suggested by you. T is my placeholder fo the name of the task given by the user. Please preserve the formatting and overall template that i provide. If you don't suggest any subtasks, set an empty array as subtasks. This is the template for your output. The format ismust be a json: {"name":  task T ,"probability":  X ,"subtasks": [{"name": S },...]}`,
        },
        { role: "user", content: input },
      ],
      temperature: 1,
      max_tokens: 200,
    });
    const response = completion.data.choices[0].message.content;
    const data = JSON.parse(response);
    console.log("index.ts) Data: ", data);
    db.addSmartResponse(data);
    return data
  } catch (error) {
    if (error.response) {
      console.log("index.ts) ", error.response.status);
      console.log("index.ts) ", error.response.data);
    } else {
      console.log("index.ts) ", error.message);
    }
  }
});
