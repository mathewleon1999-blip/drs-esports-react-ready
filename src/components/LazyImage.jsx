import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function LazyImage({ 
  src, 
  alt, 
  className, 
  style,
  placeholderColor = "#1a1f2e",
  aspectRatio = "16/9"
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
        backgroundColor: placeholderColor,
        aspectRatio: aspectRatio,
      }}
    >
      {/* Placeholder shimmer effect */}
      {!isLoaded && (
        <motion.div
          animate={{
            backgroundPosition: ["200% 0", "-200% 0"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 212, 255, 0.1) 50%,
              transparent 100%
            )`,
            backgroundSize: "200% 100%",
          }}
        />
      )}

      {/* Actual image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}

      {/* Loaded indicator */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
          }}
        />
      )}
    </div>
  );
}

export default LazyImage;
