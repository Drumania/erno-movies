/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination:
          "https://wiremock.dev.eroninternational.com/api/movies/:path*",
      },
    ];
  },
};

export default nextConfig;
