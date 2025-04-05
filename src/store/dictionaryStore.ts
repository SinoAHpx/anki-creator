import { create } from "zustand";
import { queryDictionaryCache, DictionaryData } from "../lib/dictionaryQuery";

// Define the state structure
interface DictionaryState {
  searchQuery: string;
  wordData: DictionaryData | null;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  handleSearch: () => Promise<void>;
  // You can add other state and actions here as needed
}

// Create the Zustand store
export const useDictionaryStore = create<DictionaryState>((set, get) => ({
  // Initial state
  searchQuery: "",
  wordData: null,
  isLoading: false,
  error: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  handleSearch: async () => {
    const query = get().searchQuery;
    if (!query) return;

    set({ isLoading: true, error: null, wordData: null });

    const result = await queryDictionaryCache(query);

    if (result.data) {
      set({ wordData: result.data, isLoading: false });
    } else {
      set({
        error: result.error || "An unknown error occurred.",
        isLoading: false,
        wordData: null,
      });
    }
  },
}));
