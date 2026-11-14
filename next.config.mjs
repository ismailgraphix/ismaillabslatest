/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['html.ravextheme.com'],
    unoptimized: true,
  },
  experimental: {
    // Prevent the client-side Router Cache from serving stale content on soft
    // navigation (clicking a <Link>) for dynamically-rendered routes right
    // after an admin edit. See app/(main)/blog/[slug]/page.tsx etc.
    staleTimes: {
      dynamic: 0,
    },
  },
};
export default nextConfig;
