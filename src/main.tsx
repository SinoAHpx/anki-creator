import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { Menu, MenuItem } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';
import { exit } from '@tauri-apps/plugin-process';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { defaultWindowIcon } from '@tauri-apps/api/app';

// Function to setup the tray icon
async function setupTray() {
  const showItem = await MenuItem.new({
    id: 'show', text: 'Show App', action: () => {
      console.log('show app pressed')
    }
  });
  const quitItem = await MenuItem.new({
    id: 'quit', text: 'Quit', action: () => {
      exit(0)
    },
  });

  const trayMenu = await Menu.new({
    items: [showItem, quitItem],
  });

  try {
    await TrayIcon.new({
      tooltip: 'Anki Creator',
      menu: trayMenu,
      // You might need an icon file here. Let's omit it for now
      // icon: 'path/to/icon.png' 
      icon: await defaultWindowIcon() || []
    });
  } catch (e) {
    console.error('Failed to create tray icon:', e);
  }
}

// Call the setup function
setupTray();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
