import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  // ─── Prevents XSS by whitelisting approved content sources ───────────────
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for critical CSS injection
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // React dev mode needs 'unsafe-eval' for call-stack debugging; stripped in prod
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      // Fonts: Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs (used by Next.js Image optimisation)
      "img-src 'self' data: blob:",
      // Fetch/XHR: self only (R2 calls go through our API route, not client)
      "connect-src 'self'",
      // Disallow all object/embed/frame sources
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },

  // ─── Blocks clickjacking by preventing your site being iframed ───────────
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },

  // ─── Stops browsers guessing file types (MIME sniffing) ──────────────────
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  // ─── Controls how much URL info is sent when navigating away ─────────────
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  // ─── Disables browser APIs this site doesn't need ────────────────────────
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
