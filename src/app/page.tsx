export const revalidate = 0;

import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import DemoPreview from "@/components/landing/DemoPreview";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main dir="rtl">
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <DemoPreview />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
