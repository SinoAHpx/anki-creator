import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DictionarySidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
}

export function DictionarySidebar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading,
}: DictionarySidebarProps) {
  return (
    <div className="w-80 border-r flex flex-col p-4 space-y-4 bg-muted/20">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Search..."
          className="w-full rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          className="w-full rounded-md font-normal"
          onClick={handleSearch}
          disabled={isLoading || !searchQuery}
        >
          {isLoading ? "Querying..." : "Query"}
        </Button>
        <Button variant="outline" className="w-full rounded-md font-normal">
          Library
        </Button>
      </div>
      <div className="flex-1"></div>
      <Button
        variant="outline"
        className="w-full mt-auto rounded-md font-normal"
      >
        Settings
      </Button>
    </div>
  );
}
