import { Header } from "@/components/Header";
import { Sparkles, Users, Lightbulb, Rocket, TrendingUp, Shield } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
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
                Hiems är ett svenskt teknikföretag som specialiserar sig på AI-driven automation för företag som vill ligga steget före.
              </p>
              <p className="mt-4 text-base leading-7 text-blue-200">
                Vi skapar skräddarsydda intelligenta lösningar som gör din verksamhet snabbare, smartare och framför allt mer lönsam.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Varje företag är unikt – därför ska även er AI vara det
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Vi bygger inte generiska system, utan lösningar som är exakt anpassade efter era mål, processer och utmaningar.
              </p>
              <p className="mt-4 text-base text-muted-foreground">
                Med datadrivna insikter, modern teknologi och affärsförståelse hjälper vi företag att ta klivet in i framtidens digitala arbetsflöden.
              </p>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-20 bg-gradient-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Din strategiska partner
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Vi levererar inte bara AI – vi blir er strategiska partner genom hela resan.
              </p>
            </div>
            
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="rounded-lg bg-card p-8 shadow-card">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Behovsanalys</h3>
                  <p className="mt-2 text-muted-foreground">
                    Vi börjar med att förstå era utmaningar och mål för att skapa den perfekta lösningen.
                  </p>
                </div>
                
                <div className="rounded-lg bg-card p-8 shadow-card">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Utveckling & Implementering</h3>
                  <p className="mt-2 text-muted-foreground">
                    Från utveckling till sömlös integration i era befintliga system.
                  </p>
                </div>
                
                <div className="rounded-lg bg-card p-8 shadow-card">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Uppföljning</h3>
                  <p className="mt-2 text-muted-foreground">
                    Vi säkerställer att lösningen fortsätter skapa värde över tid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Lösningar för alla branscher
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Våra lösningar används redan i flera branscher – från restauranger och frisörer till rekrytering, försäljning och kundtjänst.
              </p>
            </div>
            
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-lg bg-gradient-card p-8 shadow-card">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Färdiga paket</h3>
                  <p className="mt-2 text-muted-foreground">
                    Företag kan snabbt komma igång med automatisering utan långa projekt eller tekniska hinder. Perfekt för att testa AI i verksamheten.
                  </p>
                </div>
                
                <div className="rounded-lg bg-gradient-card p-8 shadow-card">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Skräddarsydda lösningar</h3>
                  <p className="mt-2 text-muted-foreground">
                    För de som vill gå längre utvecklar vi helt skräddarsydda AI-system som växer med verksamheten och möter specifika behov.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Effektivitet, innovation och partnerskap
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Vi tror att framtidens företag inte bara använder AI – de samarbetar med den.
              </p>
              <p className="mt-4 text-base text-muted-foreground">
                Tillsammans skapar vi nästa generations arbetsflöden, där teknik frigör tid, ökar lönsamhet och stärker konkurrenskraften.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Effektivitet</h3>
                  <p className="mt-2 text-muted-foreground">
                    Frigör tid genom intelligent automation
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Innovation</h3>
                  <p className="mt-2 text-muted-foreground">
                    Ligger steget före med modern AI-teknik
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">Partnerskap</h3>
                  <p className="mt-2 text-muted-foreground">
                    Din strategiska partner för långsiktig framgång
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default AboutUs;