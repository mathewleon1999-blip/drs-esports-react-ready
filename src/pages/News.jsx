import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Demo news data
const news = [
  {
    id: 1,
    title: "DRS Pro League Season 5 Announced with ₹5 Lakh Prize Pool",
    category: "Tournament",
    date: "2025-01-20",
    author: "DRS Admin",
    image: "/news-1.jpg",
    excerpt: "The biggest Valorant tournament of the year is back with an increased prize pool and more teams.",
    featured: true
  },
  {
    id: 2,
    title: "Team DRS Signs New Player ShadowStrike",
    category: "Team News",
    date: "2025-01-18",
    author: "DRS Admin",
    image: "/news-2.jpg",
    excerpt: "We are thrilled to announce our newest addition to the Valorant roster.",
    featured: false
  },
  {
    id: 3,
    title: "DRS Championship 2025: Everything You Need to Know",
    category: "Tournament",
    date: "2025-01-15",
    author: "DRS Admin",
    image: "/news-3.jpg",
    excerpt: "The annual DRS Championship returns with CS2 this year. Here's the complete breakdown.",
    featured: false
  },
  {
    id: 4,
    title: "Top 5 Tips for Competitive Gaming",
    category: "Guides",
    date: "2025-01-12",
    author: "Coach DRS",
    image: "/news-4.jpg",
    excerpt: "Our professional coaches share their best tips for improving your game.",
    featured: false
  },
  {
    id: 5,
    title: "DRS Weekly Showdown Winners Announced",
    category: "Results",
    date: "2025-01-10",
    author: "DRS Admin",
    image: "/news-5.jpg",
    excerpt: "Congratulations to Team Venom for winning this week's PUBG tournament.",
    featured: false
  },
  {
    id: 6,
    title: "New Merchandise Collection Launching Soon",
    category: "Merchandise",
    date: "2025-01-08",
    author: "DRS Admin",
    image: "/news-6.jpg",
    excerpt: "Get ready for the exclusive DRS Championship 2025 merchandise line.",
    featured: false
  }
];

const categories = ["All", "Tournament", "Team News", "Results", "Guides", "Merchandise"];

function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredNews = activeCategory === "All" 
    ? news 
    : news.filter(n => n.category === activeCategory);

  const featuredArticle = news.find(n => n.featured);

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero Section */}
        <section className="news-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>News & <span className="highlight">Updates</span></h1>
            <p>Latest esports news, tournament updates, and more</p>
          </motion.div>
        </section>

        {/* News Content */}
        <section className="news-content">
          {/* Featured Article */}
          {featuredArticle && activeCategory === "All" && (
            <motion.div 
              className="featured-article"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="featured-image">
                <div className="news-placeholder large">
                  <span>📰</span>
                </div>
              </div>
              <div className="featured-info">
                <span className="category-badge">{featuredArticle.category}</span>
                <h2>{featuredArticle.title}</h2>
                <p className="article-meta">
                  <span>📅 {featuredArticle.date}</span>
                  <span>👤 {featuredArticle.author}</span>
                </p>
                <p className="article-excerpt">{featuredArticle.excerpt}</p>
                <button 
                  className="read-more-btn"
                  onClick={() => setSelectedArticle(featuredArticle)}
                >
                  Read More →
                </button>
              </div>
            </motion.div>
          )}

          {/* Category Filter */}
          <div className="news-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="news-grid">
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                className="news-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedArticle(article)}
              >
                <div className="news-image">
                  <div className="news-placeholder">
                    <span>📰</span>
                  </div>
                  <span className="category-badge">{article.category}</span>
                </div>
                <div className="news-info">
                  <h3>{article.title}</h3>
                  <p className="article-meta">
                    <span>📅 {article.date}</span>
                  </p>
                  <p className="article-excerpt">{article.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedArticle(null)}
        >
          <motion.div 
            className="article-modal"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedArticle(null)}>×</button>
            
            <div className="article-header">
              <span className="category-badge">{selectedArticle.category}</span>
              <h2>{selectedArticle.title}</h2>
              <p className="article-meta">
                <span>📅 {selectedArticle.date}</span>
                <span>👤 {selectedArticle.author}</span>
              </p>
            </div>

            <div className="article-image">
              <div className="news-placeholder large">
                <span>📰</span>
              </div>
            </div>

            <div className="article-body">
              <p>{selectedArticle.excerpt}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            <div className="article-footer">
              <div className="share-buttons">
                <span>Share:</span>
                <button className="share-btn">🐦</button>
                <button className="share-btn">📘</button>
                <button className="share-btn">📸</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </>
  );
}

export default News;
