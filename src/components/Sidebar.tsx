import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDictionaryStore } from "@/store/dictionaryStore";

export const Sidebar: React.FC = () => {
  const { searchQuery, setSearchQuery, handleSearch, isLoading } =
    useDictionaryStore();

  return (
    <aside className="w-80 border-r flex flex-col p-4 space-y-4 bg-muted/20">
      <Input
        placeholder="Enter a word..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch} disabled={isLoading || !searchQuery}>
        {isLoading ? "Searching..." : "Query"}
      </Button>
      {/* Additional sidebar content can go here */}
    </aside>
  );
};
