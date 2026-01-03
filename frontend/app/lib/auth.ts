import { QueryClient, queryOptions } from '@tanstack/react-query';
import { apiFetch } from './api.js';
import type { User } from './types.js';

export const meQueryOptions = queryOptions<User, Error>({
  queryKey: ['me'],
  queryFn: () => apiFetch<User>('/me'),
  staleTime: 1000 * 60,
});

export async function requireUser(queryClient: QueryClient) {
  try {
    return await queryClient.ensureQueryData(meQueryOptions);
  } catch (error) {
    throw error;
  }
}
