import { redirect } from 'next/navigation';
import { acceptWorkspaceInvite } from '@/features/workspaces/actions/workspace-invite.actions';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ token?: string; workspace?: string }>;
}

export default async function AcceptInvitePage({ searchParams }: PageProps) {
  const { token, workspace } = await searchParams;

  if (!token && !workspace) {
    redirect('/sign-in?error=missing-invite-params');
  }

  const result = await acceptWorkspaceInvite(token, workspace);

  if (result.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Invitation Error</h1>
          <p className="text-muted-foreground">{result.error}</p>
          <Link
            href="/"
            className="inline-block mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  redirect(result.workspaceId ? `/?workspace=${result.workspaceId}` : '/');
}
