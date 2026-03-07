import { useLocation } from "react-router-dom";

const pageMeta = {
  "/": {
    title: "DRS ESPORTS | Professional PUBG Mobile Esports Team India",
    description: "DRS Esports is a professional PUBG Mobile esports team from India. Rising Through Fire. Winning With Precision. Join our tournaments, shop merchandise, and follow our achievements.",
    keywords: "DRS Esports, PUBG Mobile, Esports, Gaming, Indian Esports, Professional Gaming",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/about": {
    title: "About DRS ESPORTS | Our Story & Mission",
    description: "Learn about DRS Esports journey from humble beginnings to becoming one of India's top PUBG Mobile teams. Our mission, values, and vision for the future.",
    keywords: "DRS Esports about, Indian esports team, PUBG Mobile India",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/shop": {
    title: "Shop DRS ESPORTS Merchandise | Jersey, Hoodies & More",
    description: "Official DRS Esports merchandise store. Shop premium jerseys, hoodies, and apparel. Show your support for India's top PUBG Mobile team.",
    keywords: "DRS Esports shop, esports merchandise, PUBG Jersey, gaming apparel",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/tournaments": {
    title: "Tournaments | DRS ESPORTS Competitive Events",
    description: "View upcoming and past DRS Esports tournaments. Compete against the best teams and win exciting prizes in our PUBG Mobile events.",
    keywords: "DRS Esports tournaments, PUBG Mobile tournament, esports competition",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/teams": {
    title: "Our Teams | DRS ESPORTS Player Roster",
    description: "Meet the DRS Esports players and staff. View our professional PUBG Mobile roster, coaches, and support team.",
    keywords: "DRS Esports players, PUBG Mobile team roster, Indian esports players",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/achievements": {
    title: "Achievements | DRS ESPORTS Championship Wins",
    description: "Explore DRS Esports championship wins and achievements. Our tournament victories and milestones in Indian esports history.",
    keywords: "DRS Esports achievements, tournament wins, championships",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/leaderboard": {
    title: "Leaderboard | DRS ESPORTS Rankings",
    description: "View DRS Esports player rankings and statistics. Track player performance, scores, and rankings in real-time.",
    keywords: "DRS Esports leaderboard, PUBG rankings, player stats",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/news": {
    title: "News | DRS ESPORTS Latest Updates",
    description: "Stay updated with the latest DRS Esports news, announcements, tournament results, and team updates.",
    keywords: "DRS Esports news, PUBG Mobile news, esports updates",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/faq": {
    title: "FAQ | DRS ESPORTS Frequently Asked Questions",
    description: "Find answers to frequently asked questions about DRS Esports, tournaments, merchandise, and more.",
    keywords: "DRS Esports FAQ, frequently asked questions, esports help",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/contact": {
    title: "Contact Us | DRS ESPORTS",
    description: "Get in touch with DRS Esports for sponsorship, partnerships, or general inquiries. We'd love to hear from you!",
    keywords: "DRS Esports contact, sponsorship inquiry, partnership",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/privacy-policy": {
    title: "Privacy Policy | DRS ESPORTS",
    description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
    keywords: "DRS Esports privacy policy, data protection",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  },
  "/terms-of-service": {
    title: "Terms of Service | DRS ESPORTS",
    description: "Read our terms of service to understand the rules and regulations for using the DRS Esports website and services.",
    keywords: "DRS Esports terms of service, terms and conditions",
    ogImage: "https://drsesports.com/DRSLOGO.jpg"
  }
};

function Meta() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta["/"];
  
  const canonicalUrl = `https://drsesports.com${location.pathname}`;
  
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://drsesports.com"
      },
      ...(location.pathname !== "/" ? [{
        "@type": "ListItem",
        "position": 2,
        "name": meta.title.split(" | ")[0],
        "item": canonicalUrl
      }] : [])
    ]
  };

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="DRS Esports" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbList.itemListElement.length > 1 && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbList)}
        </script>
      )}
      
      {/* Accessibility - Skip Links */}
      <a 
        href="#main-content" 
        className="skip-link"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden"
        }}
      >
        Skip to main content
      </a>
    </>
  );
}

export default Meta;
