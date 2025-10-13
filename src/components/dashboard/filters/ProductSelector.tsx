import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProductType = "all" | "krono" | "gastro" | "thor";

interface ProductSelectorProps {
  value: ProductType;
  onChange: (value: ProductType) => void;
}

export const ProductSelector = ({ value, onChange }: ProductSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Välj produkt" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Alla produkter</SelectItem>
        <SelectItem value="krono">Krono (Receptionist)</SelectItem>
        <SelectItem value="gastro">Gastro (Restaurang)</SelectItem>
        <SelectItem value="thor">Thor (Säljcoach)</SelectItem>
      </SelectContent>
    </Select>
  );
};
