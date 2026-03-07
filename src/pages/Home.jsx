import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Team from "../components/Team";
import Tree from "../components/Tree";
import Tournaments from "../components/Tournaments";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Team />
      <Tree />
      <Tournaments />
      <Footer />
    </>
  );
}

export default Home;

