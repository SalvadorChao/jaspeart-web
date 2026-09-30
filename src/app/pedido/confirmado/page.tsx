import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = { title: "Pedido confirmado" };

export default function OrderConfirmedPage() {
  return (
    <div className="mx-auto max-w-page px-gutter pb-section">
      <OrderConfirmation />
    </div>
  );
}
