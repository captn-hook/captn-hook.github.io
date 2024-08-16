/** @type {import('next').NextConfig} */
const nextConfig = {
    // GH Pages is serveless
    output: "export",
    basePath: "/captn-hook.github.io",
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;