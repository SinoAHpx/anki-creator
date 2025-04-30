import { create } from "zustand";
import { DictionaryData, queryDictionaryCache } from "../lib/dictionaryQuery";
import { persist } from "zustand/middleware";

// Define the state structure
interface DictionaryState {
    searchQuery: string;
    wordData: DictionaryData | null;
    isLoading: boolean;
    error: string | null;
    history: string[];
    setSearchQuery: (query: string) => void;
    handleSearch: () => Promise<void>;
    clearHistory: () => void;
    removeFromHistory: (word: string) => void;
    // You can add other state and actions here as needed
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

            // Actions
            setSearchQuery: (query) => set({ searchQuery: query }),

            handleSearch: async () => {
                const query = get().searchQuery.trim();
                if (!query) return;

                set({ isLoading: true, error: null, wordData: null });

                const result = await queryDictionaryCache(query);

                if (result.data) {
                    // Add to history if successful
                    const currentHistory = get().history;
                    // Avoid duplicates and put newest at the top
                    const newHistory = [
                        query,
                        ...currentHistory.filter(word => word.toLowerCase() !== query.toLowerCase())
                    ].slice(0, 20); // Limit history to 20 items

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
        }),
        {
            name: "dictionary-storage", // name of the storage
            partialize: (state) => ({ history: state.history }), // only history will be persisted
        }
    )
);
