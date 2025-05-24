'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, BadgeCheck, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { PageLayout } from '@/components/layout/page-layout';
import ProtectedRoute from '@/components/auth/protected-route';
import { ProjectManager } from '@/components/admin/project-manager';
import { TechStackManager } from '@/components/admin/techstack-manager';
import { getCurrentUserRoleAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const roleData = await getCurrentUserRoleAction();
      if (!roleData) throw new Error('No role found');

      setUser(user);
      setRole(roleData);
      setError(null);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute pageKey="RESTRICTED">
        <PageLayout title="Profile" icon="mdi:account">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-8 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute pageKey="RESTRICTED">
        <PageLayout title="Profile" icon="mdi:account">
          <Card className="border-red-500/20 bg-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-500">
                <User className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  const userInfo = [
    { label: 'Email', value: user.email },
    { label: 'Role', value: role?.name || 'No Role Assigned' },
    { label: 'Last Sign In', value: new Date(user.last_sign_in_at).toLocaleString() },
    { label: 'Created At', value: new Date(user.created_at).toLocaleString() }
  ];

  return (
    <ProtectedRoute pageKey="RESTRICTED">
      <PageLayout title="Profile" icon="mdi:account">
        <div className="space-y-8">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                      {info.label === 'Role' ? (
                        <Badge variant={role?.prority === 0 ? "default" : "secondary"}>
                          {info.value}
                        </Badge>
                      ) : (
                        <div className="font-medium">{info.value}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Section */}
          {role?.prority === 0 && (
            <div className="space-y-8">
              {/* Projects Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectManager />
                </CardContent>
              </Card>

              {/* Tech Stack Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Tech Stack Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <TechStackManager />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
} 