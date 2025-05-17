'use client';

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageLayout } from "@/components/page-layout";

// Sample data - in real app, this would come from an API
const sampleSettings = [
  {
    id: 1,
    title: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your account',
    icon: 'mdi:shield-lock',
    enabled: false,
  },
  {
    id: 2,
    title: 'Login Notifications',
    description: 'Get notified when someone logs into your account',
    icon: 'mdi:bell-ring',
    enabled: true,
  },
  {
    id: 3,
    title: 'Password Change',
    description: 'Last changed 30 days ago',
    icon: 'mdi:key',
    enabled: true,
  },
  {
    id: 4,
    title: 'Active Sessions',
    description: '2 devices currently logged in',
    icon: 'mdi:devices',
    enabled: true,
  },
];

export default function SecurityPage() {
  const [settings, setSettings] = useState<typeof sampleSettings>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchSettings = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setSettings(sampleSettings);
        setLoading(false);
      } catch (err) {
        setError('Failed to load security settings');
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (id: number) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const helpButton = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon icon="mdi:help-circle" className="w-5 h-5" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Security Settings Help</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-foreground/60">
            Manage your account security settings here. Enable two-factor authentication for extra security,
            set up login notifications, and monitor active sessions.
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-foreground/60">
              Adds an extra layer of security by requiring a second form of verification when logging in.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Login Notifications</h4>
            <p className="text-sm text-foreground/60">
              Receive notifications when someone logs into your account from a new device.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <PageLayout
      title="Security Settings"
      icon="mdi:shield-account"
      loading={loading}
      error={error}
      headerAction={helpButton}
    >
      {settings.length === 0 ? (
        <div className="text-center text-foreground/60 py-8">
          No security settings available
        </div>
      ) : (
        <div className="space-y-4">
          {settings.map((setting) => (
            <div 
              key={setting.id} 
              className="flex items-start gap-4 p-4 rounded-lg bg-foreground/5"
            >
              <div className="p-2 rounded-lg bg-foreground/5">
                <Icon icon={setting.icon} className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{setting.title}</div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => handleToggle(setting.id)}
                  />
                </div>
                <div className="text-sm text-foreground/60">{setting.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
} 