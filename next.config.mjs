/** @type {import('next').NextConfig} */
const nextConfig = {
    // GH Pages is serveless
    output: "export",
    basePath: "/pages",
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;