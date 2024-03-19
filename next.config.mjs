/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.ctfassets.net'],
        remotePatterns: [
        {
            protocol:'https',
            hostname:'lh3.googleusercontent.com',
            port:"",
            pathname:"/a/**",
        }
        ]
     }
};

export default nextConfig;
