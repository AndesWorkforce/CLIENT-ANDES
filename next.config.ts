import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Output standalone para imágenes Docker mucho más livianas
  output: "standalone",
  experimental: {
    serverActions: {
      // Red de seguridad (Nginx front ya tiene 50M). Las subidas grandes van por axios al API.
      bodySizeLimit: "50mb",
    },
  },
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
