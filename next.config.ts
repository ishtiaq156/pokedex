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
    ],
  },
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
