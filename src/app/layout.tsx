import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JaspeArt",
  description: "Ecommerce V0 de JaspeArt, especialista en Bellas Artes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
