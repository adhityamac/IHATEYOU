/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'api.dicebear.com',
            'picsum.photos',
            'grainy-gradients.vercel.app'
        ],
    },
    // Disable strict mode for development to prevent double-rendering
    reactStrictMode: false,

    // Optimize for production
    swcMinify: true,
};

export default nextConfig;
