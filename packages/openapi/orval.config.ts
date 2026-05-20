import { defineConfig } from 'orval';
import { createOrvalConfig } from './src/create-orval-config';

export default defineConfig({
  starter: createOrvalConfig({
    inputTarget: '../../apps/api/swagger-spec.json',
    outputTarget: './src/generated.ts',
    outputApiClientPath: './src/api-client.ts',
  }),
});
