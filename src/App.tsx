import { useEffect, useState } from "react";
import { Dictionary } from "./components/Dictionary";
import { Page, Sidebar } from "./components/Sidebar";
import { Settings } from "./components/Settings";
import { Library } from "./components/Library";
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "./components/ui/resizable";
import { Toaster } from "./components/ui/sonner";
import { Menu, MenuItem } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';
import { exit } from '@tauri-apps/plugin-process';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { defaultWindowIcon } from '@tauri-apps/api/app';

async function setupTray() {
  const showItem = await MenuItem.new({
    id: 'show', text: 'Show App', action: () => {
      const currentWindow = getCurrentWindow()
      currentWindow.setFocus()
    }
  });
  const quitItem = await MenuItem.new({
    id: 'quit', text: 'Quit', action: () => {
      exit(0)
    },
  });

  try {
    const tray = TrayIcon.getById('main')
    if (tray === null) {
      await TrayIcon.new({
        tooltip: 'Anki Creator',
        menu: await Menu.new({
          items: [showItem, quitItem],
        }),
        icon: await defaultWindowIcon() || [],
        id: 'main'
      });
    }

  } catch (e) {
    console.error('Failed to create tray icon:', e);
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dictionary");
  const goBackToDictionary = () => setCurrentPage("dictionary");

  useEffect(() => {
    setupTray();
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {(() => {
        switch (currentPage) {
          case "dictionary":
            return (
              <ResizablePanelGroup
                direction="horizontal"
                className="flex flex-1 h-full overflow-hidden"
              >
                <Sidebar setActivePage={setCurrentPage} />
                <ResizableHandle />
                <ResizablePanel defaultSize={80} className="relative">
                  <Dictionary />
                </ResizablePanel>
              </ResizablePanelGroup>
            );
          case "settings":
            return <Settings goBack={goBackToDictionary} />;
          case "library":
            return <Library goBack={goBackToDictionary} />;
          default:
            return null;
        }
      })()}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
