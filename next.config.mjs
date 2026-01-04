import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'api.dicebear.com',
            'picsum.photos',
            'grainy-gradients.vercel.app'
        ],
        formats: ['image/webp', 'image/avif'], // Enable modern formats
    },
    // Enable strict mode to catch side-effect bugs
    reactStrictMode: true,

    // Optimize for production
    swcMinify: true,

    // Experimental features for better performance
    experimental: {
        optimizeCss: true, // Enable CSS optimization
    },

    // Compiler options
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production', // Remove console.logs in production
    },
};

// Bundle analyzer configuration
const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
