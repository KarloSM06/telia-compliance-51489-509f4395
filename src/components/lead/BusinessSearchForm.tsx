import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface BusinessSearchFormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function BusinessSearchForm({ onSubmit, isSubmitting }: BusinessSearchFormProps) {
  const [formData, setFormData] = useState({
    search_name: "",
    industry: [] as string[],
    location: [] as string[],
    company_size: "",
    employee_range: "",
    keywords: [] as string[],
    leads_target: 50,
  });

  const [keywordInput, setKeywordInput] = useState("");

  const businessIndustries = [
    "Tech & IT",
    "Finans & Bank",
    "Handel & E-commerce",
    "Hälsa & Vård",
    "Tillverkning",
    "Bygg & Anläggning",
    "Utbildning",
    "Transport & Logistik",
    "Konsulttjänster",
    "Hotell & Restaurang"
  ];

  const locations = ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping", "Örebro"];

  const companySizes = [
    { label: "Startup (1-10)", value: "1-10" },
    { label: "Små (11-50)", value: "11-50" },
    { label: "Medelstora (51-250)", value: "51-250" },
    { label: "Stora (250+)", value: "250+" },
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
      lead_type: 'business'
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search_name">Sökningens namn</Label>
        <Input
          id="search_name"
          placeholder="T.ex. Tech-företag Stockholm"
          value={formData.search_name}
          onChange={(e) => setFormData({ ...formData, search_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Bransch</Label>
        <div className="flex flex-wrap gap-2">
          {businessIndustries.map((industry) => (
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
        <Label>Företagsstorlek (antal anställda)</Label>
        <div className="flex flex-wrap gap-2">
          {companySizes.map((size) => (
            <Badge
              key={size.value}
              variant={formData.employee_range === size.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFormData({ ...formData, employee_range: size.value })}
            >
              {size.label}
            </Badge>
          ))}
        </div>
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
