import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = isGithubActions ? 'FlyingBird' : '';
const path = process.env.NODE_ENV === "development" ? undefined : repo;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGithubActions? 'export' : undefined, //change to 'undefined' for development
  basePath: ``, //change to '' for development
  assetPrefix: `/${path}`,//change to '' for development
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "heppyandriawan.github.io",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
