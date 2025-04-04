import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface EtymologyCardProps {
  etymology: string;
}

export function EtymologyCard({ etymology }: EtymologyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Etymology</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{etymology}</p>
      </CardContent>
    </Card>
  );
}
