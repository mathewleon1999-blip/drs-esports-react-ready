import{c as g,r as o,j as e,L as u,m as r}from"./index-DgDZGFqk.js";import{N as d,F as p,A as b}from"./Footer-DbYKpWxH.js";const y={shakkir:{ign:"Shakkir",realName:"Shakkir",age:20,country:"🇮🇳",role:"Captain/IGL",mainRole:"In-Game Leader",avatar:"⚔️",image:"/DRS ESPORTS/SHAKKIR).jpg",joinDate:"2023-02-20",bio:"Team captain and primary IGL. Known for exceptional strategic thinking and shot-calling abilities.",stats:{kda:"2.8",headshot:"45%",matches:142,wins:68,top10:95,avgDamage:520,longestKill:890,gamesPlayed:520},tournamentHistory:[{tournament:"PMNC UAE 2025",position:"#4",prize:"₹2,00,000",date:"2025-01"},{tournament:"DRS Championship",position:"#1",prize:"₹1,50,000",date:"2024-12"},{tournament:"Winter Cup 2024",position:"#2",prize:"₹75,000",date:"2024-12"},{tournament:"ESL India Qualifiers",position:"#3",prize:"₹50,000",date:"2024-11"},{tournament:"PUBG Mobile Pro Series",position:"#5",prize:"₹25,000",date:"2024-10"}],achievements:[{title:"PMNC UAE 2025",subtitle:"4th Place",icon:"🏆"},{title:"DRS Championship",subtitle:"Champion",icon:"🥇"},{title:"Winter Cup",subtitle:"Runner-up",icon:"🥈"},{title:"100+ Tournament Wins",subtitle:"Career Achievement",icon:"⭐"}],social:{twitter:"@shakkir",instagram:"@shakkir_drs",discord:"Shakkir#5678",youtube:"ShakkirTV"},equipment:{phone:"iPhone 15 Pro Max",earphones:"Samsung Galaxy Buds3 Pro",controller:"Mobile Controller",emulator:"Gameloop"}},dream:{ign:"Dream",realName:"Dream",age:22,country:"🇮🇳",role:"Fragger",mainRole:"Entry Fragger",avatar:"🎯",image:"/DRS ESPORTS/Dream.jpg",joinDate:"2023-01-15",bio:"Aggressive entry fragger known for clutch plays and high-impact engagements.",stats:{kda:"2.4",headshot:"32%",matches:156,wins:52,top10:88,avgDamage:480,longestKill:920,gamesPlayed:480},tournamentHistory:[{tournament:"PMNC UAE 2025",position:"#4",prize:"₹2,00,000",date:"2025-01"},{tournament:"DRS Championship",position:"#1",prize:"₹1,50,000",date:"2024-12"},{tournament:"Summer League 2024",position:"#1",prize:"₹1,00,000",date:"2024-08"}],achievements:[{title:"PMNC UAE 2025",subtitle:"4th Place",icon:"🏆"},{title:"Summer League Champion",subtitle:"Winner",icon:"🥇"},{title:"Clutch King",subtitle:"Most Clutch Player",icon:"🦁"}],social:{twitter:"@dream",instagram:"@dream_drs",discord:"Dream#1234",youtube:"DreamGaming"},equipment:{phone:"iPhone 14 Pro",earphones:"Sony WF-1000XM5",controller:"Mobile Controller",emulator:"Gameloop"}},shyno:{ign:"Shyno",realName:"Shyno",age:21,country:"🇮🇳",role:"Support",mainRole:"Support/IGL",avatar:"🛡️",image:"/DRS ESPORTS/SHYNO.jpg",joinDate:"2023-03-10",bio:"Reliable support player with excellent game sense and utility usage.",stats:{kda:"1.9",headshot:"28%",matches:138,wins:48,top10:82,avgDamage:380,longestKill:650,gamesPlayed:420},tournamentHistory:[{tournament:"PMNC UAE 2025",position:"#4",prize:"₹2,00,000",date:"2025-01"},{tournament:"DRS Championship",position:"#1",prize:"₹1,50,000",date:"2024-12"}],achievements:[{title:"PMNC UAE 2025",subtitle:"4th Place",icon:"🏆"},{title:"DRS Championship",subtitle:"Champion",icon:"🥇"}],social:{twitter:"@shyno",instagram:"@shyno_drs",discord:"Shyno#9012",youtube:"ShynoGaming"},equipment:{phone:"Asus ROG Phone 8",earphones:"OnePlus Buds Pro 2",controller:"Mobile Controller",emulator:"Gameloop"}},xander:{ign:"Xander",realName:"Xander",age:23,country:"🇮🇳",role:"Sniper",mainRole:"Long Range",avatar:"👁️",image:"/DRS ESPORTS/XANDER-WA0043.jpg",joinDate:"2023-04-05",bio:"Elite long-range specialist with exceptional sniping skills and patience.",stats:{kda:"1.7",headshot:"25%",matches:125,wins:42,top10:75,avgDamage:420,longestKill:1200,gamesPlayed:380},tournamentHistory:[{tournament:"PMNC UAE 2025",position:"#4",prize:"₹2,00,000",date:"2025-01"},{tournament:"Winter Cup 2024",position:"#2",prize:"₹75,000",date:"2024-12"}],achievements:[{title:"PMNC UAE 2025",subtitle:"4th Place",icon:"🏆"},{title:"Winter Cup",subtitle:"Runner-up",icon:"🥈"},{title:"Longest Kill Record",subtitle:"1200m",icon:"🎯"}],social:{twitter:"@xander",instagram:"@xander_drs",discord:"Xander#3456",youtube:"XanderSnipes"},equipment:{phone:"iPhone 15 Pro",earphones:"AirPods Pro 2",controller:"Mobile Controller",emulator:"Gameloop"}}};function j(){const{playerId:n}=g(),[a,m]=o.useState(null),[i,l]=o.useState("overview"),[c,x]=o.useState(!1);if(o.useEffect(()=>{const t=Object.values(y).find(s=>s.ign.toLowerCase()===(n==null?void 0:n.toLowerCase()));m(t||null)},[n]),!a)return e.jsxs(e.Fragment,{children:[e.jsx(d,{}),e.jsx("div",{className:"page-container",children:e.jsxs("div",{className:"player-not-found",children:[e.jsx("div",{className:"not-found-icon",children:"🔍"}),e.jsx("h1",{children:"Player Not Found"}),e.jsx("p",{children:"The player you're looking for doesn't exist or has been removed."}),e.jsx(u,{to:"/teams",className:"primary-btn",children:"View All Players"})]})}),e.jsx(p,{})]});const h=()=>{x(!c)};return e.jsxs(e.Fragment,{children:[e.jsx(d,{}),e.jsxs("div",{className:"page-container",children:[e.jsx("section",{className:"player-profile-hero",children:e.jsxs(r.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.8},children:[e.jsx("div",{className:"player-profile-cover",children:e.jsx("div",{className:"cover-gradient"})}),e.jsxs("div",{className:"player-profile-header-content",children:[e.jsxs("div",{className:"player-avatar-section",children:[e.jsx("div",{className:"player-avatar-xl",children:a.image?e.jsx("img",{src:a.image,alt:a.ign,className:"player-profile-img"}):a.avatar}),e.jsx("span",{className:"player-country-lg",children:a.country})]}),e.jsxs("div",{className:"player-info-section",children:[e.jsx("h1",{children:a.ign}),e.jsx("p",{className:"player-real-name",children:a.realName}),e.jsxs("div",{className:"player-tags-section",children:[e.jsx("span",{className:"player-role-badge-lg",children:a.role}),e.jsx("span",{className:"player-team-badge",children:"DRS Esports"})]}),e.jsxs("div",{className:"player-social-icons",children:[e.jsx("a",{href:`https://twitter.com/${a.social.twitter.replace("@","")}`,target:"_blank",rel:"noopener noreferrer",className:"social-icon-btn",children:"🐦"}),e.jsx("a",{href:`https://instagram.com/${a.social.instagram.replace("@","")}`,target:"_blank",rel:"noopener noreferrer",className:"social-icon-btn",children:"📷"}),e.jsx("a",{href:`https://youtube.com/${a.social.youtube}`,target:"_blank",rel:"noopener noreferrer",className:"social-icon-btn",children:"📺"})]})]}),e.jsx("div",{className:"player-actions-section",children:e.jsx("button",{className:`follow-btn ${c?"following":""}`,onClick:h,children:c?"✓ Following":"+ Follow"})})]})]})}),e.jsxs("section",{className:"player-profile-content",children:[e.jsxs("div",{className:"player-tabs",children:[e.jsx("button",{className:`player-tab-btn ${i==="overview"?"active":""}`,onClick:()=>l("overview"),children:"Overview"}),e.jsx("button",{className:`player-tab-btn ${i==="stats"?"active":""}`,onClick:()=>l("stats"),children:"Statistics"}),e.jsx("button",{className:`player-tab-btn ${i==="tournaments"?"active":""}`,onClick:()=>l("tournaments"),children:"Tournament History"}),e.jsx("button",{className:`player-tab-btn ${i==="equipment"?"active":""}`,onClick:()=>l("equipment"),children:"Equipment"})]}),e.jsxs(b,{mode:"wait",children:[i==="overview"&&e.jsxs(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"player-tab-content",children:[e.jsxs("div",{className:"overview-grid",children:[e.jsx("div",{className:"overview-main",children:e.jsxs("div",{className:"player-bio-card",children:[e.jsx("h3",{children:"About"}),e.jsx("p",{children:a.bio}),e.jsxs("div",{className:"player-meta",children:[e.jsxs("span",{children:["🎂 ",a.age," years old"]}),e.jsxs("span",{children:["📅 Joined ",new Date(a.joinDate).toLocaleDateString("en-US",{month:"long",year:"numeric"})]})]})]})}),e.jsxs("div",{className:"overview-stats",children:[e.jsxs("div",{className:"quick-stat-card",children:[e.jsx("span",{className:"quick-stat-value",children:a.stats.matches}),e.jsx("span",{className:"quick-stat-label",children:"Matches"})]}),e.jsxs("div",{className:"quick-stat-card",children:[e.jsx("span",{className:"quick-stat-value",children:a.stats.wins}),e.jsx("span",{className:"quick-stat-label",children:"Wins"})]}),e.jsxs("div",{className:"quick-stat-card",children:[e.jsx("span",{className:"quick-stat-value",children:a.stats.kda}),e.jsx("span",{className:"quick-stat-label",children:"KDA"})]})]})]}),e.jsxs("div",{className:"achievements-section",children:[e.jsx("h3",{children:"Achievements"}),e.jsx("div",{className:"achievements-grid",children:a.achievements.map((t,s)=>e.jsxs("div",{className:"achievement-card-compact",children:[e.jsx("span",{className:"achievement-icon",children:t.icon}),e.jsxs("div",{className:"achievement-info",children:[e.jsx("span",{className:"achievement-title",children:t.title}),e.jsx("span",{className:"achievement-subtitle",children:t.subtitle})]})]},s))})]})]},"overview"),i==="stats"&&e.jsx(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"player-tab-content",children:e.jsxs("div",{className:"stats-grid-detailed",children:[e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"🎯"}),e.jsx("span",{className:"stat-value-lg",children:a.stats.kda}),e.jsx("span",{className:"stat-label-lg",children:"KDA Ratio"})]}),e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"💀"}),e.jsx("span",{className:"stat-value-lg",children:a.stats.headshot}),e.jsx("span",{className:"stat-label-lg",children:"Headshot %"})]}),e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"⚔️"}),e.jsx("span",{className:"stat-value-lg",children:a.stats.matches}),e.jsx("span",{className:"stat-label-lg",children:"Matches Played"})]}),e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"🏆"}),e.jsx("span",{className:"stat-value-lg",children:a.stats.wins}),e.jsx("span",{className:"stat-label-lg",children:"Victories"})]}),e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"🎯"}),e.jsx("span",{className:"stat-value-lg",children:a.stats.top10}),e.jsx("span",{className:"stat-label-lg",children:"Top 10 Finishes"})]}),e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"💥"}),e.jsx("span",{className:"stat-value-lg",children:a.stats.avgDamage}),e.jsx("span",{className:"stat-label-lg",children:"Avg Damage"})]}),e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"🔫"}),e.jsxs("span",{className:"stat-value-lg",children:[a.stats.longestKill,"m"]}),e.jsx("span",{className:"stat-label-lg",children:"Longest Kill"})]}),e.jsxs("div",{className:"stat-card-detailed",children:[e.jsx("span",{className:"stat-icon",children:"🎮"}),e.jsx("span",{className:"stat-value-lg",children:a.stats.gamesPlayed}),e.jsx("span",{className:"stat-label-lg",children:"Games Played"})]})]})},"stats"),i==="tournaments"&&e.jsx(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"player-tab-content",children:e.jsx("div",{className:"tournament-history-list",children:a.tournamentHistory.map((t,s)=>e.jsxs("div",{className:"tournament-history-item",children:[e.jsx("div",{className:"tournament-position",children:e.jsx("span",{className:"position-badge",children:t.position})}),e.jsxs("div",{className:"tournament-info",children:[e.jsx("h4",{children:t.tournament}),e.jsx("span",{className:"tournament-date",children:t.date})]}),e.jsx("div",{className:"tournament-prize",children:e.jsx("span",{className:"prize-amount",children:t.prize})})]},s))})},"tournaments"),i==="equipment"&&e.jsx(r.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"player-tab-content",children:e.jsxs("div",{className:"equipment-grid",children:[e.jsxs("div",{className:"equipment-card",children:[e.jsx("span",{className:"equipment-icon",children:"📱"}),e.jsx("span",{className:"equipment-label",children:"Phone"}),e.jsx("span",{className:"equipment-value",children:a.equipment.phone})]}),e.jsxs("div",{className:"equipment-card",children:[e.jsx("span",{className:"equipment-icon",children:"🎧"}),e.jsx("span",{className:"equipment-label",children:"Earphones"}),e.jsx("span",{className:"equipment-value",children:a.equipment.earphones})]}),e.jsxs("div",{className:"equipment-card",children:[e.jsx("span",{className:"equipment-icon",children:"🎮"}),e.jsx("span",{className:"equipment-label",children:"Controller"}),e.jsx("span",{className:"equipment-value",children:a.equipment.controller})]}),e.jsxs("div",{className:"equipment-card",children:[e.jsx("span",{className:"equipment-icon",children:"💻"}),e.jsx("span",{className:"equipment-label",children:"Emulator"}),e.jsx("span",{className:"equipment-value",children:a.equipment.emulator})]})]})},"equipment")]})]})]}),e.jsx(p,{}),e.jsx("style",{children:`
        .player-profile-hero {
          background: linear-gradient(180deg, rgba(0, 212, 255, 0.1) 0%, var(--dark-bg) 100%);
          padding-bottom: 40px;
        }

        .player-profile-cover {
          height: 200px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          position: relative;
          overflow: hidden;
        }

        .cover-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(transparent, var(--dark-bg));
        }

        .player-profile-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: flex-end;
          gap: 30px;
          margin-top: -60px;
          position: relative;
          z-index: 1;
        }

        .player-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .player-avatar-xl {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: var(--card-bg);
          border: 4px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
        }

        .player-profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .player-country-lg {
          font-size: 32px;
          margin-top: 10px;
        }

        .player-info-section {
          flex: 1;
          padding-bottom: 10px;
        }

        .player-info-section h1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 42px;
          margin-bottom: 5px;
        }

        .player-real-name {
          color: var(--text-muted);
          font-size: 18px;
          margin-bottom: 15px;
        }

        .player-tags-section {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .player-role-badge-lg {
          background: var(--gradient-primary);
          color: #000;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
        }

        .player-team-badge {
          background: rgba(255, 0, 110, 0.2);
          color: var(--secondary);
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 600;
          border: 1px solid var(--secondary);
        }

        .player-social-icons {
          display: flex;
          gap: 10px;
        }

        .social-icon-btn {
          width: 40px;
          height: 40px;
          background: var(--card-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .social-icon-btn:hover {
          background: var(--primary);
          transform: translateY(-3px);
        }

        .player-actions-section {
          padding-bottom: 10px;
        }

        .follow-btn {
          padding: 12px 30px;
          background: var(--gradient-primary);
          border: none;
          border-radius: 8px;
          color: #000;
          font-family: 'Orbitron', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .follow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }

        .follow-btn.following {
          background: transparent;
          border: 2px solid var(--primary);
          color: var(--primary);
        }

        .player-profile-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .player-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          padding-bottom: 20px;
        }

        .player-tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .player-tab-btn.active {
          color: var(--primary);
        }

        .player-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -21px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .player-tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .player-bio-card {
          background: var(--card-bg);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
        }

        .player-bio-card h3 {
          margin-bottom: 15px;
          color: var(--primary);
        }

        .player-bio-card p {
          color: var(--text-light);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .player-meta {
          display: flex;
          gap: 20px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .quick-stat-card {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
        }

        .quick-stat-value {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 28px;
          color: var(--primary);
          margin-bottom: 5px;
        }

        .quick-stat-label {
          color: var(--text-muted);
          font-size: 12px;
        }

        .achievements-section h3 {
          margin-bottom: 20px;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .achievement-card-compact {
          background: var(--card-bg);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .achievement-icon {
          font-size: 32px;
        }

        .achievement-info {
          display: flex;
          flex-direction: column;
        }

        .achievement-title {
          font-weight: 600;
          color: var(--text-light);
        }

        .achievement-subtitle {
          color: var(--text-muted);
          font-size: 14px;
        }

        .stats-grid-detailed {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card-detailed {
          background: var(--card-bg);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card-detailed:hover {
          border-color: var(--primary);
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 10px;
        }

        .stat-value-lg {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 36px;
          color: var(--primary);
          margin-bottom: 5px;
        }

        .stat-label-lg {
          color: var(--text-muted);
          font-size: 14px;
        }

        .tournament-history-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .tournament-history-item {
          background: var(--card-bg);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .position-badge {
          background: var(--gradient-primary);
          color: #000;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
        }

        .tournament-info {
          flex: 1;
        }

        .tournament-info h4 {
          margin-bottom: 5px;
        }

        .tournament-date {
          color: var(--text-muted);
          font-size: 14px;
        }

        .prize-amount {
          font-family: 'Orbitron', sans-serif;
          font-size: 20px;
          color: var(--primary);
        }

        .equipment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .equipment-card {
          background: var(--card-bg);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(0, 212, 255, 0.1);
          text-align: center;
        }

        .equipment-icon {
          font-size: 40px;
          display: block;
          margin-bottom: 15px;
        }

        .equipment-label {
          display: block;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .equipment-value {
          font-family: 'Orbitron', sans-serif;
          color: var(--primary);
        }

        .player-not-found {
          text-align: center;
          padding: 100px 20px;
        }

        .not-found-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .player-profile-header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-top: -40px;
          }

          .player-avatar-xl {
            width: 120px;
            height: 120px;
            font-size: 48px;
          }

          .player-info-section h1 {
            font-size: 32px;
          }

          .player-tags-section {
            justify-content: center;
          }

          .player-social-icons {
            justify-content: center;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .overview-stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .player-tabs {
            flex-wrap: wrap;
          }

          .player-tab-btn {
            flex: 1;
            min-width: 100px;
          }

          .tournament-history-item {
            flex-direction: column;
            text-align: center;
          }
        }
      `})]})}export{j as default};
