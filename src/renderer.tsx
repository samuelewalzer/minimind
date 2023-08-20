/* eslint-disable react-perf/jsx-no-new-function-as-prop */
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

import { createRoot } from "react-dom/client";
import React from "react";
import App from "./app";

// STYLES
import "./styles/index.css";
import "./styles/buttons.css";
import "./styles/containers.css";

// SERVICES 
import { ViewServiceProvider } from "./viewService";
import { GlobalRerenderProvider } from "./globalRendererContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <>
    <React.StrictMode>
      <ViewServiceProvider currentTask={undefined} viewMode={""} setAddView={function (): void {
        throw new Error("Function not implemented.");
      } } setEditView={function (): void {
        throw new Error("Function not implemented.");
      } } setDetailsView={function (): void {
        throw new Error("Function not implemented.");
      } } setDefaultView={function (): void {
        throw new Error("Function not implemented.");
      } }>
        <GlobalRerenderProvider triggerRerender={function (): void {
          throw new Error("Function not implemented.");
        } } rerenderToken={0}>
          <App />
        </GlobalRerenderProvider>
      </ViewServiceProvider>
    </React.StrictMode>
  </>
);
