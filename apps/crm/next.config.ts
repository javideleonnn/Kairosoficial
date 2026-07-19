import type { NextConfig } from "next";

// Cabeceras mínimas de seguridad. X-Robots-Tag es específico de esta app:
// el CRM es privado, nunca debe aparecer en buscadores.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@kairos/types", "@kairos/ui", "@kairos/database", "@kairos/scoring-engine"],
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
