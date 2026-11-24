import process from "node:process";

const apiUpstream = process.env.API_UPSTREAM ?? "http://127.0.0.1:4000";
const adminUpstream = process.env.ADMIN_UPSTREAM ?? "http://127.0.0.1:3002";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/service/:slug",
        destination: "/services",
        permanent: false,
      },
      {
        source: "/our-team-member",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/team-member/:slug*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/services",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const rewrites = [
      {
        source: "/api/:path*",
        destination: `${apiUpstream}/api/:path*`,
      },
    ];

    if (process.env.NODE_ENV !== "production") {
      rewrites.push(
        {
          source: "/manage",
          destination: `${adminUpstream}/manage`,
        },
        {
          source: "/manage/:path*",
          destination: `${adminUpstream}/manage/:path*`,
        },
      );
    }

    return rewrites;
  },
};

export default nextConfig;
