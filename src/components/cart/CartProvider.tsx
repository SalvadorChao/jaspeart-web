"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import {
  CART_STORAGE_KEY,
  cartReducer,
  cartSubtotal,
  initialCartState,
  parseStoredCart,
  serializeCart,
  totalUnits,
  type CartItem,
  type CartProductSnapshot,
} from "@/lib/cart/cart";

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  totalUnits: number;
  subtotal: number;
  addItem: (product: CartProductSnapshot, quantity: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // localStorage only exists in the browser; the first render always matches the empty SSR cart.
  useEffect(() => {
    dispatch({ type: "hydrate", items: readStoredCart() });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state.items));
    } catch {
      // Storage can be unavailable (private mode, quota); the in-memory cart keeps working.
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      addItem: (product: CartProductSnapshot, quantity: number) => dispatch({ type: "add", product, quantity }),
      updateQuantity: (slug: string, quantity: number) => dispatch({ type: "update", slug, quantity }),
      removeItem: (slug: string) => dispatch({ type: "remove", slug }),
      clearCart: () => dispatch({ type: "clear" }),
    }),
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      hydrated: state.hydrated,
      totalUnits: totalUnits(state.items),
      subtotal: cartSubtotal(state.items),
      ...actions,
    }),
    [state, actions],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
