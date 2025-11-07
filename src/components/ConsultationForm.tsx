import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface ConsultationFormProps {
  showAsModal?: boolean;
  onSuccess?: () => void;
}

export function ConsultationForm({ showAsModal = false, onSuccess }: ConsultationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Section 1: Company info
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");

  // Section 2: Goals & Vision
  const [aiGoals, setAiGoals] = useState<string[]>([]);
  const [aiGoalsOther, setAiGoalsOther] = useState("");
  const [successDefinition, setSuccessDefinition] = useState("");
  const [aiPriority, setAiPriority] = useState([3]);

  // Section 3: Current situation
  const [manualProcesses, setManualProcesses] = useState("");
  const [existingAI, setExistingAI] = useState("");
  const [currentSystems, setCurrentSystems] = useState("");

  // Section 4: Data
  const [dataTypes, setDataTypes] = useState<string[]>([]);
  const [dataTypesOther, setDataTypesOther] = useState("");
  const [historicalData, setHistoricalData] = useState("");
  const [dataQuality, setDataQuality] = useState([3]);
  const [gdprCompliant, setGdprCompliant] = useState("");

  // Section 5: Resources & Budget
  const [internalResources, setInternalResources] = useState<string[]>([]);
  const [internalResourcesOther, setInternalResourcesOther] = useState("");
  const [budget, setBudget] = useState("");
  const [timeframe, setTimeframe] = useState("");

  // Section 6: Users & Operations
  const [aiUsers, setAiUsers] = useState<string[]>([]);
  const [aiUsersOther, setAiUsersOther] = useState("");
  const [trainingNeeded, setTrainingNeeded] = useState("");

  // Section 7: Risks & Limitations
  const [regulatoryRequirements, setRegulatoryRequirements] = useState("");
  const [sensitiveData, setSensitiveData] = useState("");
  const [ethicalLimitations, setEthicalLimitations] = useState("");

  // Section 8: Future Vision
  const [longTermGoals, setLongTermGoals] = useState("");
  const [openToExperiments, setOpenToExperiments] = useState("");

  const totalSteps = 8;

  const handleCheckboxChange = (value: string, currentValues: string[], setter: (values: string[]) => void) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter(v => v !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!companyName || !contactPerson || !email || !phone || !businessDescription) {
          toast({
            title: "Fyll i alla obligatoriska fält",
            description: "Alla fält i denna sektion krävs.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (aiGoals.length === 0 || !successDefinition) {
          toast({
            title: "Fyll i alla obligatoriska fält",
            description: "Välj minst ett mål och definiera framgång.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Prepare extra_info with all detailed fields
      const extraInfo = {
        company_name: companyName,
        ai_goals: aiGoals,
        ai_goals_other: aiGoalsOther,
        success_definition: successDefinition,
        ai_priority: aiPriority[0],
        manual_processes: manualProcesses,
        existing_ai: existingAI,
        current_systems: currentSystems,
        data_types: dataTypes,
        data_types_other: dataTypesOther,
        historical_data: historicalData,
        data_quality: dataQuality[0],
        gdpr_compliant: gdprCompliant,
        internal_resources: internalResources,
        internal_resources_other: internalResourcesOther,
        budget,
        timeframe,
        ai_users: aiUsers,
        ai_users_other: aiUsersOther,
        training_needed: trainingNeeded,
        regulatory_requirements: regulatoryRequirements,
        sensitive_data: sensitiveData,
        ethical_limitations: ethicalLimitations,
        long_term_goals: longTermGoals,
        open_to_experiments: openToExperiments,
      };

      const { error } = await supabase
        .from('bookings')
        .insert({
          kundnamn: contactPerson,
          epost: email,
          telefonnummer: phone,
          info: businessDescription,
          bokningstyp: 'ai_consultation_detailed',
          source: 'ai_consultation_detailed',
          status: 'pending',
          extra_info: JSON.stringify(extraInfo),
        });

      if (error) throw error;

      toast({
        title: "Tack för din ansökan!",
        description: "Vi kontaktar dig inom kort för att boka in konsultationen.",
      });

      // Reset form
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setBusinessDescription("");
      setAiGoals([]);
      setAiGoalsOther("");
      setSuccessDefinition("");
      setAiPriority([3]);
      setManualProcesses("");
      setExistingAI("");
      setCurrentSystems("");
      setDataTypes([]);
      setDataTypesOther("");
      setHistoricalData("");
      setDataQuality([3]);
      setGdprCompliant("");
      setInternalResources([]);
      setInternalResourcesOther("");
      setBudget("");
      setTimeframe("");
      setAiUsers([]);
      setAiUsersOther("");
      setTrainingNeeded("");
      setRegulatoryRequirements("");
      setSensitiveData("");
      setEthicalLimitations("");
      setLongTermGoals("");
      setOpenToExperiments("");
      setCurrentStep(1);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skicka formuläret. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Om företaget</h3>
            <div className="space-y-2">
              <Label htmlFor="company">Företagsnamn *</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ditt företag AB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Kontaktperson & roll *</Label>
              <Input
                id="contact"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Anna Andersson, VD"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anna@foretag.se"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="070-123 45 67"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Kort beskrivning av verksamheten *</Label>
              <Textarea
                id="description"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Beskriv er verksamhet..."
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Mål & vision</h3>
            <div className="space-y-2">
              <Label>Vad vill ni uppnå med AI? *</Label>
              <div className="space-y-2">
                {['Effektivisera processer', 'Öka försäljning', 'Automatisera kundsupport', 'Förbättra beslutsfattande', 'Innovation/nya produkter'].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      checked={aiGoals.includes(goal)}
                      onCheckedChange={() => handleCheckboxChange(goal, aiGoals, setAiGoals)}
                    />
                    <label className="text-sm">{goal}</label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={aiGoals.includes('Annat')}
                    onCheckedChange={() => handleCheckboxChange('Annat', aiGoals, setAiGoals)}
                  />
                  <Input
                    placeholder="Annat..."
                    value={aiGoalsOther}
                    onChange={(e) => setAiGoalsOther(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="success">Hur definierar ni framgång med AI? *</Label>
              <Textarea
                id="success"
                value={successDefinition}
                onChange={(e) => setSuccessDefinition(e.target.value)}
                placeholder="Beskriv hur ni mäter framgång..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Prioritet på AI-initiativet just nu: {aiPriority[0]}</Label>
              <Slider
                value={aiPriority}
                onValueChange={setAiPriority}
                min={1}
                max={5}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Låg</span>
                <span>Hög</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Nuvarande situation</h3>
            <div className="space-y-2">
              <Label htmlFor="manual">Vilka processer är idag manuella eller tidskrävande?</Label>
              <Textarea
                id="manual"
                value={manualProcesses}
                onChange={(e) => setManualProcesses(e.target.value)}
                placeholder="Beskriv manuella processer..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Har ni redan någon AI-lösning eller analysverktyg i bruk?</Label>
              <RadioGroup value={existingAI} onValueChange={setExistingAI}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ja" id="ai-yes" />
                  <Label htmlFor="ai-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nej" id="ai-no" />
                  <Label htmlFor="ai-no">Nej</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delvis" id="ai-partial" />
                  <Label htmlFor="ai-partial">Delvis</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systems">Vilka system använder ni idag?</Label>
              <Input
                id="systems"
                value={currentSystems}
                onChange={(e) => setCurrentSystems(e.target.value)}
                placeholder="ERP, CRM, dataplattformar..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Data</h3>
            <div className="space-y-2">
              <Label>Vilken typ av data har ni?</Label>
              <div className="space-y-2">
                {['Strukturerad (tabeller, databaser)', 'Ostrukturerad (text, dokument)', 'Bild', 'Video', 'Ljud'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      checked={dataTypes.includes(type)}
                      onCheckedChange={() => handleCheckboxChange(type, dataTypes, setDataTypes)}
                    />
                    <label className="text-sm">{type}</label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={dataTypes.includes('Annat')}
                    onCheckedChange={() => handleCheckboxChange('Annat', dataTypes, setDataTypes)}
                  />
                  <Input
                    placeholder="Annat..."
                    value={dataTypesOther}
                    onChange={(e) => setDataTypesOther(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="historical">Hur mycket historisk data finns tillgänglig?</Label>
              <Input
                id="historical"
                value={historicalData}
                onChange={(e) => setHistoricalData(e.target.value)}
                placeholder="t.ex. 5 år, 1000 GB..."
              />
            </div>
            <div className="space-y-2">
              <Label>Datakvalitet: {dataQuality[0]}</Label>
              <Slider
                value={dataQuality}
                onValueChange={setDataQuality}
                min={1}
                max={5}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Låg</span>
                <span>Hög</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Är all data laglig att använda enligt GDPR?</Label>
              <RadioGroup value={gdprCompliant} onValueChange={setGdprCompliant}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ja" id="gdpr-yes" />
                  <Label htmlFor="gdpr-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nej" id="gdpr-no" />
                  <Label htmlFor="gdpr-no">Nej</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="osaker" id="gdpr-unsure" />
                  <Label htmlFor="gdpr-unsure">Osäker</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Resurser & budget</h3>
            <div className="space-y-2">
              <Label>Vilka interna resurser finns för AI-projekt?</Label>
              <div className="space-y-2">
                {['IT-avdelning', 'Dataanalytiker', 'Utvecklare', 'Projektledare'].map((resource) => (
                  <div key={resource} className="flex items-center space-x-2">
                    <Checkbox
                      checked={internalResources.includes(resource)}
                      onCheckedChange={() => handleCheckboxChange(resource, internalResources, setInternalResources)}
                    />
                    <label className="text-sm">{resource}</label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={internalResources.includes('Annat')}
                    onCheckedChange={() => handleCheckboxChange('Annat', internalResources, setInternalResources)}
                  />
                  <Input
                    placeholder="Annat..."
                    value={internalResourcesOther}
                    onChange={(e) => setInternalResourcesOther(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Hur stor budget finns avsatt för AI-initiativet?</Label>
              <Input
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="t.ex. 500 000 kr, 1-5 miljoner kr..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Önskad tidsram för projektet?</Label>
              <Input
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="t.ex. 6 månader, 1 år..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Användare och verksamhet</h3>
            <div className="space-y-2">
              <Label>Vem kommer använda AI-lösningen?</Label>
              <div className="space-y-2">
                {['Intern personal', 'Kunder', 'Partner/försäljare'].map((user) => (
                  <div key={user} className="flex items-center space-x-2">
                    <Checkbox
                      checked={aiUsers.includes(user)}
                      onCheckedChange={() => handleCheckboxChange(user, aiUsers, setAiUsers)}
                    />
                    <label className="text-sm">{user}</label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={aiUsers.includes('Annat')}
                    onCheckedChange={() => handleCheckboxChange('Annat', aiUsers, setAiUsers)}
                  />
                  <Input
                    placeholder="Annat..."
                    value={aiUsersOther}
                    onChange={(e) => setAiUsersOther(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Finns behov av träning eller support för användarna?</Label>
              <RadioGroup value={trainingNeeded} onValueChange={setTrainingNeeded}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ja" id="training-yes" />
                  <Label htmlFor="training-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nej" id="training-no" />
                  <Label htmlFor="training-no">Nej</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="osaker" id="training-unsure" />
                  <Label htmlFor="training-unsure">Osäker</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Risker & begränsningar</h3>
            <div className="space-y-2">
              <Label htmlFor="regulatory">Finns regulatoriska krav att ta hänsyn till?</Label>
              <Input
                id="regulatory"
                value={regulatoryRequirements}
                onChange={(e) => setRegulatoryRequirements(e.target.value)}
                placeholder="t.ex. GDPR, branschspecifika regler..."
              />
            </div>
            <div className="space-y-2">
              <Label>Är data känslig eller konfidentiell?</Label>
              <RadioGroup value={sensitiveData} onValueChange={setSensitiveData}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ja" id="sensitive-yes" />
                  <Label htmlFor="sensitive-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nej" id="sensitive-no" />
                  <Label htmlFor="sensitive-no">Nej</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="osaker" id="sensitive-unsure" />
                  <Label htmlFor="sensitive-unsure">Osäker</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ethical">Finns etiska eller andra begränsningar för AI-användning?</Label>
              <Textarea
                id="ethical"
                value={ethicalLimitations}
                onChange={(e) => setEthicalLimitations(e.target.value)}
                placeholder="Beskriv eventuella begränsningar..."
                rows={3}
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Framtidsvision</h3>
            <div className="space-y-2">
              <Label htmlFor="longterm">Långsiktiga mål med AI:</Label>
              <Textarea
                id="longterm"
                value={longTermGoals}
                onChange={(e) => setLongTermGoals(e.target.value)}
                placeholder="Beskriv era långsiktiga mål..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Är ni öppna för experiment och innovativa AI-lösningar?</Label>
              <RadioGroup value={openToExperiments} onValueChange={setOpenToExperiments}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ja" id="experiment-yes" />
                  <Label htmlFor="experiment-yes">Ja, gärna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nej" id="experiment-no" />
                  <Label htmlFor="experiment-no">Nej, vi vill hålla oss till beprövad teknik</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="osaker" id="experiment-unsure" />
                  <Label htmlFor="experiment-unsure">Osäker</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={showAsModal ? "" : "bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12 shadow-xl"}>
      {!showAsModal && (
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-gold transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              Steg {currentStep} av {totalSteps}
            </span>
          </div>
        </div>
      )}
      
      <div className={showAsModal ? "" : "mb-8"}>
        {renderStep()}
      </div>

      <div className="flex justify-between gap-4 pt-6 border-t">
        <Button
          onClick={handleBack}
          disabled={currentStep === 1}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Tillbaka
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            className="bg-gradient-gold hover:shadow-glow transition-all duration-300"
          >
            Nästa
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-gold hover:shadow-glow transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Skickar...
              </>
            ) : (
              'Skicka ansökan'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
