import type { NextConfig } from "next";

// Cabeceras mínimas de seguridad, indispensables para producción — no
// optimización cosmética. No incluye Content-Security-Policy todavía: una
// CSP mal calibrada rompe silenciosamente Tailwind/scripts inline, y
// afinarla bien es un esfuerzo aparte documentado como pendiente.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@kairos/types", "@kairos/ui", "@kairos/database", "@kairos/scoring-engine"],
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
