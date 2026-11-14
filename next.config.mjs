/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Old URLs keep working: the portfolio page became /about and the blog became /notes.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/about", permanent: true },
      { source: "/blog", destination: "/notes", permanent: true },
      { source: "/blog/:slug", destination: "/notes/:slug", permanent: true },
    ];
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
