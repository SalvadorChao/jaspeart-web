// DEMO ONLY. Replace with a server action → Prisma Order/OrderItem → payment gateway.
// A real order must recompute prices and stock on the server; nothing here is trusted.

import { cartSubtotal, type CartItem } from "@/lib/cart/cart";

const ORDER_STORAGE_KEY = "jaspeart-demo-order-v1";

export type DemoCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
};

export type DemoOrderLine = Pick<CartItem, "slug" | "name" | "format" | "unitPrice" | "quantity">;

// Only what the confirmation page displays is kept; the address never leaves the form.
export type DemoOrder = {
  orderNumber: string;
  createdAt: string;
  customer: Pick<DemoCustomer, "firstName" | "email">;
  items: DemoOrderLine[];
  subtotal: number;
};

export function createDemoOrder(items: CartItem[], customer: DemoCustomer): DemoOrder {
  return {
    orderNumber: `WEB-DEMO-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer: { firstName: customer.firstName, email: customer.email },
    items: items.map(({ slug, name, format, unitPrice, quantity }) => ({ slug, name, format, unitPrice, quantity })),
    subtotal: cartSubtotal(items),
  };
}

export function saveDemoOrder(order: DemoOrder): void {
  window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function readDemoOrderRaw(): string {
  try {
    return window.sessionStorage.getItem(ORDER_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseDemoOrder(raw: string): DemoOrder | null {
  try {
    const order = JSON.parse(raw) as DemoOrder;
    return typeof order?.orderNumber === "string" && Array.isArray(order.items) ? order : null;
  } catch {
    return null;
  }
}
