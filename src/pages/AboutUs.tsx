import { Header } from "@/components/Header";
import { Users, Target, Award, Heart, Shield } from "lucide-react";
const AboutUs = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-gradient-hero">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Om{" "}
                <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                  Hiems
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                Vi revolutionerar hur företag säkerställer kvalitet och utvecklar sina säljteam genom AI-driven analys.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Vår mission
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Att ge företag verktyg för att säkerställa regelefterlevnad och maximera säljpotential genom intelligent samtalsanalys.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Varför Hiems?</h3>
                  <p className="mt-4 text-muted-foreground">Med ökande krav på regelefterlevnad behöver företag säkerställa att varje kundkontakt följer de lagar och riktlinjer som finns. Samtidigt vill de utveckla sina säljares förmågor. Vi kombinerar dessa behov i en lösning som både skyddar och utvecklar. Vår AI-teknologi analyserar samtalen i och ger både compliance-rapporter och personaliserade utvecklingsrekommendationer för säljteamet.</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Våra värderingar</h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start">
                      <Shield className="h-6 w-6 text-primary mt-1" />
                      <div className="ml-3">
                        <h4 className="font-semibold text-foreground">Integritet</h4>
                        <p className="text-sm text-muted-foreground">Dataskydd och sekretess i fokus</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Target className="h-6 w-6 text-primary mt-1" />
                      <div className="ml-3">
                        <h4 className="font-semibold text-foreground">Precision</h4>
                        <p className="text-sm text-muted-foreground">Exakt analys och pålitliga resultat</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Heart className="h-6 w-6 text-primary mt-1" />
                      <div className="ml-3">
                        <h4 className="font-semibold text-foreground">Utveckling</h4>
                        <p className="text-sm text-muted-foreground">Hjälpa säljare att nå sin fulla potential</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Vårt team
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Experter inom AI, compliance och säljutveckling som arbetar för att göra ditt säljteam framgångsrikt.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="rounded-lg bg-card p-8 shadow-card text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">AI-specialister</h3>
                  <p className="mt-2 text-muted-foreground">
                    Utvecklar och förbättrar våra algoritmer för exakt samtalsanalys
                  </p>
                </div>
                
                <div className="rounded-lg bg-card p-8 shadow-card text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Compliance-experter</h3>
                  <p className="mt-2 text-muted-foreground">
                    Säkerställer att våra kontroller följer alla branschstandarder
                  </p>
                </div>
                
                <div className="rounded-lg bg-card p-8 shadow-card text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Säljcoacher</h3>
                  <p className="mt-2 text-muted-foreground">
                    Utformar utvecklingsstrategier baserade på samtalsdata
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>;
};
export default AboutUs;