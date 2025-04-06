import { useState } from "react";
import { Dictionary } from "./components/Dictionary";
import { Page, Sidebar } from "./components/Sidebar";
import { Settings } from "./components/Settings";
import { Library } from "./components/Library";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dictionary");
  const goBackToDictionary = () => setCurrentPage("dictionary");

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {(() => {
        switch (currentPage) {
          case "dictionary":
            return (
              <div className="flex flex-1 overflow-hidden">
                <Sidebar setActivePage={setCurrentPage} />
                <div className="relative flex-1">
                  <Dictionary />
                </div>
              </div>
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
