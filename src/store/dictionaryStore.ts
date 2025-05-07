import { create } from "zustand";
import { DictionaryData, queryDictionaryCache } from "../lib/dictionary/dictionaryQuery";
import { persist } from "zustand/middleware";
import { createCard } from "../lib/anki";
import { toast } from "sonner";

// Define the state structure
interface DictionaryState {
    searchQuery: string;
    wordData: DictionaryData | null;
    isLoading: boolean;
    error: string | null;
    history: string[];
    ankiCards: { word: string; timestamp: number }[];
    setSearchQuery: (query: string) => void;
    handleSearch: () => Promise<void>;
    clearHistory: () => void;
    removeFromHistory: (word: string) => void;
    addBookMark: () => Promise<void>;
    getFullHistory: () => { word: string; timestamp: number; addedToAnki: boolean }[];
}

// Create the Zustand store
export const useDictionaryStore = create<DictionaryState>()(
    persist(
        (set, get) => ({
            // Initial state
            searchQuery: "",
            wordData: null,
            isLoading: false,
            error: null,
            history: [],
            ankiCards: [],

            // Actions
            setSearchQuery: (query) => set({ searchQuery: query }),

            handleSearch: async () => {
                const query = get().searchQuery.trim();
                if (!query) return;

                set({ isLoading: true, error: null, wordData: null });

                const result = await queryDictionaryCache(query);
                console.log('result', result);
                if (result.data) {
                    // Add to history if successful
                    const currentHistory = get().history;
                    const timestamp = Date.now();

                    // Avoid duplicates and put newest at the top for display history (limited to 20)
                    const newHistory = [
                        query,
                        ...currentHistory.filter(word => word.toLowerCase() !== query.toLowerCase())
                    ].slice(0, 20); // Limit display history to 20 items

                    // For the full history tracking, we store each query with timestamp
                    const fullHistoryStorage = JSON.parse(localStorage.getItem('full-history-storage') || '[]');
                    const newFullHistory = [
                        { word: query, timestamp },
                        ...fullHistoryStorage.filter((item: { word: string }) =>
                            item.word.toLowerCase() !== query.toLowerCase()
                        )
                    ];
                    localStorage.setItem('full-history-storage', JSON.stringify(newFullHistory));

                    set({
                        wordData: result.data,
                        isLoading: false,
                        history: newHistory
                    });
                } else {
                    set({
                        error: result.error || "An unknown error occurred.",
                        isLoading: false,
                        wordData: null,
                    });
                }
            },

            clearHistory: () => set({ history: [] }),

            removeFromHistory: (word) => {
                const currentHistory = get().history;
                set({
                    history: currentHistory.filter(item => item !== word)
                });
            },

            addBookMark: async () => {
                const { wordData } = get();
                if (!wordData) return;

                try {
                    // Create definition HTML from meanings
                    const definitionHtml = wordData.meanings.map(meaning => {
                        const definitions = meaning.definitions.map((def, index) =>
                            `<div>${index + 1}. ${def.definition || ''}${def.example ? `<br><i>Example: ${def.example}</i>` : ''}</div>`
                        ).join('');

                        return `<div><strong>${meaning.partOfSpeech}</strong><div>${definitions}</div></div>`;
                    }).join('<br>');

                    const frontTemplate = definitionHtml;
                    const backTemplate = `<div><h1>${wordData.word}</h1></div>`;
                    await createCard("Dictionary", frontTemplate, backTemplate);

                    // Track this word in ankiCards
                    const ankiCards = get().ankiCards;
                    const newAnkiCards = [
                        { word: wordData.word, timestamp: Date.now() },
                        ...ankiCards.filter(card => card.word.toLowerCase() !== wordData.word.toLowerCase())
                    ];

                    set({ ankiCards: newAnkiCards });

                    toast.success(`Added "${wordData.word}" to Anki`, {
                        description: "Card created with dictionary definition",
                        duration: 3000,
                    });
                } catch (error) {
                    console.error("Failed to add card to Anki:", error);

                    toast.error(`Failed to add "${wordData.word}" to Anki`, {
                        description: String(error),
                        duration: 5000,
                    });
                }
            },

            getFullHistory: () => {
                const { ankiCards } = get();
                const fullHistoryStorage = JSON.parse(localStorage.getItem('full-history-storage') || '[]');

                return fullHistoryStorage.map((item: { word: string; timestamp: number }) => ({
                    ...item,
                    addedToAnki: ankiCards.some(card => card.word.toLowerCase() === item.word.toLowerCase())
                }));
            }
        }),
        {
            name: "dictionary-storage", // name of the storage
            partialize: (state) => ({
                history: state.history,
                ankiCards: state.ankiCards
            }), // persist both history and ankiCards
        }
    )
);
