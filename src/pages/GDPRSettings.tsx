import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Trash2, FileText, AlertCircle } from "lucide-react";

const GDPRSettings = () => {
  const features = [
    {
      icon: Shield,
      title: "Dataskydd",
      description: "Vi följer GDPR-reglerna och skyddar dina personuppgifter enligt lag."
    },
    {
      icon: Lock,
      title: "Säker lagring",
      description: "All data krypteras och lagras säkert i enlighet med branschstandarder."
    },
    {
      icon: Eye,
      title: "Transparens",
      description: "Du har alltid rätt att veta vilken data vi samlar in och hur den används."
    },
    {
      icon: Trash2,
      title: "Radera data",
      description: "Du kan när som helst begära att få din personliga data raderad."
    },
    {
      icon: FileText,
      title: "Dataportabilitet",
      description: "Du kan exportera och flytta din data till andra tjänster."
    },
    {
      icon: AlertCircle,
      title: "Incidenthantering",
      description: "Vid eventuella säkerhetsincidenter meddelar vi dig omedelbart."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header1 />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">GDPR & Dataskydd</h1>
              <p className="text-xl text-muted-foreground">
                Ditt integritetsskydd är vår högsta prioritet
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dina rättigheter enligt GDPR</CardTitle>
                <CardDescription>
                  Du har följande rättigheter när det gäller din personliga data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h3 className="font-semibold">Rätt till tillgång</h3>
                      <p className="text-sm text-muted-foreground">Du har rätt att få en kopia av all data vi har om dig.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h3 className="font-semibold">Rätt till rättelse</h3>
                      <p className="text-sm text-muted-foreground">Du kan begära att felaktig eller ofullständig data rättas.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h3 className="font-semibold">Rätt till radering</h3>
                      <p className="text-sm text-muted-foreground">Du kan begära att din personliga data raderas ("rätten att bli glömd").</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h3 className="font-semibold">Rätt till dataportabilitet</h3>
                      <p className="text-sm text-muted-foreground">Du kan exportera din data i ett strukturerat, maskinläsbart format.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">5</div>
                    <div>
                      <h3 className="font-semibold">Rätt att invända</h3>
                      <p className="text-sm text-muted-foreground">Du kan invända mot viss behandling av din personliga data.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Behöver du hjälp med dina GDPR-rättigheter?</strong><br />
                    Kontakta oss på <a href="mailto:gdpr@hiems.se" className="text-primary hover:underline">gdpr@hiems.se</a> eller ring <a href="tel:+46706571532" className="text-primary hover:underline">070-657 15 32</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GDPRSettings;
