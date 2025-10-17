import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CreateLeadSearchData } from "@/hooks/useLeadSearches";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface LeadSearchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateLeadSearchData) => void;
  isSubmitting?: boolean;
}

const INDUSTRIES = ["Tech", "Finance", "Retail", "Healthcare", "Manufacturing", "Construction", "Education", "Real Estate"];
const LOCATIONS = ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg"];
const COMPANY_SIZES = [
  { value: "small", label: "Små (1-50)" },
  { value: "medium", label: "Medelstora (51-250)" },
  { value: "large", label: "Stora (250+)" },
];

export function LeadSearchForm({ open, onOpenChange, onSubmit, isSubmitting }: LeadSearchFormProps) {
  const [formData, setFormData] = useState<CreateLeadSearchData>({
    search_name: "",
    industry: [],
    location: [],
    company_size: "medium",
    keywords: [],
    leads_target: 50,
  });
  const [keywordInput, setKeywordInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      search_name: "",
      industry: [],
      location: [],
      company_size: "medium",
      keywords: [],
      leads_target: 50,
    });
  };

  const toggleIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industry: prev.industry?.includes(industry)
        ? prev.industry.filter(i => i !== industry)
        : [...(prev.industry || []), industry],
    }));
  };

  const toggleLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location: prev.location?.includes(location)
        ? prev.location.filter(l => l !== location)
        : [...(prev.location || []), location],
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords?.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords?.filter(k => k !== keyword),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skapa ny lead-sökning</DialogTitle>
          <DialogDescription>
            Definiera kriterierna för de leads du vill hitta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search_name">Söknamn</Label>
            <Input
              id="search_name"
              placeholder="T.ex. Tech startups i Stockholm"
              value={formData.search_name}
              onChange={(e) => setFormData(prev => ({ ...prev, search_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Bransch</Label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <Badge
                  key={industry}
                  variant={formData.industry?.includes(industry) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Plats</Label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((location) => (
                <Badge
                  key={location}
                  variant={formData.location?.includes(location) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleLocation(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Företagsstorlek</Label>
            <div className="flex gap-2">
              {COMPANY_SIZES.map((size) => (
                <Badge
                  key={size.value}
                  variant={formData.company_size === size.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFormData(prev => ({ ...prev, company_size: size.value }))}
                >
                  {size.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Nyckelord</Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                placeholder="Lägg till nyckelord"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button type="button" onClick={addKeyword}>Lägg till</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.keywords?.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Antal leads önskat: {formData.leads_target}</Label>
            <Slider
              value={[formData.leads_target || 50]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, leads_target: value }))}
              min={10}
              max={500}
              step={10}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Skapar..." : "Skapa sökning"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}