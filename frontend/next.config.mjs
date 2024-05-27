import * as path from "path";

const __dirname = import.meta.dirname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  distDir: "built/rentify",
  basePath: "/rentify",
  trailingSlash: true,
  generateEtags: false,
  // ^ next export HTML

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: true,

  swcMinify: true,
  sassOptions: { includePaths: [path.join(__dirname, "styles")] },
};

export default nextConfig;
