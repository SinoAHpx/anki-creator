import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DefinitionItem } from "./DefinitionItem";
import { Meaning, DictionaryData } from "@/lib/dictionaryQuery"; // Adjusted path

interface MeaningCardProps {
  meaning: Meaning;
  grammaticalForms: DictionaryData["grammaticalForms"]; // Get the type from DictionaryData
}

export function MeaningCard({ meaning, grammaticalForms }: MeaningCardProps) {
  // Get grammatical forms specific to this part of speech
  const specificGrammaticalForms = grammaticalForms?.[meaning.partOfSpeech];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-xl font-semibold capitalize">
            {meaning.partOfSpeech}
          </CardTitle>
          {/* Display Grammatical Forms as Badges if they exist */}
          {specificGrammaticalForms &&
            typeof specificGrammaticalForms === "object" && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(specificGrammaticalForms).map(
                  ([formType, formValue]) => (
                    <Badge
                      key={formType}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      <span className="capitalize mr-1">
                        {formType.replace(/_/g, " ")}:
                      </span>
                      {String(formValue)}
                    </Badge>
                  )
                )}
              </div>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pl-4 border-l-2 border-primary/30 ml-1">
          {meaning.definitions.map((def, defIndex) => (
            <DefinitionItem key={defIndex} definition={def} index={defIndex} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
