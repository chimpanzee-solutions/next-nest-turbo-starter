import type { Options } from 'orval';

export interface CreateOrvalConfigOptions {
  inputTarget: string;
  outputTarget: string;
  outputApiClientPath: string;
}

export function createOrvalConfig({
  inputTarget,
  outputTarget,
  outputApiClientPath,
}: CreateOrvalConfigOptions): Options {
  return {
    input: {
      target: inputTarget,
    },
    output: {
      mock: false,
      mode: 'single',
      target: outputTarget,
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          name: 'customClient',
          path: outputApiClientPath,
        },
      },
    },
  };
}
