import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

function getApiOrigin(): string | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return null;
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    return null;
  }
}

function createContentSecurityPolicy(): string {
  const connectSources = ["'self'"];
  const apiOrigin = getApiOrigin();

  if (apiOrigin) {
    connectSources.push(apiOrigin);
  }

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `connect-src ${connectSources.join(' ')}`,
    'upgrade-insecure-requests',
  ];

  return directives.join('; ');
}

function createSecurityHeaders() {
  const headers = [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), geolocation=(), microphone=()',
    },
  ];

  if (isProduction) {
    headers.push(
      {
        key: 'Content-Security-Policy',
        value: createContentSecurityPolicy(),
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
    );
  }

  return headers;
}

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/openapi'],
  headers() {
    return [
      {
        source: '/:path*',
        headers: createSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
