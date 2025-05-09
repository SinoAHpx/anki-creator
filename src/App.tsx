import { useEffect, useState } from "react";
import { Dictionary } from "./components/Dictionary";
import { Page, Sidebar } from "./components/Sidebar";
import { Settings } from "./components/Settings";
import { Library } from "./components/Library";
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "./components/ui/resizable";
import { Toaster } from "./components/ui/sonner";
import { setupTray } from "./lib/tray-menu";
await setupTray()

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dictionary");
  const goBackToDictionary = () => setCurrentPage("dictionary");

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
