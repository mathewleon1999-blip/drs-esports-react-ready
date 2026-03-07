import{r as l,j as e,m as n,L as p}from"./index-DgDZGFqk.js";import{N as d,A as u,F as h}from"./Footer-DbYKpWxH.js";const s=[{question:"What is DRS Esports?",answer:"DRS Esports is a professional PUBG Mobile esports team based in India. We compete in various tournaments and strive to bring glory to Indian esports on the global stage."},{question:"How can I join DRS Esports?",answer:"To join DRS Esports, you can register through our website's login section. We regularly hold trials for talented players. Follow our news and announcements for upcoming tryouts."},{question:"Where can I buy DRS Esports merchandise?",answer:"You can purchase official DRS Esports merchandise including jerseys, hoodies, and more from our shop section. We offer high-quality products with exclusive designs."},{question:"How can I watch DRS Esports matches?",answer:"You can watch our live streams on our Live Stream page or follow us on YouTube and Twitch. We stream our tournaments and practice sessions regularly."},{question:"What tournaments does DRS Esports participate in?",answer:"DRS Esports participates in various national and international PUBG Mobile tournaments including pro leagues, championship series, and community events."},{question:"How can I contact DRS Esports for sponsorship or partnership?",answer:"For sponsorship and partnership inquiries, please visit our Contact page and fill out the form. Our team will get back to you within 24-48 hours."},{question:"Do you ship internationally?",answer:"Yes, we ship our merchandise worldwide. Shipping costs and delivery times vary by location. You can track your order using the order tracking feature."},{question:"How can I track my order?",answer:"You can track your order using the Order Tracking page on our website. Enter your order ID to get real-time updates on your shipment status."},{question:"What is your return policy?",answer:"We offer a 7-day return policy for unused items in original packaging. Please contact our support team to initiate a return request."},{question:"How can I stay updated with DRS Esports news?",answer:"Subscribe to our newsletter and follow us on all social media platforms to stay updated with the latest news, tournament results, and announcements."}];function x(){const[r,o]=l.useState(null),i=t=>{o(r===t?null:t)},c={"@context":"https://schema.org","@type":"FAQPage",mainEntity:s.map(t=>({"@type":"Question",name:t.question,acceptedAnswer:{"@type":"Answer",text:t.answer}}))};return e.jsxs(e.Fragment,{children:[e.jsx(d,{}),e.jsx("script",{type:"application/ld+json",children:JSON.stringify(c)}),e.jsxs("div",{className:"page-container",children:[e.jsx("section",{className:"faq-hero",children:e.jsxs(n.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},children:[e.jsxs("h1",{children:["Frequently Asked ",e.jsx("span",{className:"highlight",children:"Questions"})]}),e.jsx("p",{children:"Find answers to common questions about DRS Esports"})]})}),e.jsxs("section",{className:"faq-content",children:[e.jsx("div",{className:"faq-grid",children:s.map((t,a)=>e.jsxs(n.div,{className:`faq-item ${r===a?"open":""}`,initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.5,delay:a*.1},children:[e.jsxs("button",{className:"faq-question",onClick:()=>i(a),"aria-expanded":r===a,children:[e.jsx("span",{children:t.question}),e.jsx("span",{className:"faq-icon",children:r===a?"−":"+"})]}),e.jsx(u,{children:r===a&&e.jsx(n.div,{className:"faq-answer",initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.3},children:e.jsx("p",{children:t.answer})})})]},a))}),e.jsxs("div",{className:"faq-cta",children:[e.jsx("h2",{children:"Still have questions?"}),e.jsx("p",{children:"Can't find the answer you're looking for? Get in touch with our team."}),e.jsx(p,{to:"/contact",className:"primary-btn",children:"Contact Us"})]})]})]}),e.jsx(h,{}),e.jsx("style",{children:`
        .faq-hero {
          padding: 120px 20px 60px;
          text-align: center;
          background: radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                      var(--gradient-dark);
        }

        .faq-hero h1 {
          font-size: clamp(36px, 8vw, 72px);
          margin-bottom: 15px;
        }

        .faq-hero p {
          color: var(--text-muted);
          font-size: 20px;
        }

        .faq-content {
          padding: 60px 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .faq-item {
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          border-color: rgba(0, 212, 255, 0.3);
        }

        .faq-item.open {
          border-color: var(--primary);
        }

        .faq-question {
          width: 100%;
          padding: 20px 25px;
          background: transparent;
          border: none;
          color: var(--text-light);
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          color: var(--primary);
        }

        .faq-icon {
          font-size: 24px;
          color: var(--primary);
        }

        .faq-answer {
          overflow: hidden;
        }

        .faq-answer p {
          padding: 0 25px 20px;
          color: var(--text-muted);
          line-height: 1.7;
        }

        .faq-cta {
          text-align: center;
          margin-top: 60px;
          padding: 40px;
          background: var(--card-bg);
          border-radius: 16px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .faq-cta h2 {
          font-size: 28px;
          margin-bottom: 15px;
        }

        .faq-cta p {
          color: var(--text-muted);
          margin-bottom: 25px;
        }
      `})]})}export{x as default};
