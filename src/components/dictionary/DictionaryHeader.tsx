import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Sparkles } from "lucide-react";
import { useDictionaryStore } from "@/store/dictionaryStore";
export function DictionaryHeader() {
  const { wordData, addBookMark, askAI } = useDictionaryStore();

  if (!wordData) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-4xl font-bold">{wordData.word}</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={addBookMark} >
              <BookmarkPlus className="h-6 w-6" />
              <span className="sr-only">Add to Library</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={askAI}>
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
