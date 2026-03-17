import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Team from "../components/Team";
import Tree from "../components/Tree";
import Tournaments from "../components/Tournaments";
import LiveMatchTicker from "../components/LiveMatchTicker";
import TeamFloaters3D from "../components/TeamFloaters3D";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <LiveMatchTicker />
      <TeamFloaters3D />
      <Stats />
      <Team />
      <Tree />
      <Tournaments />
      <Footer />
    </>
  );
}

export default Home;

