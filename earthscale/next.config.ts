import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 90 for pictures whose source is small to begin with (the reveal deck's
  // moodboard), so the optimizer doesn't soften them further.
  images: { qualities: [75, 90] },
};

export default nextConfig;
