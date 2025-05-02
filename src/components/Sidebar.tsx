import React, { Dispatch, SetStateAction, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDictionaryStore } from "@/store/dictionaryStore";
import { Library, Settings, Clock, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ResizablePanel } from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { useSettingsStore } from "@/store/settingsStore";
import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';

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

  const { getShortcutByAction, shortcuts } = useSettingsStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleHistoryItemClick = (word: string) => {
    setSearchQuery(word);
    handleSearch();
  };

  // Function to focus the search input
  const focusSearchInput = async () => {
    try {
      // Get the current window instance
      const appWindow = await getCurrentWindow();

      // Check if window is visible, if not show it
      const isVisible = await appWindow.isVisible();
      if (!isVisible) {
        await appWindow.show();
        await appWindow.setFocus();
      }

      // Focus the search input element
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        console.log('to set the focus on the input');

      } else {
        console.log('we didnt set the shortcut of the key');
      }
    } catch (error) {
      console.error("Error focusing search input:", error);
    }
  };

  // Register and unregister global shortcut
  useEffect(() => {
    const shortcut = getShortcutByAction("focusSearch");
    if (!shortcut) return;

    const registerShortcut = async () => {
      try {
        // Unregister shortcut if it already exists to prevent duplicates
        try {
          await unregister(shortcut.shortcut);
        } catch (e) {
          // Ignore errors from unregister - shortcut might not be registered yet
        }

        // Register the new shortcut
        await register(shortcut.shortcut, () => {
          focusSearchInput();
        });
        console.log(`Registered shortcut: ${shortcut.shortcut}`);
      } catch (error) {
        console.error("Failed to register shortcut:", error);
      }
    };

    registerShortcut();

    // Cleanup: unregister shortcut when component unmounts
    return () => {
      const cleanup = async () => {
        try {
          await unregister(shortcut.shortcut);
          console.log(`Unregistered shortcut: ${shortcut.shortcut}`);
        } catch (e) {
          // Ignore errors from unregister on cleanup
        }
      };
      cleanup();
    };
  }, [getShortcutByAction, shortcuts]); // Add shortcuts dependency to re-register when shortcuts change

  return (
    <ResizablePanel className="border-r flex flex-col justify-between p-4 space-y-4 bg-muted/20">
      <Input
        id="search-input"
        ref={searchInputRef}
        placeholder="Enter a word..."
        value={searchQuery}
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
