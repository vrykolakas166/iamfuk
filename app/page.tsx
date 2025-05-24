import Hero from "@/components/features/hero/hero";
import Features from "@/components/features/landing/features";
import Testimonials from "@/components/features/landing/testimonials";
import Contact from "@/components/features/landing/contact";
import Stats from "@/components/features/landing/stats";

export default async function Index() {
  return (
    <main className="min-h-screen">
      <Hero />
      {/* <Stats />
      <Features />
      <Testimonials />
      <Contact /> */}
    </main>
  );
}
