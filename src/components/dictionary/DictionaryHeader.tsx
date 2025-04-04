import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DictionaryData } from "@/lib/dictionaryQuery";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Sparkles } from "lucide-react";

interface DictionaryHeaderProps {
  wordData: Pick<DictionaryData, "word" | "pronunciation">;
}

export function DictionaryHeader({ wordData }: DictionaryHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-4xl font-bold">{wordData.word}</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <BookmarkPlus className="h-6 w-6" />
              <span className="sr-only">Add to Library</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Sparkles className="h-6 w-6" />
              <span className="sr-only">Ask AI</span>
            </Button>
          </div>
        </div>
        {wordData.pronunciation && (
          <CardDescription className="text-lg text-muted-foreground">
            {wordData.pronunciation.primary}
            {wordData.pronunciation.alternatives &&
              wordData.pronunciation.alternatives.length > 0 && (
                <span>
                  {" "}
                  (alt: {wordData.pronunciation.alternatives.join(", ")})
                </span>
              )}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}
