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
        const response = await fetch("/dictionary_cache.json"); // Fetch from public root

        if (!response.ok) {
            // Handle case where cache file doesn't exist or fetch fails
            if (response.status === 404) {
                console.warn(
                    "dictionary_cache.json not found. Proceeding to LLM."
                );
                return {
                    data: null,
                    error: null, // Don't show error to user, just let it proceed to online lookup
                };
            } else {
                console.error(`Cache fetch error: ${response.statusText}`);
                return {
                    data: null,
                    error: null, // Don't show technical error to user
                };
            }
        }

        // Cache is an array of word entries
        const cache: RawDictionaryEntry[] = await response.json();
        // Find the entry for the searched word
        const entry = cache.find((item) => item.word === lowerCaseQuery);

        if (entry) {
            // Map raw entry to the enhanced DictionaryData structure
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
                            countable: def.countable ?? null, // Map countable, default to null
                        })),
                    };
                })
                .filter((m): m is Meaning => m !== null); // Filter out nulls and assert type

            const mappedData: DictionaryData = {
                word: entry.word,
                pronunciation: entry.pronunciation || null,
                grammaticalForms: entry.grammatical_forms || null,
                meanings: meanings,
                etymology: entry.etymology || null,
                usageNotes: entry.usage_notes || null,
            };
            return { data: mappedData, error: null };
        } else {
            // 2. Word not in cache -> Need LLM
            console.log(`"${searchQuery}" not found in cache. Querying LLM...`);
            return {
                data: null,
                error: null, // No need to show error message about cache miss
            };
        }
    } catch (err) {
        console.error("Error during dictionary cache query:", err);
        // Log error but don't show technical details to user
        return { data: null, error: null };
    }
}

/**
 * Queries the external dictionary API for a given word.
 * @param searchQuery The word to search for.
 * @returns A promise that resolves to an object containing either the dictionary data or an error message.
 */
export async function queryDictionaryAPI(
    searchQuery: string
): Promise<QueryResult> {
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Instead of using the direct URL, use the /api proxy path
    // that's configured in vite.config.ts
    const url = `/query?word=${encodeURIComponent(lowerCaseQuery)}`;

    try {
        console.log(`Querying dictionary API through proxy: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    data: null,
                    error: `"${searchQuery}" was not found in our dictionary.`,
                };
            } else if (response.status >= 500) {
                return {
                    data: null,
                    error: "Dictionary service is currently unavailable. Please try again later.",
                };
            } else {
                console.error(
                    `API error: ${response.status} ${response.statusText}`
                );
                return {
                    data: null,
                    error: "Unable to retrieve word information at this time.",
                };
            }
        }

        // Assuming API returns data similar to RawDictionaryEntry structure
        const entry: RawDictionaryEntry = await response.json();

        // Map raw entry to the enhanced DictionaryData structure
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

        const mappedData: DictionaryData = {
            word: entry.word, // Use the word from the response, might differ in casing etc.
            pronunciation: entry.pronunciation || null,
            grammaticalForms: entry.grammatical_forms || null,
            meanings: meanings,
            etymology: entry.etymology || null,
            usageNotes: entry.usage_notes || null,
        };

        console.log(`Successfully fetched data for "${searchQuery}" from API.`);
        return { data: mappedData, error: null };
    } catch (err) {
        console.error("Error during dictionary API query:", err);

        // Log the technical error for debugging but show user-friendly message
        return {
            data: null,
            error: "Unable to connect to the dictionary service. Please check your connection and try again.",
        };
    }
}
