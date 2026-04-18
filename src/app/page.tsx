import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { EarnCoins } from "@/components/landing/EarnCoins";
import { CTA } from "@/components/landing/CTA";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <EarnCoins />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
