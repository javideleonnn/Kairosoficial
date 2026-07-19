import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kairos CRM",
  description: "Gestión de leads de Mapa Kairos hacia Club Kairos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
