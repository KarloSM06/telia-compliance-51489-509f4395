import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WebGLShader } from "@/components/ui/webgl-shader";
import { Calendar as CalendarIcon, Clock, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const timeSlots = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
];

export function BookingSection() {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime) {
      toast.error("Välj datum och tid för mötet");
      return;
    }

    if (!formData.name || !formData.email) {
      toast.error("Vänligen fyll i namn och e-post");
      return;
    }

    toast.success("Bokningsförfrågan skickad! Vi återkommer inom kort.");
    
    // Reset form
    setDate(undefined);
    setSelectedTime(undefined);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: ""
    });
  };

  return (
    <section className="relative py-24 overflow-hidden" id="boka-demo">
      {/* WebGL Background Animation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <WebGLShader />
      </div>
      {/* White overlay behind cards */}
      <div className="absolute inset-0 z-[1] bg-background" aria-hidden="true" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Boka ett kostnadsfritt möte
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Låt oss visa dig hur AI kan transformera din verksamhet. Välj en tid som passar dig.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Calendar Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Välj datum och tid</h3>
                  <p className="text-sm text-muted-foreground">
                    {date ? format(date, "PPP", { locale: sv }) : "Inget datum valt"}
                  </p>
                </div>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className={cn("rounded-xl border border-border/50 p-4 pointer-events-auto")}
              />

              {date && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <Label className="text-base font-semibold">Välj tid</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Dina uppgifter</h3>
                  <p className="text-sm text-muted-foreground">Fyll i dina kontaktuppgifter</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Namn *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ditt fullständiga namn"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-post *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="din@email.se"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+46 70 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Företag</Label>
                  <Input
                    id="company"
                    placeholder="Ditt företagsnamn"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Meddelande</Label>
                  <Textarea
                    id="message"
                    placeholder="Berätta lite om dina behov och utmaningar..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full font-bold text-lg py-6"
                  size="lg"
                >
                  Skicka bokningsförfrågan
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
