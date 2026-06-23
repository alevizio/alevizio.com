import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // The case study moved off the guessable /work/messa path.
        source: "/work/messa",
        destination: "/story",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
