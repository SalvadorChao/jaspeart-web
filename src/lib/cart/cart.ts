// Client-side cart for the V1 demo. Prices and stock are snapshots of MOCK catalog data;
// a real checkout must revalidate both on the server.

export const CART_STORAGE_KEY = "jaspeart-cart-v1";
const CART_VERSION = 1;

export type CartItem = {
  slug: string;
  erpCode: string;
  name: string;
  format: string;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
};

export type CartProductSnapshot = Omit<CartItem, "quantity">;

export type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

export type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; product: CartProductSnapshot; quantity: number }
  | { type: "update"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

export const initialCartState: CartState = { items: [], hydrated: false };

export function clampQuantity(quantity: number, stockQuantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(Math.max(1, Math.floor(quantity)), stockQuantity);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };

    case "add": {
      const { product } = action;
      if (product.stockQuantity <= 0) return state;
      const existing = state.items.find((item) => item.slug === product.slug);
      if (existing) {
        const quantity = clampQuantity(existing.quantity + action.quantity, product.stockQuantity);
        if (quantity === existing.quantity) return state;
        return {
          ...state,
          items: state.items.map((item) =>
            item.slug === product.slug ? { ...item, ...product, quantity } : item,
          ),
        };
      }
      const quantity = clampQuantity(action.quantity, product.stockQuantity);
      return { ...state, items: [...state.items, { ...product, quantity }] };
    }

    case "update":
      return {
        ...state,
        items: state.items.map((item) =>
          item.slug === action.slug
            ? { ...item, quantity: clampQuantity(action.quantity, item.stockQuantity) }
            : item,
        ),
      };

    case "remove":
      return { ...state, items: state.items.filter((item) => item.slug !== action.slug) };

    case "clear":
      return state.items.length === 0 ? state : { ...state, items: [] };
  }
}

export function totalUnits(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// Display-only total; never trust a browser-computed amount for a real order.
export function cartSubtotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100) / 100;
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === "string" &&
    typeof v.erpCode === "string" &&
    typeof v.name === "string" &&
    typeof v.format === "string" &&
    typeof v.unitPrice === "number" &&
    typeof v.quantity === "number" &&
    typeof v.stockQuantity === "number"
  );
}

export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return [];
    const { version, items } = data as { version?: unknown; items?: unknown };
    if (version !== CART_VERSION || !Array.isArray(items)) return [];
    return items
      .filter(isCartItem)
      .filter((item) => item.stockQuantity > 0)
      .map((item) => ({ ...item, quantity: clampQuantity(item.quantity, item.stockQuantity) }));
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItem[]): string {
  return JSON.stringify({ version: CART_VERSION, items });
}
