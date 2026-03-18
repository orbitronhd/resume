import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
      </main>
    </div>
  );
};

export default Index;
