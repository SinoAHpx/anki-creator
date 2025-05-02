import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DictionaryData } from "@/lib/dictionary/dictionaryQuery";

type UsageNotes = DictionaryData["usageNotes"];

interface UsageNotesCardProps {
  usageNotes: NonNullable<UsageNotes>; // Ensure usageNotes is not null
}

export function UsageNotesCard({ usageNotes }: UsageNotesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Usage Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {usageNotes.general && (
          <div>
            <strong>General:</strong> {usageNotes.general}
          </div>
        )}
        {usageNotes.specialCases &&
          Object.keys(usageNotes.specialCases).length > 0 && (
            <div>
              <strong>Special Cases:</strong>
              <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                {Object.entries(usageNotes.specialCases).map(
                  ([key, value]) => (
                    <li key={key}>
                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        {usageNotes.regionalVariations &&
          Object.keys(usageNotes.regionalVariations).length > 0 && (
            <div>
              <strong>Regional Variations:</strong>
              <ul className="list-disc list-inside pl-4">
                {Object.entries(usageNotes.regionalVariations).map(
                  ([region, note]) => (
                    <li key={region}>
                      <strong>{region}:</strong> {note}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
