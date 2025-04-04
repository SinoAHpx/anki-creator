import { Badge } from "@/components/ui/badge";
import { Definition } from "@/lib/dictionaryQuery"; // Assuming Definition interface is exported

interface DefinitionItemProps {
  definition: Definition;
  index: number;
}

export function DefinitionItem({ definition, index }: DefinitionItemProps) {
  return (
    <div className="space-y-1">
      {definition.definition && (
        <p className="text-base">
          <span className="font-semibold mr-2">{index + 1}.</span>
          {definition.definition}
        </p>
      )}
      {definition.example && (
        <p className="text-sm text-muted-foreground italic ml-5">
          e.g., "{definition.example}"
        </p>
      )}
      {definition.usage_notes && (
        <p className="text-xs text-blue-600 dark:text-blue-400 ml-5">
          Note: {definition.usage_notes}
        </p>
      )}
      {definition.synonyms && definition.synonyms.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 pt-1 ml-5">
          <span className="text-sm font-medium">Synonyms:</span>
          {definition.synonyms.map((syn) => (
            <Badge key={syn} variant="outline">
              {syn}
            </Badge>
          ))}
        </div>
      )}
      {definition.countable !== null && (
        <Badge variant="outline" className="mt-1 ml-5">
          {definition.countable ? "Countable" : "Uncountable"}
        </Badge>
      )}
    </div>
  );
}
