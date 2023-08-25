'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

export const QueryProvider = ({ children }: PropsWithChildren) => {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
