/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Usamos API_URL sin el prefijo PUBLIC para que sea interna del servidor
    const apiBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    return [
      {
        source: "/api-proxy/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "upgrade-insecure-requests",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
