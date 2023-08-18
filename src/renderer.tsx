/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./app";
import { ViewServiceProvider } from "./viewService";
import React from "react";
import { GlobalRerenderProvider } from "./globalRendererContext";

function handleView() {
  throw new Error("Function not implemented.");
}

function handleDetailsView() {
  throw new Error("Function not implemented.");
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <>
    <React.StrictMode>
      <ViewServiceProvider>
        <GlobalRerenderProvider>
          <App />
        </GlobalRerenderProvider>
      </ViewServiceProvider>
    </React.StrictMode>
  </>
);
