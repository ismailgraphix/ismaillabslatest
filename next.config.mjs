import { execSync } from "node:child_process";

// The footer's build line (components/BuildLine.tsx) shows the commit and the
// date of the build it came from. Both are read here, once, at build time, and
// inlined into the client bundle; nobody types them by hand. Vercel provides
// the commit hash; locally it comes from git.
function buildCommit() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_COMMIT: buildCommit(),
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
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
    // after an admin edit. See app/(main)/notes/[slug]/page.tsx etc.
    staleTimes: {
      dynamic: 0,
    },
  },
};
export default nextConfig;
