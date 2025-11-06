import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gdprConsent) {
      toast({
        title: "GDPR-samtycke krävs",
        description: "Du måste godkänna databehandlingen för att skapa ett konto.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Användaren finns redan",
          description: "Ett konto med denna e-postadress finns redan. Försök logga in istället.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fel vid registrering",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Update profile with GDPR consent
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ 
            gdpr_consent: true,
            gdpr_consent_date: new Date().toISOString()
          })
          .eq('id', data.user.id);
      }
      
      toast({
        title: "Kontrollera din e-post",
        description: "Vi har skickat en bekräftelselänk till din e-postadress.",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Fel vid inloggning",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await handleSignUp(e);
    } else {
      await handleSignIn(e);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row w-full overflow-hidden">
      {/* Left: Auth Form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Tillbaka</span>
        </button>

        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 animate-fade-in">
              <img src={hiems_logo} alt="Hiems" className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
                Hiems
              </h1>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? "Skapa ditt konto för att komma igång" 
                  : "Välkommen tillbaka till din säkerhetsöversikt"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Label className="text-sm font-medium text-muted-foreground">
                  E-postadress
                </Label>
                <div className="mt-1.5 rounded-2xl border border-border bg-background/50 backdrop-blur-sm transition-all focus-within:border-primary/50 focus-within:bg-primary/5">
                  <input
                    type="email"
                    placeholder="din@epost.se"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Label className="text-sm font-medium text-muted-foreground">
                  Lösenord
                </Label>
                <div className="mt-1.5 rounded-2xl border border-border bg-background/50 backdrop-blur-sm transition-all focus-within:border-primary/50 focus-within:bg-primary/5">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isSignUp ? "Välj ett säkert lösenord (min 6 tecken)" : "Ditt lösenord"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* GDPR Consent for Sign Up */}
              {isSignUp && (
                <div className="animate-fade-in flex items-start gap-3" style={{ animationDelay: '400ms' }}>
                  <Checkbox
                    id="gdpr"
                    checked={gdprConsent}
                    onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="gdpr"
                    className="text-sm text-muted-foreground leading-tight cursor-pointer"
                  >
                    Jag godkänner att Hiems behandlar mina personuppgifter enligt GDPR. 
                    Data krypteras och lagras säkert.
                  </Label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (isSignUp && !gdprConsent)}
                className="animate-fade-in w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-button"
                style={{ animationDelay: isSignUp ? '500ms' : '400ms' }}
              >
                {loading 
                  ? (isSignUp ? "Skapar konto..." : "Loggar in...") 
                  : (isSignUp ? "Skapa konto" : "Logga in")}
              </button>
            </form>

            {/* Toggle Sign In/Sign Up */}
            <p className="animate-fade-in text-center text-sm text-muted-foreground" style={{ animationDelay: '600ms' }}>
              {isSignUp ? "Har du redan ett konto? " : "Ny på Hiems? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setGdprConsent(false);
                }}
                className="text-primary hover:underline font-medium transition-colors"
              >
                {isSignUp ? "Logga in" : "Skapa konto"}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Right: Hero with gradient */}
      <section className="hidden md:flex flex-1 relative p-6 bg-gradient-hero overflow-hidden">
        <div 
          className="absolute inset-6 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Content overlay */}
          <div className="relative h-full flex flex-col justify-end p-12 text-primary-foreground">
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '800ms' }}>
              <h2 className="text-4xl font-display font-bold leading-tight">
                Komplett översikt av din<br />säkerhetsefterlevnad
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-md">
                Hantera säkerhet, efterlevnad och risker från en plattform. 
                Få kontroll över din organisations compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;