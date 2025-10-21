import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname:
          "/gh/PokeMiners/pogo_assets@master/Images/Pokemon%20-%20256x256/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname:
          "/PokeMiners/pogo_assets/master/Images/Pokemon%20-%20256x256/**",
      },
    ],
    // Reduce transformations by limiting formats to webp only
    formats: ["image/webp"],
    // Limit device sizes to common breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200],
    // Limit image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Set cache to 31 days to reduce transformations
    minimumCacheTTL: 2678400,
    // Limit quality variations
    dangerouslyAllowSVG: false,
  },
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
