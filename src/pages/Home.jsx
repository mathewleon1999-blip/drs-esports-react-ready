import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Team from "../components/Team";
import Tournaments from "../components/Tournaments";
import LiveMatchTicker from "../components/LiveMatchTicker";
import Footer from "../components/Footer";

const Tree = lazy(() => import("../components/Tree"));
const TeamFloaters3D = lazy(() => import("../components/TeamFloaters3D"));

function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();

    // Safari < 14 fallback
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  const suspenseFallback = useMemo(
    () => <div style={{ height: 24 }} aria-hidden="true" />,
    []
  );

  return (
    <>
      <Navbar />
      <Hero />
      <LiveMatchTicker />
      <Stats />
      <Team />

      <Suspense fallback={suspenseFallback}>
        <Tree />
      </Suspense>

      <Tournaments />

      {/* 3D effects are expensive on mobile GPUs; keep them desktop-only */}
      {!isMobile && (
        <Suspense fallback={null}>
          <TeamFloaters3D />
        </Suspense>
      )}

      <Footer />
    </>
  );
}

export default Home;

