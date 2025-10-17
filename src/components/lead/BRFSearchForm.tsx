import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface BRFSearchFormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function BRFSearchForm({ onSubmit, isSubmitting }: BRFSearchFormProps) {
  const [formData, setFormData] = useState({
    search_name: "",
    industry: [] as string[],
    location: [] as string[],
    company_size: "",
    apartment_range: "",
    construction_year_range: "",
    monthly_fee_range: "",
    keywords: [] as string[],
    leads_target: 50,
  });

  const [keywordInput, setKeywordInput] = useState("");

  const brfIndustries = [
    "Fastighetsskötsel",
    "El & VVS",
    "Renovering & Bygg",
    "Teknisk förvaltning",
    "Juridik & Konsulter",
    "Försäkring",
    "Energioptimering",
    "Hiss & Ventilation"
  ];

  const locations = ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping", "Örebro"];

  const apartmentRanges = [
    { label: "Små (1-50 lgh)", value: "1-50" },
    { label: "Medelstora (51-150 lgh)", value: "51-150" },
    { label: "Stora (150+ lgh)", value: "150+" },
  ];

  const toggleIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industry: prev.industry.includes(industry)
        ? prev.industry.filter(i => i !== industry)
        : [...prev.industry, industry]
    }));
  };

  const toggleLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location: prev.location.includes(location)
        ? prev.location.filter(l => l !== location)
        : [...prev.location, location]
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      lead_type: 'brf'
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search_name">Sökningens namn</Label>
        <Input
          id="search_name"
          placeholder="T.ex. BRF Stockholm City"
          value={formData.search_name}
          onChange={(e) => setFormData({ ...formData, search_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Bransch</Label>
        <div className="flex flex-wrap gap-2">
          {brfIndustries.map((industry) => (
            <Badge
              key={industry}
              variant={formData.industry.includes(industry) ? "default" : "outline"}
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
          {locations.map((location) => (
            <Badge
              key={location}
              variant={formData.location.includes(location) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleLocation(location)}
            >
              {location}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Föreningsstorlek (antal lägenheter)</Label>
        <div className="flex flex-wrap gap-2">
          {apartmentRanges.map((range) => (
            <Badge
              key={range.value}
              variant={formData.apartment_range === range.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFormData({ ...formData, apartment_range: range.value })}
            >
              {range.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Byggnadsår (valfritt)</Label>
        <Input
          placeholder="T.ex. 1950-2000"
          value={formData.construction_year_range}
          onChange={(e) => setFormData({ ...formData, construction_year_range: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Årsavgift, kr/mån (valfritt)</Label>
        <Input
          placeholder="T.ex. 3000-6000"
          value={formData.monthly_fee_range}
          onChange={(e) => setFormData({ ...formData, monthly_fee_range: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Nyckelord</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Lägg till nyckelord..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
          />
          <Button type="button" onClick={addKeyword}>Lägg till</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="gap-1">
              {keyword}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeKeyword(keyword)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Antal leads: {formData.leads_target}</Label>
        <Slider
          value={[formData.leads_target]}
          onValueChange={([value]) => setFormData({ ...formData, leads_target: value })}
          min={10}
          max={200}
          step={10}
        />
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isSubmitting || !formData.search_name}
      >
        {isSubmitting ? "Skapar..." : "Skapa sökning"}
      </Button>
    </div>
  );
}
