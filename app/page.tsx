import { HeroScroll } from '@/components/hero/HeroScroll';
import { Categories } from '@/components/sections/Categories';
import { Destinations } from '@/components/sections/Destinations';
import { WhyUs } from '@/components/sections/WhyUs';
import { Reviews } from '@/components/sections/Reviews';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main>
      <HeroScroll />
      <Categories />
      <Destinations />
      <WhyUs />
      <Reviews />
      <Footer />
    </main>
  );
}
