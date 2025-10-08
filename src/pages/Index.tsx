import { Header } from "@/components/Header";
import { ProductSelection } from "@/components/ProductSelection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductSelection />
      </main>
    </div>
  );
};

export default Index;
