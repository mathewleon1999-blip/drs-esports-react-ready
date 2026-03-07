import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const teamHierarchy = {
  name: "DRS ESPORTS",
  role: "Organization",
  icon: "🏆",
  color: "#00d4ff",
  children: [
    {
      name: "Leadership",
      role: "Management",
      icon: "👑",
      color: "#ffd700",
      children: [
        { name: "Boss", role: "Team Owner", icon: "👤", color: "#ffd700" },
        { name: "Manager", role: "Team Manager", icon: "👤", color: "#ffd700" },
        { name: "Content Lead", role: "Media Head", icon: "🎬", color: "#ffd700" },
      ],
    },
    {
      name: "DRS ELITE",
      role: "Main Squad",
      icon: "⚔️",
      color: "#ff006e",
      children: [
        {
          name: "Main Roster",
          role: "Pro Players",
          icon: "⭐",
          color: "#00d4ff",
          children: [
            { name: "AKOS", role: "IGL/Entry", icon: "🎯", color: "#ff006e", image: "/DRS ELITE/AKOS (3).png" },
            { name: "DRS ZEN", role: "Support", icon: "🛡️", color: "#ff006e", image: "/DRS ELITE/DRS ZEN (1).jpg" },
            { name: "Hawk GT", role: "Sniper", icon: "🔫", color: "#ff006e", image: "/DRS ELITE/Hawk GT (1).jpg" },
            { name: "Noisy N", role: "Lurker", icon: "👻", color: "#ff006e", image: "/DRS ELITE/noisy n (3).png" },
          ],
        },
        {
          name: "DRS ESPORTS",
          role: "Developing",
          icon: "🌱",
          color: "#00ff88",
          children: [
            { name: "Dream", role: "Developing Player", icon: "🌟", color: "#00ff88", image: "/DRS ESPORTS/Dream.jpg" },
            { name: "SHAKKIR", role: "Developing Player", icon: "🌟", color: "#00ff88", image: "/DRS ESPORTS/SHAKKIR).jpg" },
            { name: "SHYNO", role: "Developing Player", icon: "🌟", color: "#00ff88", image: "/DRS ESPORTS/SHYNO.jpg" },
            { name: "XANDER", role: "Developing Player", icon: "🌟", color: "#00ff88", image: "/DRS ESPORTS/XANDER-WA0043.jpg" },
          ],
        },
      ],
    },
    {
      name: "Support Staff",
      role: "Team Support",
      icon: "🤝",
      color: "#9b59b6",
      children: [
        { name: "Head Coach", role: "Strategy", icon: "📋", color: "#9b59b6" },
        { name: "Analyst", role: "Data", icon: "📊", color: "#9b59b6" },
        { name: "Trainer", role: "Fitness", icon: "💪", color: "#9b59b6" },
        { name: "Psychologist", role: "Mental Coach", icon: "🧠", color: "#9b59b6" },
      ],
    },
  ],
};

function TreeNode({ node, level = 0, onNodeClick, selectedNode }) {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode?.name === node.name;
  const isRoot = level === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: level * 0.15 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Connector Line from Parent */}
      {level > 0 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 25 }}
          transition={{ duration: 0.3, delay: level * 0.1 }}
          style={{
            width: 2,
            background: `linear-gradient(to bottom, ${node.color || '#00d4ff'}, transparent)`,
            filter: `drop-shadow(0 0 5px ${node.color || '#00d4ff'})`,
          }}
        />
      )}

      {/* Node Card */}
      <motion.div
        className={`tree-node ${isSelected ? 'selected' : ''}`}
        whileHover={{ 
          scale: 1.08, 
          boxShadow: `0 0 40px ${node.color || 'rgba(0, 212, 255, 0.6)'}` 
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNodeClick && onNodeClick(node)}
        style={{
          background: isSelected 
            ? `linear-gradient(135deg, ${node.color}20, ${node.color}40)`
            : "rgba(17, 24, 39, 0.9)",
          border: `2px solid ${isSelected ? node.color : 'rgba(0, 212, 255, 0.3)'}`,
          borderRadius: isRoot ? 20 : 12,
          padding: isRoot ? "25px 35px" : "15px 20px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          minWidth: isRoot ? 200 : 130,
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          boxShadow: isRoot
            ? `0 0 30px ${node.color}40`
            : `0 5px 20px rgba(0, 0, 0, 0.4), inset 0 0 20px ${node.color}10`,
        }}
      >
        {/* Glow Effect for Root */}
        {isRoot && (
          <div style={{
            position: "absolute",
            inset: -2,
            borderRadius: 20,
            background: `radial-gradient(circle, ${node.color}40 0%, transparent 70%)`,
            zIndex: -1,
            animation: "pulse 2s infinite",
          }} />
        )}

        {/* Icon with glow */}
        <motion.div
          animate={{ 
            scale: isSelected ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: isRoot ? "42px" : level === 1 ? "30px" : "26px",
            marginBottom: 8,
            filter: `drop-shadow(0 0 10px ${node.color})`,
          }}
        >
          {node.image ? (
            <img 
              src={node.image} 
              alt={node.name}
              style={{
                width: isRoot ? 60 : 50,
                height: isRoot ? 60 : 50,
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${node.color}`,
              }}
            />
          ) : (
            node.icon
          )}
        </motion.div>

        {/* Name */}
        <h4 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: isRoot ? "16px" : "13px",
          color: node.color || "var(--text-light)",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
          textShadow: `0 0 10px ${node.color}50`,
        }}>
          {node.name}
        </h4>

        {/* Role */}
        <p style={{
          fontSize: isRoot ? "13px" : "11px",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}>
          {node.role}
        </p>

        {/* Online Status Dot */}
        {level >= 2 && (
          <div style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00ff88",
            boxShadow: "0 0 10px #00ff88",
            animation: "blink 2s infinite",
          }} />
        )}
      </motion.div>

      {/* Children Container */}
      {hasChildren && (
        <>
          {/* Vertical connector */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              width: 2,
              background: `linear-gradient(to bottom, ${node.color || '#00d4ff'}, transparent)`,
              filter: `drop-shadow(0 0 5px ${node.color || '#00d4ff'})`,
            }}
          />

          {/* Horizontal bar for multiple children */}
          {node.children.length > 1 && (
            <div style={{
              position: "absolute",
              top: "auto",
              left: "50%",
              transform: "translateX(-50%)",
              width: `calc(100% + 60px)`,
              maxWidth: `${Math.min(node.children.length * 150, 600)}px`,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${node.color}80, transparent)`,
              filter: `drop-shadow(0 0 5px ${node.color})`,
            }} />
          )}

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: isRoot ? 30 : 15,
            position: "relative",
            paddingTop: 25,
          }}>
            {node.children.map((child, index) => (
              <div key={index} style={{ position: "relative" }}>
                {/* Vertical connector to each child */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    background: `linear-gradient(to bottom, ${child.color || '#00d4ff'}, transparent)`,
                    filter: `drop-shadow(0 0 5px ${child.color})`,
                  }}
                />
                <TreeNode 
                  node={child} 
                  level={level + 1} 
                  onNodeClick={onNodeClick}
                  selectedNode={selectedNode}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

function Tree() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode?.name === node.name ? null : node);
  };

  return (
    <section className="team-tree" style={{ 
      padding: "100px 20px", 
      background: "var(--gradient-dark)",
      minHeight: "100vh",
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .tree-node {
          transition: all 0.3s ease;
        }
        .tree-node.selected {
          transform: scale(1.05);
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: 40 }}
      >
        <h2 style={{ 
          fontSize: "clamp(32px, 6vw, 56px)", 
          marginBottom: 10,
          background: "linear-gradient(135deg, #00d4ff, #ff006e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          DRS <span className="highlight">Family Tree</span>
        </h2>
        <p style={{ 
          color: "var(--text-muted)", 
          marginBottom: 20, 
          letterSpacing: 2, 
          textTransform: "uppercase",
          fontSize: 14,
        }}>
          Meet Our Team Members
        </p>

        {/* Filter Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
        }}>
          {[
            { id: "all", label: "All Teams", color: "#00d4ff" },
            { id: "elite", label: "DRS ELITE", color: "#ff006e" },
            { id: "esports", label: "DRS ESPORTS", color: "#00ff88" },
            { id: "support", label: "Support", color: "#9b59b6" },
          ].map((filterBtn) => (
            <motion.button
              key={filterBtn.id}
              onClick={() => setFilter(filterBtn.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "8px 20px",
                borderRadius: 25,
                border: `1px solid ${filter === filterBtn.id ? filterBtn.color : 'rgba(255,255,255,0.1)'}`,
                background: filter === filterBtn.id ? `${filterBtn.color}20` : "transparent",
                color: filter === filterBtn.id ? filterBtn.color : "var(--text-muted)",
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {filterBtn.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tree Container */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        overflowX: "auto",
        padding: "40px 20px",
      }}>
        <TreeNode 
          node={teamHierarchy} 
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
        />
      </div>

      {/* Selected Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: "fixed",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(17, 24, 39, 0.95)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${selectedNode.color}`,
              borderRadius: 20,
              padding: "25px 40px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              boxShadow: `0 0 50px ${selectedNode.color}30`,
              zIndex: 100,
            }}
          >
            <div style={{
              fontSize: 48,
              filter: `drop-shadow(0 0 15px ${selectedNode.color})`,
            }}>
              {selectedNode.image ? (
                <img 
                  src={selectedNode.image} 
                  alt={selectedNode.name}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${selectedNode.color}`,
                  }}
                />
              ) : (
                selectedNode.icon
              )}
            </div>
            <div>
              <h3 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 24,
                color: selectedNode.color,
                marginBottom: 5,
              }}>
                {selectedNode.name}
              </h3>
              <p style={{
                color: "var(--text-muted)",
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}>
                {selectedNode.role}
              </p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "none",
                background: "var(--secondary)",
                color: "white",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollbar Styles */}
      <style>{`
        .team-tree {
          overflow-x: auto;
        }
        .team-tree::-webkit-scrollbar {
          height: 8px;
        }
        .team-tree::-webkit-scrollbar-track {
          background: var(--dark-bg);
        }
        .team-tree::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 4px;
        }
        .team-tree::-webkit-scrollbar-thumb:hover {
          background: var(--secondary);
        }
      `}</style>
    </section>
  );
}

export default Tree;
