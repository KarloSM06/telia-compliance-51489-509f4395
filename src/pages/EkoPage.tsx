import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EkoSection } from "@/components/dashboard/EkoSection";

const EkoPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Omdömen</h1>
          <p className="text-muted-foreground mt-2">
            Hantera och analysera kundrecensioner från alla plattformar
          </p>
        </div>
        <EkoSection />
      </div>
    </DashboardLayout>
  );
};

export default EkoPage;
