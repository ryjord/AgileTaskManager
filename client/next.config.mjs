console.log('next.config.mjs is being executed');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400 // 1 day cache
  },
  experimental: {
    optimizeFonts: false,
  },
};

export default nextConfig;