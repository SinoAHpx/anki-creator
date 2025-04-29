import React, { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDictionaryStore } from "@/store/dictionaryStore";
import { Library, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ResizablePanel } from "./ui/resizable";


export type Page = "dictionary" | "settings" | "library";

interface SidebarProps {
  setActivePage: Dispatch<SetStateAction<Page>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ setActivePage }) => {
  const { searchQuery, setSearchQuery, handleSearch, isLoading } =
    useDictionaryStore();

  return (
    <ResizablePanel className="border-r flex flex-col p-4 space-y-4 bg-muted/20">
      <Input
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
      {/* Additional sidebar content can go here */}

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
