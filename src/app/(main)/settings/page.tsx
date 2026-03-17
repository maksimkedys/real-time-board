import { ProfileSettingsCard } from '@/features/settings/ui/profile-settings-card';
import { DangerZoneCard } from '@/features/settings/ui/danger-zone-card';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <ProfileSettingsCard />

        <DangerZoneCard />
      </div>
    </div>
  );
}
