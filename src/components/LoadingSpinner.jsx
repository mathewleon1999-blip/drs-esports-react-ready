import { motion } from "framer-motion";

function LoadingSpinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#0a0e14"
    }}>
      <motion.div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "3px solid transparent",
          borderTopColor: "#00d4ff",
          borderRightColor: "#00d4ff",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
