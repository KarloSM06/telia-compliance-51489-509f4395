import { Header } from "@/components/Header";
import { Sparkles, Users, Lightbulb, Rocket, TrendingUp, Shield } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <Header />
      <main className="pt-16 relative">
        {/* Hero Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Om{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Hiems
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/90">
                Hiems är ett svenskt teknikföretag som specialiserar sig på AI-driven automation för företag som vill ligga steget före.
              </p>
              <p className="mt-4 text-base leading-7 text-white/80">
                Vi skapar skräddarsydda intelligenta lösningar som gör din verksamhet snabbare, smartare och framför allt mer lönsam.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Varje företag är unikt – därför ska även er AI vara det
              </h2>
              <p className="mt-6 text-lg text-white/80">
                Vi bygger inte generiska system, utan lösningar som är exakt anpassade efter era mål, processer och utmaningar.
              </p>
              <p className="mt-4 text-base text-white/70">
                Med datadrivna insikter, modern teknologi och affärsförståelse hjälper vi företag att ta klivet in i framtidens digitala arbetsflöden.
              </p>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-20 bg-gradient-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Din strategiska partner
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Vi levererar inte bara AI – vi blir er strategiska partner genom hela resan.
              </p>
            </div>
            
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Behovsanalys</h3>
                  <p className="mt-2 text-white/70">
                    Vi börjar med att förstå era utmaningar och mål för att skapa den perfekta lösningen.
                  </p>
                </div>
                
                <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Utveckling & Implementering</h3>
                  <p className="mt-2 text-white/70">
                    Från utveckling till sömlös integration i era befintliga system.
                  </p>
                </div>
                
                <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Uppföljning</h3>
                  <p className="mt-2 text-white/70">
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
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Lösningar för alla branscher
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Våra lösningar används redan i flera branscher – från restauranger och frisörer till rekrytering, försäljning och kundtjänst.
              </p>
            </div>
            
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Färdiga paket</h3>
                  <p className="mt-2 text-white/70">
                    Företag kan snabbt komma igång med automatisering utan långa projekt eller tekniska hinder. Perfekt för att testa AI i verksamheten.
                  </p>
                </div>
                
                <div className="rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Skräddarsydda lösningar</h3>
                  <p className="mt-2 text-white/70">
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
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Effektivitet, innovation och partnerskap
              </h2>
              <p className="mt-6 text-lg text-white/80">
                Vi tror att framtidens företag inte bara använder AI – de samarbetar med den.
              </p>
              <p className="mt-4 text-base text-white/70">
                Tillsammans skapar vi nästa generations arbetsflöden, där teknik frigör tid, ökar lönsamhet och stärker konkurrenskraften.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Effektivitet</h3>
                  <p className="mt-2 text-white/70">
                    Frigör tid genom intelligent automation
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Innovation</h3>
                  <p className="mt-2 text-white/70">
                    Ligger steget före med modern AI-teknik
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">Partnerskap</h3>
                  <p className="mt-2 text-white/70">
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