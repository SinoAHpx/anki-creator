import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DictionaryData } from "@/lib/dictionaryQuery";

interface DictionaryHeaderProps {
  wordData: Pick<DictionaryData, "word" | "pronunciation">;
}

export function DictionaryHeader({ wordData }: DictionaryHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-bold">{wordData.word}</CardTitle>
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
