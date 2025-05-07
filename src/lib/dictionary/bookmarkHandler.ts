import { toast } from "sonner";
import { createCard } from "../anki";
import type { UseDictionaryStoreType } from "../../store/dictionaryStore";
import type { DictionaryData } from "./dictionaryQuery";

type AddBookmarkArgs = {
    get: () => Pick<UseDictionaryStoreType, 'wordData' | 'ankiCards'>;
    set: (partial: Partial<Pick<UseDictionaryStoreType, 'ankiCards'>>) => void;
};

/**
 * Generates fancy HTML templates for Anki cards
 * @param wordData The dictionary data for the word
 * @returns Object containing front and back templates
 */
export const generateCardTemplates = (wordData: DictionaryData) => {
    // Generate the definition HTML with improved styling
    const definitionHtml = wordData.meanings.map(meaning => {
        const definitions = meaning.definitions.map((def, index) => {
            const exampleHtml = def.example
                ? `<div class="example"><span class="example-label">Example:</span> <span class="example-text">${def.example}</span></div>`
                : '';

            return `
                <div class="definition-item">
                    <div class="definition-number">${index + 1}</div>
                    <div class="definition-content">
                        <div class="definition-text">${def.definition || ''}</div>
                        ${exampleHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="meaning-group">
                <div class="part-of-speech">${meaning.partOfSpeech}</div>
                <div class="definitions-list">${definitions}</div>
            </div>
        `;
    }).join('');

    // Adding CSS styles for better appearance
    const styles = `
        <style>
            .card-container {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: #f9f9f9;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .pronunciation {
                color: #666;
                font-style: italic;
                text-align: center;
                margin-bottom: 15px;
            }
            .meaning-group {
                margin-bottom: 20px;
                background-color: #ffffff;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            }
            .part-of-speech {
                font-weight: bold;
                font-size: 1.2em;
                color: #1a4971;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
                margin-bottom: 10px;
                text-transform: capitalize;
            }
            .definition-item {
                display: flex;
                margin-bottom: 10px;
                border-left: 3px solid #3c7eb9;
                padding-left: 10px;
            }
            .definition-number {
                flex: 0 0 25px;
                font-weight: bold;
                color: #333;
            }
            .definition-content {
                flex: 1;
            }
            .definition-text {
                margin-bottom: 5px;
                color: #222;
                font-weight: 500;
                line-height: 1.4;
            }
            .example {
                font-style: italic;
                color: #444;
                margin-left: 5px;
                padding-left: 10px;
                border-left: 2px solid #ccc;
                background-color: #f5f5f5;
                padding: 5px 10px;
                border-radius: 4px;
            }
            .example-label {
                font-weight: bold;
                color: #555;
            }
            .example-text {
                color: #333;
            }
        </style>
    `;

    // Generate front template (definition)
    const frontTemplate = `
        <div class="card-container">
            ${styles}
            ${definitionHtml}
        </div>
    `;

    // Generate back template (word)
    const backTemplate = `
        <div class="card-container">
            ${styles}
            ${wordData.word}
        </div>
    `;

    return { frontTemplate, backTemplate };
};

export const addBookmarkLogic = async ({ get, set }: AddBookmarkArgs): Promise<void> => {
    const { wordData } = get();
    if (!wordData) return;

    try {
        // Use the extracted template generation function
        const { frontTemplate, backTemplate } = generateCardTemplates(wordData);

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