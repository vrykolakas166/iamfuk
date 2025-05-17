'use client';

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Icon } from "@iconify/react";
import { PageLayout } from "@/components/page-layout";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        setError('Failed to load profile information');
      } else {
        setUser(user);
      }
      setLoading(false);
    });
  }, []);

  const userInfo = user ? [
    { label: 'Email', value: user.email, icon: 'mdi:email' },
    { label: 'User ID', value: user.id, icon: 'mdi:identifier' },
    { label: 'Last Sign In', value: new Date(user.last_sign_in_at || '').toLocaleString(), icon: 'mdi:clock-outline' },
    { label: 'Created At', value: new Date(user.created_at).toLocaleString(), icon: 'mdi:calendar' },
  ] : [];

  return (
    <PageLayout
      title="Profile Information"
      icon="mdi:account"
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        {userInfo.map((info) => (
          <div key={info.label} className="flex items-start gap-4 p-4 rounded-lg bg-foreground/5">
            <Icon icon={info.icon} className="w-5 h-5 mt-1 text-foreground/60" />
            <div>
              <div className="text-sm text-foreground/60">{info.label}</div>
              <div className="font-medium">{info.value}</div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
} 