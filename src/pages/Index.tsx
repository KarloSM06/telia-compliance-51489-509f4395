import { Header } from "@/components/Header";
import { ProductSelection } from "@/components/ProductSelection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductSelection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
