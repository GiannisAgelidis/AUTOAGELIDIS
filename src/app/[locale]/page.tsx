import { setRequestLocale } from "next-intl/server";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import FeaturedCars from "@/components/site/FeaturedCars";
import Location from "@/components/site/Location";
import ContactForm from "@/components/site/ContactForm";
import Footer from "@/components/site/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <FeaturedCars />
        <Location />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
