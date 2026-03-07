import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, including name, email address, phone number, and payment information when making purchases. We also automatically collect certain information when you visit our website, such as IP address, browser type, and viewing patterns."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you promotional materials, communicate with you about updates and news, and comply with legal obligations."
    },
    {
      title: "3. Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential."
    },
    {
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
    },
    {
      title: "5. Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
    },
    {
      title: "6. Third-Party Links",
      content: "Our website may contain links to third-party websites. We have no control over these external sites and cannot be responsible for their content or privacy practices."
    },
    {
      title: "7. Children's Privacy",
      content: "Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13."
    },
    {
      title: "8. Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You may also opt out of receiving promotional communications at any time by contacting us."
    },
    {
      title: "9. Changes to This Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date."
    },
    {
      title: "10. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at contact@drsesports.com or through our Contact page."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    "name": "Privacy Policy",
    "publisher": {
      "@type": "Organization",
      "name": "DRS Esports"
    },
    "dateModified": new Date().toISOString().split('T')[0],
    "url": "https://drsesports.com/privacy-policy"
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
            <h1>Privacy <span className="highlight">Policy</span></h1>
            <p>Your privacy is important to us</p>
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="legal-cta">
            <h2>Questions?</h2>
            <p>If you have any questions about this policy, please contact us.</p>
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
          margin-bottom: 30px;
        }

        .legal-section h2 {
          font-size: 18px;
          color: var(--primary);
          margin-bottom: 12px;
          font-family: 'Orbitron', sans-serif;
        }

        .legal-section p {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 15px;
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

export default PrivacyPolicy;
