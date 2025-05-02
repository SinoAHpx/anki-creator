import { create } from "zustand";
import { DictionaryData, queryDictionaryCache } from "../lib/dictionary/dictionaryQuery";
import { persist } from "zustand/middleware";
import { createCard } from "../lib/anki";
import { getLLMResult } from "../lib/llmService";
import { toast } from "sonner";

// Define the state structure
interface DictionaryState {
    searchQuery: string;
    wordData: DictionaryData | null;
    isLoading: boolean;
    error: string | null;
    history: string[];
    ankiCards: { word: string; timestamp: number }[];
    aiExplanation: string | null;
    isAILoading: boolean;
    setSearchQuery: (query: string) => void;
    handleSearch: () => Promise<void>;
    clearHistory: () => void;
    removeFromHistory: (word: string) => void;
    addBookMark: () => Promise<void>;
    askAI: () => Promise<void>;
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
            aiExplanation: null,
            isAILoading: false,

            // Actions
            setSearchQuery: (query) => set({ searchQuery: query }),

            handleSearch: async () => {
                const query = get().searchQuery.trim();
                if (!query) return;

                set({ isLoading: true, error: null, wordData: null, aiExplanation: null });

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

            askAI: async () => {
                const { wordData } = get();
                if (!wordData) return;

                set({ isAILoading: true });

                try {
                    const prompt = `
                        Word: ${wordData.word}
                        
                        I need a clear explanation of this word that:
                        1. Explains the meaning in simple terms
                        2. Provides 2-3 practical example sentences showing how to use it
                        3. Mentions any common collocations or phrases
                        4. If relevant, notes any important usage contexts (formal/informal, AmE/BrE differences, etc.)
                        
                        Format your response in clean HTML with appropriate heading and paragraph tags.
                    `;

                    const systemPrompt = "You are a helpful AI assistant that provides clear and concise explanations of vocabulary words with examples that make them easy to understand and remember.";

                    const explanation = await getLLMResult(prompt, systemPrompt);
                    set({ aiExplanation: explanation, isAILoading: false });

                    toast.success(`AI explanation generated for "${wordData.word}"`, {
                        description: "You can now add this word to Anki with enhanced explanation",
                        duration: 3000,
                    });
                } catch (error) {
                    console.error("Failed to get AI explanation:", error);
                    set({
                        aiExplanation: "Sorry, I couldn't generate an explanation at this time.",
                        isAILoading: false
                    });

                    toast.error(`Failed to generate AI explanation`, {
                        description: "Please check your API key and internet connection",
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
