import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: './src/**/*.graphql',
  ignoreNoDocuments: true,
  generates: {
    './src/generated/generates.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
  config: {
    reactApolloVersion: 3,
    withHooks: true,
    exposeFetcher: true,
  },
};

export default config;
