import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <FeatureCards />
      <Footer />
    </div>
  );
}
