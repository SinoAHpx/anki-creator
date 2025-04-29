import { useState } from "react";
import { Dictionary } from "./components/Dictionary";
import { Page, Sidebar } from "./components/Sidebar";
import { Settings } from "./components/Settings";
import { Library } from "./components/Library";
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "./components/ui/resizable";

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
                className="flex flex-1 overflow-hidden"
              >
                <Sidebar setActivePage={setCurrentPage} />
                <ResizableHandle withHandle />
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
    </div>
  );
}

export default App;
