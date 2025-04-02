import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fjx9bnquc2tue55g.public.blob.vercel-storage.com",
      },
    ],
  },
};
export default nextConfig;
