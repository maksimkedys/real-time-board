'use client';

import Image from 'next/image';
import { Camera, Loader2, Save } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { useProfileSettingsCard } from '../hooks/use-profile-settings-card';

export function ProfileSettingsCard() {
  const {
    profile,
    fullName,
    setFullName,
    isSavingName,
    isUploadingAvatar,
    fileInputRef,
    handleAvatarUpload,
    handleSaveProfile,
  } = useProfileSettingsCard();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          This is how others will see you on the board.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-primary/10">
            {isUploadingAvatar ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                fill
                sizes="(max-width: 768px) 80px, 80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-medium uppercase text-primary">
                {profile?.full_name?.charAt(0) ||
                  profile?.email?.charAt(0) ||
                  'U'}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              We support PNG, JPEG, or WEBP under 2MB.
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={profile?.full_name || 'John Doe'}
            className="max-w-md"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            value={profile?.email || ''}
            disabled
            className="max-w-md bg-muted/50"
          />
          <p className="text-[0.8rem] text-muted-foreground">
            Your email is used for login and cannot be changed here.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border bg-muted/20 px-6 py-4">
        <Button
          onClick={handleSaveProfile}
          disabled={isSavingName || fullName === profile?.full_name}
          className="gap-2"
        >
          {isSavingName ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
