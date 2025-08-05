// components/TemplateSelector.tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function TemplateSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select Template" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="template1">Template 1 (Original)</SelectItem>
        <SelectItem value="template2">Template 2 (Latest)</SelectItem>
      </SelectContent>
    </Select>
  );
}
