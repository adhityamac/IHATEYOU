/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'api.dicebear.com',
            'picsum.photos',
            'grainy-gradients.vercel.app'
        ],
    },
    // Enable strict mode to catch side-effect bugs
    reactStrictMode: true,

    // Optimize for production
    swcMinify: true,
};

export default nextConfig;
