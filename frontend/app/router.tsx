import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createBrowserHistory, createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  const queryClient = new QueryClient();
  const history = typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory();

  return createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    history,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
