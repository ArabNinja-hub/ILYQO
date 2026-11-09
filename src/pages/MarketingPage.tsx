import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { ProblemSolution } from "../components/ProblemSolution";
import { HowItWorks } from "../components/HowItWorks";
import { Capabilities } from "../components/Capabilities";
import { DemoShowcase } from "../components/DemoShowcase";
import { UseCases } from "../components/UseCases";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export function MarketingPage() {
  useEffect(() => {
    document.title = "ILYQO — Intelligence That Moves Business";
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-volt-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Capabilities />
        <DemoShowcase />
        <UseCases />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
