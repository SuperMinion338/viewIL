export const revalidate = 0;

import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import DemoPreview from "@/components/landing/DemoPreview";
import Testimonials from "@/components/landing/Testimonials";
import ComparisonTable from "@/components/landing/ComparisonTable";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import UrgencyBanner from "@/components/landing/UrgencyBanner";
import FloatingCTA from "@/components/landing/FloatingCTA";
import WhatsAppButton from "@/components/landing/WhatsAppButton";

export default function LandingPage() {
  return (
    <main dir="rtl">
      <UrgencyBanner />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <DemoPreview />
      <Testimonials />
      <ComparisonTable />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
      <FloatingCTA />
      <WhatsAppButton />
    </main>
  );
}
