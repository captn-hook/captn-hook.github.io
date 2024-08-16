/** @type {import('next').NextConfig} */
const nextConfig = {
    // GH Pages is serveless
    output: "export",
    images: {
      unoptimized: true,
    },
  };
  
  export default nextConfig;