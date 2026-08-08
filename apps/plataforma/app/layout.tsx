import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/cormorant-garamond/600.css";    

export const metadata: Metadata = {
  title: "Kairos",
  description: "Transforma tu vida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="min-h-screen text-white antialiased"
        style={{
          background: `
            radial-gradient(circle at 50% -10%, rgba(214,178,106,.10), transparent 25%),
            radial-gradient(circle at 15% 90%, rgba(33,63,104,.22), transparent 38%),
            radial-gradient(circle at 90% 85%, rgba(18,32,54,.28), transparent 42%),
            linear-gradient(180deg,#08111D 0%,#060C16 55%,#03060C 100%)
          `,
        }}
      >
        {children}
      </body>
    </html>
  );
}