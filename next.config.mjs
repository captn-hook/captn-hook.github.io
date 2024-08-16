/** @type {import('next').NextConfig} */
const nextConfig = {
    // GH Pages is serveless
    output: "export",
    basePath: "/gh-page",
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;