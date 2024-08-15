'use client';

import { ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { client } from '@/libs/client';

const UNAUTHORIZED = 401;

interface AuthContextProps {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextProps>({
  token: '',
  setToken: () => null,
});

export function Providers({ children }: PropsWithChildren) {
  const [token, setToken] = useLocalStorage('token', '');

  const authorization = token ? `Bearer ${token}` : '';

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization,
    },
  }));

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ extensions }) => {
        if (
          (extensions?.originalError as { statusCode?: number })?.statusCode ===
          UNAUTHORIZED
        )
          setToken('');
      });
  });

  client.setLink(errorLink.concat(authLink.concat(client.link)));

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
}
