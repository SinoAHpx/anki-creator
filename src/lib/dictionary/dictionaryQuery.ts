export interface Definition {
    definition?: string;
    example?: string;
    usage_notes?: string;
    synonyms?: string[];
    countable?: boolean | null;
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

export interface DictionaryData {
    word: string;
    pronunciation: {
        primary?: string;
        alternatives?: string[];
    } | null;
    grammaticalForms: Record<string, any> | null; // Simplified for now
    meanings: Meaning[];
    etymology: string | null;
    usageNotes: {
        general?: string;
        regionalVariations?: Record<string, string>;
        specialCases?: string;
    } | null;
}

// Raw structure from JSON (more detailed)
interface RawDictionaryEntry {
    word: string;
    pronunciation?: { primary?: string; alternatives?: string[] };
    grammatical_forms?: Record<string, any>;
    parts_of_speech?: string[];
    meanings?: {
        [key: string]: {
            definition?: string;
            example?: string;
            usage_notes?: string;
            synonyms?: string[];
            countable?: boolean;
        }[];
    };
    etymology?: string;
    usage_notes?: {
        general?: string;
        regional_variations?: Record<string, string>;
        special_cases?: string;
    };
}

interface QueryResult {
    data: DictionaryData | null;
    error: string | null;
}

/**
 * Maps a raw dictionary entry to our standardized DictionaryData format
 */
function mapEntryToData(entry: RawDictionaryEntry): DictionaryData {
    const meanings: Meaning[] = (entry.parts_of_speech || [])
        .map((pos): Meaning | null => {
            const posMeanings = entry.meanings?.[pos];
            if (!posMeanings) return null;

            return {
                partOfSpeech: pos,
                definitions: posMeanings.map((def) => ({
                    definition: def.definition,
                    example: def.example,
                    usage_notes: def.usage_notes,
                    synonyms: def.synonyms,
                    countable: def.countable ?? null,
                })),
            };
        })
        .filter((m): m is Meaning => m !== null);

    return {
        word: entry.word,
        pronunciation: entry.pronunciation || null,
        grammaticalForms: entry.grammatical_forms || null,
        meanings: meanings,
        etymology: entry.etymology || null,
        usageNotes: entry.usage_notes ? {
            general: entry.usage_notes.general,
            regionalVariations: entry.usage_notes.regional_variations,
            specialCases: entry.usage_notes.special_cases,
        } : null,
    };
}

/**
 * Queries the local dictionary cache for a given word.
 * @param searchQuery The word to search for.
 * @returns A promise that resolves to an object containing either the dictionary data or an error message.
 */
export async function queryDictionaryCache(
    searchQuery: string
): Promise<QueryResult> {
    const lowerCaseQuery = searchQuery.toLowerCase();

    try {
        // 1. Check cache
        const response = await fetch("/dictionary_cache.json");

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(
                    "dictionary_cache.json not found. Proceeding to LLM."
                );
                return {
                    data: null,
                    error: null,
                };
            } else {
                console.error(`Cache fetch error: ${response.statusText}`);
                return {
                    data: null,
                    error: null,
                };
            }
        }
        
        const cache = await response.json();
        const entry = Array.isArray(cache)
            ? cache.find((item) => item.word.toLowerCase() === lowerCaseQuery)
            : cache[lowerCaseQuery];

        if (entry) {
            const mappedData = mapEntryToData(entry);
            return { data: mappedData, error: null };
        } else {
            return {
                data: null,
                error: `"${searchQuery}" not found in cache.`,
            };
        }
    } catch (err) {
        console.error("Error during dictionary cache query:", err);
        return { data: null, error: null };
    }
}