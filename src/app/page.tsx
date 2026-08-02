"use client";

import dynamic from "next/dynamic";
import { PremiumNavbar } from "@/components/landing/premium-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { AnimatedGradientBg } from "@/components/landing/animated-gradient-bg";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { WhyEngramSection } from "@/components/landing/why-engram-section";
import { LiveDemoSection } from "@/components/landing/live-demo-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { PremiumFooter } from "@/components/landing/premium-footer";

export default function HomePage() {
  return (
    <>
      {/* Background */}
      <AnimatedGradientBg />
      
      {/* Navigation */}
      <PremiumNavbar />

      {/* Main Content */}
      <main>
        {/* Hero with 3D Scene */}
        <HeroSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Why ENGRAM */}
        <WhyEngramSection />

        {/* Live Demo */}
        <LiveDemoSection />

        {/* Features */}
        <FeaturesSection />

        {/* Pricing */}
        <PricingSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <FinalCTASection />
      </main>

      {/* Footer */}
      <PremiumFooter />
    </>
  );
}
