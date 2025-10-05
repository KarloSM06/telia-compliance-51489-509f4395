import { Shield, Lock, Database, CheckCircle2 } from "lucide-react";

export const TrustSection = () => {
  const trustFeatures = [
    {
      icon: Shield,
      title: "GDPR & PII-säker",
      description: "All data krypteras och hanteras enligt GDPR. PII-data kan automatiskt maskeras.",
    },
    {
      icon: Lock,
      title: "Säker åtkomst",
      description: "Rollbaserad åtkomst, 2FA och fullständig loggning av alla användaraktiviteter.",
    },
    {
      icon: Database,
      title: "Backup & redundans",
      description: "Dagliga backups och redundanta system säkerställer att er data alltid är tillgänglig.",
    },
    {
      icon: CheckCircle2,
      title: "Certifierad säkerhet",
      description: "Vi följer branschstandard för kryptering (AES-256) och säker datalagring.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Säkerhet & tillit i fokus
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Vi tar säkerhet på allvar – era samtal och data är trygga hos oss
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-lg bg-card p-8 shadow-card">
            <h3 className="text-xl font-semibold text-foreground text-center mb-6">
              Tekniska säkerhetsåtgärder
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Kryptering</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AES-256 kryptering i vila</li>
                  <li>• TLS 1.3 för datatransfer</li>
                  <li>• End-to-end kryptering</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Åtkomstkontroll</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rollbaserad åtkomst (RBAC)</li>
                  <li>• Tvåfaktorsautentisering (2FA)</li>
                  <li>• Aktivitetsloggning</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Compliance</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• GDPR-kompatibel</li>
                  <li>• PII-maskering tillgänglig</li>
                  <li>• Dataportabilitet</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Backup</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Dagliga automatiska backups</li>
                  <li>• 30 dagars historik</li>
                  <li>• Redundanta datacenter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
