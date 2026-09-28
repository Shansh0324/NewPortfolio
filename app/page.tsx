import About from "@/components/About";
import BackToTop from "@/components/BackToTop";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InlineSvg from "@/components/InlineSvg";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Works from "@/components/Works";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Clients
          angleLine={<InlineSvg src="images/bg-angle-line.svg" idPrefix="angle-line" />}
        />
        <Works />
        <Services />
        <Testimonials
          evermosLogo={<InlineSvg src="images/evermos-logo.svg" idPrefix="evermos-logo" />}
        />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
}
