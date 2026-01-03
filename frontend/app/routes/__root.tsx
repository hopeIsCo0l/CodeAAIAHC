import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Button } from '../components/ui/button.js';
import { apiFetch } from '../lib/api.js';
import { meQueryOptions } from '../lib/auth.js';
import type { User } from '../lib/types.js';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    // Preload session for faster nav; ignore errors on public pages
    if (location.pathname !== '/') {
      try {
        await context.queryClient.ensureQueryData(meQueryOptions);
      } catch (err) {
        throw redirect({ to: '/', search: { from: location.pathname } });
      }
    }
  },
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const user = queryClient.getQueryData<User | undefined>(['me']);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950 text-foreground">
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="container flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-lg font-semibold">
                Session Auth
              </Link>
              <nav className="flex items-center gap-3 text-sm text-slate-300">
                {user ? (
                  <>
                    <Link to="/dashboard" className="hover:text-white">
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="hover:text-white">
                        Admin
                      </Link>
                    )}
                  </>
                ) : null}
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              {user ? (
                <>
                  <span className="text-slate-400">{user.email}</span>
                  <form
                    action="/"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await apiFetch('/auth/logout', { method: 'POST' });
                      queryClient.removeQueries({ queryKey: ['me'] });
                      window.location.href = '/';
                    }}
                  >
                    <Button type="submit" variant="outline">
                      Logout
                    </Button>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        </header>
        <main className="container py-8">
          <Outlet />
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
