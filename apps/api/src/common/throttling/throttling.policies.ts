export const THROTTLE_POLICIES = {
  standard: {
    limit: 120,
    ttl: 60_000,
  },
  publicAuth: {
    limit: 5,
    ttl: 60_000,
  },
  sensitive: {
    limit: 20,
    ttl: 60_000,
  },
} as const;

export const THROTTLER_OPTIONS = {
  throttlers: [THROTTLE_POLICIES.standard],
};
