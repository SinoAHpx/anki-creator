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
        console.warn("dictionary_cache.json not found. Proceeding to LLM.");
        return {
          data: null,
          error: `Word "${searchQuery}" not in cache (cache file not found). LLM query needed.`,
        };
      } else {
        throw new Error(`Failed to fetch cache: ${response.statusText}`);
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
        error: `Word "${searchQuery}" not found in cache. LLM query needed.`,
      };
    }
  } catch (err) {
    console.error("Error during dictionary cache query:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred during cache query.";
    return { data: null, error: errorMessage };
  }
}
