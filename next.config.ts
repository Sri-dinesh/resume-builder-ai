import type { NextConfig } from "next";
import withBundleAnalyzerBase from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerBase({
  enabled: process.env.ANALYZE === "true",
}) as (config: NextConfig) => NextConfig;

const nextConfig: NextConfig = {
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize imports and reduce bundle size
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
    "@tabler/icons-react": {
      transform: "@tabler/icons-react/dist/esm/icons/{{member}}",
    },
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
    lodash: {
      transform: "lodash/{{member}}",
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
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@clerk/nextjs",
      "date-fns",
      "@tabler/icons-react",
      "react-icons",
      "recharts",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
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
    // Optimize image caching
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Add cache headers for better performance
  async headers() {
    return [
      {
        source: "/:path*.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.css",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize chunks in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // Separate vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10,
            },
            // Separate heavy libraries
            pdfLib: {
              test: /[\\/]node_modules[\\/](@react-pdf|pdfjs-dist|pdf-parse)[\\/]/,
              name: "pdf-lib",
              chunks: "all",
              priority: 20,
            },
            richText: {
              test: /[\\/]node_modules[\\/](@tiptap)[\\/]/,
              name: "rich-text",
              chunks: "all",
              priority: 20,
            },
            dndKit: {
              test: /[\\/]node_modules[\\/](@dnd-kit)[\\/]/,
              name: "dnd-kit",
              chunks: "all",
              priority: 20,
            },
            charts: {
              test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
              name: "charts",
              chunks: "all",
              priority: 20,
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/](framer-motion|motion)[\\/]/,
              name: "framer-motion",
              chunks: "all",
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
