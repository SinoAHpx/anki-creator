import { create } from "zustand";
import { DictionaryData } from "../lib/dictionary/dictionaryQuery";
import { persist } from "zustand/middleware";
import { handleSearchLogic } from "../lib/dictionary/searchHandler";
import { addBookmarkLogic } from "../lib/dictionary/bookmarkHandler";

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

// Define the type for the store, including both state and actions
export type UseDictionaryStoreType = DictionaryState;

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
                await handleSearchLogic({ get, set });
            },

            clearHistory: () => set({ history: [] }),

            removeFromHistory: (word) => {
                const currentHistory = get().history;
                set({
                    history: currentHistory.filter(item => item !== word)
                });
            },

            addBookMark: async () => {
                // Use the extracted logic
                await addBookmarkLogic({ get, set });
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
