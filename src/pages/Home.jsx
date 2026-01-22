import AnimatedPage from '../components/global/AnimatedPage';
import Assurance from '../components/home/Assurance';
import HauteCouture from '../components/home/HauteCouture';

import Hero from '../components/home/Hero';
import Intro from '../components/home/Intro';
import JustForYou from '../components/home/JustForYou';
import NewArrival from '../components/home/NewArrival';
import Support from '../components/home/SupportingBrands';

const Home = () => {
  return (
    <AnimatedPage>
      <Hero />
      <NewArrival />
      <HauteCouture />
      <Intro />
      <Support />
      <JustForYou />
      <Assurance />
    </AnimatedPage>
  );
};

export default Home;
