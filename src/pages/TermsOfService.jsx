import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the DRS Esports website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily use DRS Esports website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use them for any commercial purpose, or transfer the materials to another person."
    },
    {
      title: "3. User Account Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must immediately notify us of any unauthorized uses of your account."
    },
    {
      title: "4. Purchases and Payments",
      content: "All purchases made through our website are subject to our return policy. Prices are subject to change without notice. We reserve the right to refuse service to anyone for any reason at any time."
    },
    {
      title: "5. Tournament Participation",
      content: "Participants in DRS Esports tournaments must abide by all rules and regulations set forth by the organization. Cheating, hacking, or any form of unfair play will result in immediate disqualification and banning from future events."
    },
    {
      title: "6. Intellectual Property",
      content: "All content on this website, including logos, graphics, images, and text, is the property of DRS Esports and protected by copyright laws. Unauthorized use may result in legal action."
    },
    {
      title: "7. User Conduct",
      content: "You agree not to use the website for any unlawful purpose or any purpose that could damage, disable, or impair the website. Harassment, abuse, or discrimination of any kind is strictly prohibited."
    },
    {
      title: "8. Limitation of Liability",
      content: "DRS Esports shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use or inability to use our services. Your use of the website is at your own risk."
    },
    {
      title: "9. Disclaimer",
      content: "The materials on DRS Esports website are provided 'as is'. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property."
    },
    {
      title: "10. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
    },
    {
      title: "11. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Your continued use of the website after changes constitutes acceptance of those changes."
    },
    {
      title: "12. Contact Information",
      content: "For questions about these Terms of Service, please contact us at contact@drsesports.com or through our Contact page."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Terms of Service",
    "publisher": {
      "@type": "Organization",
      "name": "DRS Esports"
    },
    "dateModified": new Date().toISOString().split('T')[0],
    "url": "https://drsesports.com/terms-of-service"
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      <div className="page-container">
        <section className="legal-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Terms of <span className="highlight">Service</span></h1>
            <p>Please read our terms carefully</p>
          </motion.div>
        </section>

        <section className="legal-content">
          <div className="legal-card">
            <p className="last-updated">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="legal-section"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="legal-cta">
            <h2>Questions?</h2>
            <p>If you have any questions about these terms, please contact us.</p>
            <Link to="/contact" className="primary-btn">Contact Us</Link>
          </div>
        </section>
      </div>

      <Footer />

      <style>{`
        .legal-hero {
          padding: 120px 20px 60px;
          text-align: center;
          background: radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                      var(--gradient-dark);
        }

        .legal-hero h1 {
          font-size: clamp(36px, 8vw, 72px);
          margin-bottom: 15px;
        }

        .legal-hero p {
          color: var(--text-muted);
          font-size: 20px;
        }

        .legal-content {
          padding: 60px 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .legal-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 40px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .last-updated {
          color: var(--primary);
          font-size: 14px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
        }

        .legal-section {
          margin-bottom: 25px;
        }

        .legal-section h2 {
          font-size: 16px;
          color: var(--primary);
          margin-bottom: 10px;
          font-family: 'Orbitron', sans-serif;
        }

        .legal-section p {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 14px;
        }

        .legal-cta {
          text-align: center;
          margin-top: 40px;
          padding: 40px;
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .legal-cta h2 {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .legal-cta p {
          color: var(--text-muted);
          margin-bottom: 25px;
        }
      `}</style>
    </>
  );
}

export default TermsOfService;
