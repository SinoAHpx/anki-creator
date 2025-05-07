import React, { Dispatch, SetStateAction, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDictionaryStore } from "@/store/dictionaryStore";
import { Library, Settings, Clock, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ResizablePanel } from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { useSettingsStore } from "@/store/settingsStore";
import { registerShortcut } from "@/lib/shortcuts/register-shortcuts";

export type Page = "dictionary" | "settings" | "library";

interface SidebarProps {
  setActivePage: Dispatch<SetStateAction<Page>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ setActivePage }) => {
  const {
    searchQuery,
    setSearchQuery,
    handleSearch,
    isLoading,
    history,
    removeFromHistory
  } = useDictionaryStore();

  const { shortcuts } = useSettingsStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleHistoryItemClick = (word: string) => {
    setSearchQuery(word);
    handleSearch();
  };

  useEffect(() => {
    registerShortcut(searchInputRef);
  }, [shortcuts]);

  return (
    <ResizablePanel className="border-r flex flex-col justify-between p-4 space-y-4 bg-muted/20">
      <Input
        id="search-input"
        ref={searchInputRef}
        placeholder="Enter a word..."
        value={searchQuery}
        autoFocus
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button
        variant="outline"
        onClick={handleSearch}
        disabled={isLoading || !searchQuery}
      >
        {isLoading ? "Searching..." : "Query"}
      </Button>

      {/* History Section */}
      {history.length > 0 && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Recent Searches</span>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-1">
              {history.map((word) => (
                <div key={word} className="flex items-center justify-between group">
                  <button
                    className="text-sm py-1 px-2 rounded hover:bg-accent w-full text-left"
                    onClick={() => handleHistoryItemClick(word)}
                  >
                    {word}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(word);
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="mt-auto flex flex-row items-center justify-center space-x-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActivePage("settings")}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActivePage("library")}
        >
          <Library className="h-5 w-5" />
          <span className="sr-only">Library</span>
        </Button>
      </div>
    </ResizablePanel>
  );
};
