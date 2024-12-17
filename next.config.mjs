/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      { protocol: "https", hostname: "zovjerepvhihsinoptph.supabase.co" },
    ],
  },
};

export default nextConfig;
