import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/openapi', '@repo/ui', '@repo/utils'],
};

export default nextConfig;
