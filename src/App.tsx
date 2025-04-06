import { useState } from "react";
import { Dictionary } from "./components/Dictionary";
import { Sidebar } from "./components/Sidebar";
import { Settings } from "./components/Settings";

// Define the possible page types
type Page = "dictionary" | "settings";

function App() {
  // State to track the current active page
  const [currentPage, setCurrentPage] = useState<Page>("dictionary");

  // Function to navigate back to the dictionary
  const goBackToDictionary = () => setCurrentPage("dictionary");

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {currentPage === "dictionary" ? (
        // Dictionary View: Sidebar + Content
        <div className="flex flex-1 overflow-hidden">
          <Sidebar setActivePage={setCurrentPage} />
          <div className="relative flex-1">
            <Dictionary />
          </div>
        </div>
      ) : (
        // Settings View: Full Screen
        <Settings goBack={goBackToDictionary} />
      )}
    </div>
  );
}

export default App;
