'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkPageAccess } from '@/app/actions';
import { PageLayout } from '@/components/layout/page-layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  pageKey: string;
}

export default function ProtectedRoute({ children, pageKey }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = await checkPageAccess(pageKey);
      setIsAuthorized(hasAccess);
    };

    checkAccess();
  }, [pageKey, router]);

  if (isAuthorized === null) {
    return (
      <PageLayout
        title="Checking Access"
        icon="mdi:shield-lock"
        loading={true}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-foreground/60">Verifying access permissions...</p>
        </div>
      </PageLayout>
    );
  }

  if (!isAuthorized) {
    return (
      <PageLayout
        title="Access Denied"
        icon="mdi:shield-lock"
        error="You don't have permission to access this page"
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-foreground/60">Please contact your administrator if you believe this is an error.</p>
        </div>
      </PageLayout>
    );
  }

  return <>{children}</>;
} 