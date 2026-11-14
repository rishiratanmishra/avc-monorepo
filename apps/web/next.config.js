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
};

export default nextConfig;
