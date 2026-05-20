import { applyDecorators } from '@nestjs/common';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_POLICIES } from './throttling.policies';

type ThrottlePolicyKey = keyof typeof THROTTLE_POLICIES;

function createThrottleDecorator(policyKey: ThrottlePolicyKey, description: string) {
  const policy = THROTTLE_POLICIES[policyKey];

  return applyDecorators(
    Throttle({
      default: {
        limit: policy.limit,
        ttl: policy.ttl,
      },
    }),
    ApiTooManyRequestsResponse({ description }),
  );
}

export function ThrottlePublicAuth() {
  return createThrottleDecorator('publicAuth', 'Too many attempts. Please try again later.');
}

export function ThrottleStandard() {
  return createThrottleDecorator('standard', 'Too many requests. Please try again later.');
}

export function ThrottleSensitive() {
  return createThrottleDecorator('sensitive', 'Too many requests. Please try again later.');
}
