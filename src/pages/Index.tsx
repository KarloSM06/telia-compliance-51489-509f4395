import { Header1 } from "@/components/ui/header";
import { ProductSelection } from "@/components/ProductSelection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      <main>
        <ProductSelection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
