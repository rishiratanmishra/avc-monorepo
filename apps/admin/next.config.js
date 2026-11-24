import process from "node:process";

const apiUpstream = process.env.API_UPSTREAM ?? "http://127.0.0.1:4000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/manage",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUpstream}/api/:path*`,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
