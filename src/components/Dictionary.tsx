import { ScrollArea } from "./ui/scroll-area";
import { DictionaryHeader } from "./dictionary/DictionaryHeader";
import { MeaningCard } from "./dictionary/MeaningCard";
import { EtymologyCard } from "./dictionary/EtymologyCard";
import { UsageNotesCard } from "./dictionary/UsageNotesCard";
import { useDictionaryStore } from "../store/dictionaryStore";

export function Dictionary() {
  const { wordData, isLoading, error } = useDictionaryStore();

  return (
    <div className="flex-1 p-6 overflow-auto">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : wordData ? (
        <ScrollArea className="h-[calc(100vh-88px)] pr-4">
          <div className="space-y-6">
            <DictionaryHeader wordData={wordData} />

            <div className="space-y-4">
              {wordData.meanings.map((meaning, index) => (
                <MeaningCard
                  key={`${meaning.partOfSpeech}-${index}`}
                  meaning={meaning}
                  grammaticalForms={wordData.grammaticalForms}
                />
              ))}
            </div>

            {wordData.etymology && (
              <EtymologyCard etymology={wordData.etymology} />
            )}

            {wordData.usageNotes && (
              <UsageNotesCard usageNotes={wordData.usageNotes} />
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            Enter a word in the search bar and click "Query".
          </p>
        </div>
      )}
    </div>
  );
}
