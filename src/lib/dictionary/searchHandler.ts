import { queryDictionaryCache } from "./dictionaryQuery";
import type { UseDictionaryStoreType } from "../../store/dictionaryStore";

type HandleSearchArgs = {
    get: () => Pick<UseDictionaryStoreType, 'searchQuery' | 'history'>;
    set: (partial: Partial<Pick<UseDictionaryStoreType, 'isLoading' | 'error' | 'wordData' | 'history'>>) => void;
};

export const handleSearchLogic = async ({ get, set }: HandleSearchArgs): Promise<void> => {
    const query = get().searchQuery.trim();
    if (!query) return;

    set({ isLoading: true, error: null, wordData: null });

    const result = await queryDictionaryCache(query);

    if (result.data) {
        const currentHistory = get().history;
        const timestamp = Date.now();

        const newHistory = [
            query,
            ...currentHistory.filter(word => word.toLowerCase() !== query.toLowerCase())
        ].slice(0, 20);

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
}; 