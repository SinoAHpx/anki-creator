import { ScrollArea } from "./ui/scroll-area";
import { DictionaryHeader } from "./dictionary/DictionaryHeader";
import { MeaningCard } from "./dictionary/MeaningCard";
import { EtymologyCard } from "./dictionary/EtymologyCard";
import { UsageNotesCard } from "./dictionary/UsageNotesCard";
import { useDictionaryStore } from "../store/dictionaryStore";
import { ErrorMessage } from "./ui/error-message";

export function Dictionary() {
  const { wordData, isLoading, error } = useDictionaryStore();

  return (
    <div className="flex-1 p-4 overflow-auto relative">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Searching dictionary...</p>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-6 max-w-md">
            <ErrorMessage title="Dictionary Lookup Failed" message={error} />
          </div>
        </div>
      ) : wordData ? (
        <>
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
        </>
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
