import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

// Helper functions for localStorage
export const getWishlist = () => {
  const saved = localStorage.getItem("drs-wishlist");
  return saved ? JSON.parse(saved) : [];
};

export const saveWishlist = (wishlist) => {
  localStorage.setItem("drs-wishlist", JSON.stringify(wishlist));
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    return getWishlist();
  });

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, { ...product, addedAt: new Date().toISOString() }]);
      return true;
    }
    return false;
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const moveToCart = (productId, setCart, getCart, saveCart) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      const cart = getCart();
      const newItem = {
        ...product,
        cartId: Date.now(),
        size: "M",
        color: product.colors?.[0] || "Default"
      };
      const newCart = [...cart, newItem];
      setCart(newCart);
      saveCart(newCart);
      removeFromWishlist(productId);
    }
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    moveToCart,
    wishlistCount: wishlist.length,
    getWishlist,
    saveWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistContext;

