import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { ThemeToggle } from "./ThemeToggle";
import { queryDictionaryCache, DictionaryData } from "../lib/dictionaryQuery";
import { DictionarySidebar } from "./dictionary/DictionarySidebar";
import { DictionaryHeader } from "./dictionary/DictionaryHeader";
import { MeaningCard } from "./dictionary/MeaningCard";
import { EtymologyCard } from "./dictionary/EtymologyCard";
import { UsageNotesCard } from "./dictionary/UsageNotesCard";

export function Dictionary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wordData, setWordData] = useState<DictionaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Updated function to handle search using the extracted logic
  const handleSearch = async () => {
    if (!searchQuery) return;

    setIsLoading(true);
    setError(null);
    setWordData(null);

    const result = await queryDictionaryCache(searchQuery);

    if (result.data) {
      setWordData(result.data);
      setError(null);
    } else {
      setWordData(null);
      // TODO: Handle LLM fallback based on the specific error if needed
      setError(result.error || "An unknown error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <DictionarySidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isLoading={isLoading}
        />
        <ThemeToggle />

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : wordData ? (
            <ScrollArea className="h-[calc(100vh-88px)] pr-4">
              <div className="space-y-6">
                <DictionaryHeader wordData={wordData} />

                {/* Meanings Cards */}
                <div className="space-y-4">
                  {wordData.meanings.map((meaning, index) => (
                    <MeaningCard
                      key={`${meaning.partOfSpeech}-${index}`}
                      meaning={meaning}
                      grammaticalForms={wordData.grammaticalForms}
                    />
                  ))}
                </div>

                {/* Etymology Card */}
                {wordData.etymology && (
                  <EtymologyCard etymology={wordData.etymology} />
                )}

                {/* Usage Notes Card */}
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
      </div>
    </div>
  );
}
