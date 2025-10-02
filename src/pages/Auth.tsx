import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Snowflake, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Snowflake className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Hiems</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till startsidan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Välkommen</CardTitle>
            <CardDescription>
              Logga in eller skapa ett konto för att komma igång
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Logga in</TabsTrigger>
                <TabsTrigger value="signup">Skapa konto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-postadress</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="din@epost.se"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Lösenord</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Ditt lösenord"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Loggar in..." : "Logga in"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-postadress</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="din@epost.se"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Lösenord</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Välj ett säkert lösenord"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="gdpr-consent" 
                      checked={gdprConsent}
                      onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                    />
                    <Label htmlFor="gdpr-consent" className="text-sm leading-tight cursor-pointer">
                      Jag godkänner att Hiems behandlar mina personuppgifter enligt GDPR. 
                      Data krypteras och lagras säkert.
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !gdprConsent}
                  >
                    {loading ? "Skapar konto..." : "Skapa konto"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;