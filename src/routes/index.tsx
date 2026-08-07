import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Courses } from "@/components/landing/Courses";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Teachers } from "@/components/landing/Teachers";
import { Testimonials } from "@/components/landing/Testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IEA — Free IELTS & English Access" },
      {
        name: "description",
        content:
          "Free IELTS and English learning platform: placement test, video lessons, games, full mock exams and a live leaderboard.",
      },
      { property: "og:title", content: "IEA — Free IELTS & English Access" },
      {
        property: "og:description",
        content:
          "Take a 20-question placement test, then learn with video lessons, games and full IELTS mock exams.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Courses />
        <Teachers />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
