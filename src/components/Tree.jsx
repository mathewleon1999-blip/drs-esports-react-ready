import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const teamHierarchy = {
  name: "DRS ESPORTS",
  role: "Organization",
  icon: "🏆",
  color: "#00d4ff",
  children: [
    {
      name: "DRS BLIND",
      role: "Leadership",
      icon: "👑",
      color: "#ffd700",
      children: [
        { name: "DRS MECHANIC", role: "CO-LEADER", icon: "👤", color: "#ffd700" },
        { name: "DRS LEON", role: "Team Manager", icon: "👤", color: "#ffd700" },
        { name: "DRS HOTPILOW", role: "Media Head", icon: "🎬", color: "#ffd700" },
      ],
    },
    {
      name: "DRS ESPORTS",
      role: "PUBG Lineup",
      icon: "🎮",
      color: "#00ff88",
      children: [
        {
          name: "DRS ESPORTS",
          role: "Main Roster",
          icon: "⭐",
          color: "#00ff88",
          children: [
            { name: "SHAKIIR", role: "IGL", icon: "🎯", color: "#00ff88", image: "/DRS ESPORTS/SHAKKIR).jpg" },
            { name: "DREAM", role: "Assaulter", icon: "🔫", color: "#00ff88", image: "/DRS ESPORTS/Dream.jpg" },
            { name: "NOISY", role: "Entry Fragger", icon: "⚡", color: "#00ff88", image: "/DRS ESPORTS/noisy n (3).png" },
            { name: "AKOJI", role: "Support", icon: "🛡️", color: "#00ff88", image: "/DRS ESPORTS/AKOS (3).png" },
            { name: "DRS ZEN", role: "Sub", icon: "🧩", color: "#00ff88", image: "/DRS ESPORTS/DRS ZEN (1).jpg" },
          ],
        },
      ],
    },
    {
      name: "DRS KIND",
      role: "Team Support",
      icon: "🤝",
      color: "#9b59b6",
      children: [
        { name: "DRS ASHI", role: "Strategy", icon: "📋", color: "#9b59b6" },
        { name: "DRS KAOSPY", role: "Data", icon: "📊", color: "#9b59b6" },
        { name: "DRS SHARATH", role: "Fitness", icon: "💪", color: "#9b59b6" },
        { name: "DRS BRITS", role: "Mental Coach", icon: "🧠", color: "#9b59b6" },
      ],
    },
  ],
};

function TreeNode({ node, level = 0, onNodeClick, selectedNode }) {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode?.name === node.name && selectedNode?.role === node.role;
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

  const getFilteredHierarchy = () => {
    if (filter === "all") return teamHierarchy;

    const byName = (n) => (n?.name || "").toLowerCase();

    const keepNode = (node) => {
      if (!node) return false;
      const name = byName(node);

      if (filter === "esports") {
        return name.includes("drs esports") || name.includes("pubg");
      }

      if (filter === "support") {
        return name.includes("leadership") || name.includes("support staff") || name.includes("support");
      }

      return true;
    };

    const cloneFiltered = (node) => {
      if (!node) return null;
      const children = (node.children || [])
        .map(cloneFiltered)
        .filter(Boolean);

      // keep node if it matches OR it has any kept children
      if (!keepNode(node) && children.length === 0) return null;

      return { ...node, children };
    };

    // Always keep root, but filter its children
    const filteredChildren = (teamHierarchy.children || [])
      .map(cloneFiltered)
      .filter(Boolean);

    return { ...teamHierarchy, children: filteredChildren };
  };

  return (
    <section className="team-tree" style={{ 
      padding: "80px 10px 40px", 
      background: "var(--gradient-dark)",
      minHeight: "100vh",
      overflowX: "auto",
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
          node={getFilteredHierarchy()} 
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
        />
      </div>

      {/* Selected Node Details Panel - Modal Style */}
      <AnimatePresence>
        {selectedNode && (
          <>
            {/* Modal Overlay */}
            <motion.div
              className="tree-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                zIndex: 9999,
              }}
            />
            {/* Modal Container */}
            <motion.div
              className="tree-modal"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#0a0f18",
                borderRadius: "16px",
                maxWidth: "400px",
                width: "100%",
                maxHeight: "85vh",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
                position: "fixed",
                inset: 0,
                margin: "auto",
                zIndex: 10000,
              }}
            >
              {/* Modal Content - Scrollable */}
              <div style={{
                padding: "24px",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}>
                {/* Avatar */}
                <div style={{
                  fontSize: "56px",
                  marginBottom: "15px",
                  filter: `drop-shadow(0 0 15px ${selectedNode.color})`,
                }}>
                  {selectedNode.image ? (
                    <img 
                      src={selectedNode.image} 
                      alt={selectedNode.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `3px solid ${selectedNode.color}`,
                      }}
                    />
                  ) : (
                    selectedNode.icon
                  )}
                </div>
                
                {/* Name */}
                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "22px",
                  color: selectedNode.color,
                  marginBottom: "8px",
                }}>
                  {selectedNode.name}
                </h3>
                
                {/* Role */}
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginBottom: "15px",
                }}>
                  {selectedNode.role}
                </p>
                
                {/* Additional Info */}
                {selectedNode.children && (
                  <p style={{
                    color: "var(--text-light)",
                    fontSize: "12px",
                  }}>
                    {selectedNode.children.length} team members
                  </p>
                )}
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedNode(null)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "none",
                    background: "var(--secondary)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              </div>
            </motion.div>
          </>
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
