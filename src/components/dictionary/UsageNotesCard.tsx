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
        <CardTitle className="text-lg">General Usage Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {usageNotes.general && (
          <p>
            {usageNotes.general}
          </p>
        )}
        {usageNotes.specialCases && (
          <p>
            <strong>Special Cases:</strong> {usageNotes.specialCases}
          </p>
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
