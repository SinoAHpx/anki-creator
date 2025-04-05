import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({ title = "Error", message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
