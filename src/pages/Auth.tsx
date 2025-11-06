import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    name: "Anna Lindström",
    role: "Compliance Manager, TechCorp",
    text: "Hiems har revolutionerat vår säkerhetsöversikt. Allt på ett ställe, enkelt och kraftfullt."
  },
  {
    avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    name: "Erik Johansson",
    role: "CISO, SecureNet AB",
    text: "Äntligen en plattform som förstår compliance. Sparat oss hundratals timmar."
  },
  {
    avatarSrc: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    name: "Maria Svensson",
    role: "IT-chef, DataSecure",
    text: "Oumbärligt verktyg för vår organisation. Rekommenderas varmt till alla som tar säkerhet på allvar."
  },
];

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isSignUp) {
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
    } else {
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
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Google inloggning",
      description: "Google OAuth kommer snart!",
    });
  };

  const handleResetPassword = () => {
    toast({
      title: "Återställ lösenord",
      description: "Återställningsfunktion kommer snart!",
    });
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setGdprConsent(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Tillbaka</span>
      </button>

      <SignInPage
        title={
          <div className="flex items-center gap-3">
            <img src={hiems_logo} alt="Hiems" className="h-10 w-10" />
            <span className="font-display">Hiems</span>
          </div>
        }
        description={
          isSignUp
            ? "Skapa ditt konto och få full kontroll över er säkerhetsefterlevnad"
            : "Välkommen tillbaka till din säkerhetsöversikt"
        }
        heroImageSrc="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2160&q=80"
        testimonials={testimonials}
        onSignIn={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleToggleMode}
        showGdprConsent={isSignUp}
        gdprConsent={gdprConsent}
        onGdprConsentChange={setGdprConsent}
        isSignUp={isSignUp}
        loading={loading}
      />
    </div>
  );
};

export default Auth;