import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProblemSolution } from "./components/ProblemSolution";
import { HowItWorks } from "./components/HowItWorks";
import { Capabilities } from "./components/Capabilities";
import { UseCases } from "./components/UseCases";
import { EarlyAccess } from "./components/EarlyAccess";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-volt-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Capabilities />
        <UseCases />
        <EarlyAccess />
      </main>
      <Footer />
    </>
  );
}
