import { createFileRoute, redirect } from '@tanstack/react-router';
import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Table, Tbody, Td, Th, Thead, Tr } from '../components/ui/table.js';
import { Button } from '../components/ui/button.js';
import { apiFetch } from '../lib/api.js';
import { meQueryOptions } from '../lib/auth.js';
import type { User, UserRole } from '../lib/types.js';
import { format } from '../utils/format.js';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(meQueryOptions).catch(() => undefined);
    if (!user) {
      throw redirect({ to: '/' });
    }
    if (user.role !== 'admin') {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: Admin,
});

async function fetchUsers() {
  return apiFetch<User[]>('/admin/users');
}

function Admin() {
  const queryClient = useQueryClient();
  const { data: users } = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const mutation = useMutation(
    async ({ id, role }: { id: string; role: UserRole }) => apiFetch<User>(`/admin/users/${id}/role`, { method: 'PATCH', json: { role } }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['me'] });
      },
    },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-slate-400">Manage users and roles.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((u) => (
                <Tr key={u.id}>
                  <Td>{u.email}</Td>
                  <Td className="capitalize">{u.role}</Td>
                  <Td>{format.dateTime(u.createdAt)}</Td>
                  <Td className="space-x-2">
                    <Button
                      size="sm"
                      variant={u.role === 'admin' ? 'default' : 'outline'}
                      onClick={() => mutation.mutate({ id: u.id, role: 'admin' })}
                      disabled={mutation.isPending || u.role === 'admin'}
                    >
                      Make admin
                    </Button>
                    <Button
                      size="sm"
                      variant={u.role === 'user' ? 'default' : 'outline'}
                      onClick={() => mutation.mutate({ id: u.id, role: 'user' })}
                      disabled={mutation.isPending || u.role === 'user'}
                    >
                      Make user
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
