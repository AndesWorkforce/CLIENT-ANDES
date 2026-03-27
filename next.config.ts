import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "appwiseinnovations.dev",
        pathname: "/Andes/**",
      },
      {
        protocol: "https",
        hostname: "andes-workforce-s3.s3.us-east-2.amazonaws.com",
        pathname: "/clientes/**",
      },
      {
        protocol: "https",
        hostname: "andes-workforce-s3.s3.us-east-2.amazonaws.com",
        pathname: "/team/**",
      },
      {
        protocol: "https",
        hostname: "andes-workforce-s3.s3.us-east-2.amazonaws.com",
        pathname: "/images/**",
      },
    ],
    domains: ["appwiseinnovations.dev"],
  },
};

export default nextConfig;
