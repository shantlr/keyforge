import { cache } from 'react';
import { QueryClient } from 'react-query';

export const getQueryClient = cache(() => new QueryClient());
