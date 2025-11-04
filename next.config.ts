import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Performance optimizations
  swcMinify: true,

  // Optimize imports and reduce bundle size
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-icons",
      "@clerk/nextjs",
      "date-fns",
    ],
    // Enable optimized CSS loading
    optimizeCss: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fjx9bnquc2tue55g.public.blob.vercel-storage.com",
      },
    ],
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
};
export default nextConfig;
