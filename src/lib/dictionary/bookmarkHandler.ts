import { toast } from "sonner";
import { createCard } from "../anki";
import type { UseDictionaryStoreType } from "../../store/dictionaryStore";

type AddBookmarkArgs = {
    get: () => Pick<UseDictionaryStoreType, 'wordData' | 'ankiCards'>;
    set: (partial: Partial<Pick<UseDictionaryStoreType, 'ankiCards'>>) => void;
};

export const addBookmarkLogic = async ({ get, set }: AddBookmarkArgs): Promise<void> => {
    const { wordData } = get();
    if (!wordData) return;

    try {
        const definitionHtml = wordData.meanings.map(meaning => {
            const definitions = meaning.definitions.map((def, index) =>
                `<div>${index + 1}. ${def.definition || ''}${def.example ? `<br><i>Example: ${def.example}</i>` : ''}</div>`
            ).join('');

            return `<div><strong>${meaning.partOfSpeech}</strong><div>${definitions}</div></div>`;
        }).join('<br>');

        const frontTemplate = definitionHtml;
        const backTemplate = `<div><h1>${wordData.word}</h1></div>`;
        await createCard("Dictionary", frontTemplate, backTemplate);

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
}; 