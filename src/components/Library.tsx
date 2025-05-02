import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookmarkCheck, Calendar, Search } from "lucide-react";
import { useDictionaryStore } from "@/store/dictionaryStore";
import { ScrollArea } from "./ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Badge } from "./ui/badge";
import { formatDate, groupByDate } from "@/lib/time";

// Define props for Library
interface LibraryProps {
  goBack: () => void;
}

export const Library: React.FC<LibraryProps> = ({ goBack }) => {
  const { getFullHistory, setSearchQuery, handleSearch } = useDictionaryStore();

  // Get the full history and group by date
  const groupedHistory = useMemo(() => {
    const fullHistory = getFullHistory();
    return groupByDate(fullHistory);
  }, [getFullHistory]);

  const handleWordClick = (word: string) => {
    setSearchQuery(word);
    handleSearch();
    goBack();
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="mr-2 flex items-center w-auto p-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go Back</span>
          <h1 className="text-2xl font-bold ml-2">Library</h1>
        </Button>
      </div>

      <div className="flex-1">
        {groupedHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Search className="h-12 w-12 mb-2 opacity-20" />
            <p>Your search history will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-120px)]">
            {groupedHistory.map(group => (
              <Card key={group.date} className="mb-4">
                <CardHeader className="py-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <CardTitle className="text-md">{formatDate(group.date)}</CardTitle>
                  </div>
                  <CardDescription>
                    {group.items.length} {group.items.length === 1 ? 'word' : 'words'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge
                        key={`${item.word}-${item.timestamp}`}
                        variant={item.addedToAnki ? "secondary" : "outline"}
                        className={`cursor-pointer px-3 py-1 hover:bg-primary/10 h-auto ${item.addedToAnki ? 'border-green-500/50 bg-green-500/10' : ''
                          }`}
                        onClick={() => handleWordClick(item.word)}
                      >
                        {item.word}
                        {item.addedToAnki && <BookmarkCheck className="h-3 w-3 ml-1 inline-block" />}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
