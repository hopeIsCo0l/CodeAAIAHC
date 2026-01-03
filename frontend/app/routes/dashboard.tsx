import { createFileRoute, redirect } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { meQueryOptions } from '../lib/auth.js';
import { format } from '../utils/format.js';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions);
    } catch (err) {
      throw redirect({ to: '/' });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const { data: me } = useSuspenseQuery(meQueryOptions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-400">Authenticated via HTTP-only session cookie.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-200">
          <div className="flex items-center justify-between"><span>Email</span><span className="font-medium">{me.email}</span></div>
          <div className="flex items-center justify-between"><span>Role</span><span className="font-medium capitalize">{me.role}</span></div>
          <div className="flex items-center justify-between"><span>Created</span><span>{format.dateTime(me.createdAt)}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
