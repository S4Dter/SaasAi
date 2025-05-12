'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const userSession = localStorage.getItem('user');
    if (!userSession) {
      router.replace(ROUTES.AUTH.SIGNIN);
      return;
    }

    try {
      const user = JSON.parse(userSession);
      if (user.role === 'admin') {
        router.replace(ROUTES.DASHBOARD.ADMIN.ROOT);
      } else if (user.role === 'creator') {
        router.replace(ROUTES.DASHBOARD.CREATOR.ROOT);
      } else if (user.role === 'enterprise') {
        router.replace(ROUTES.DASHBOARD.ENTERPRISE.ROOT);
      } else {
        router.replace(ROUTES.AUTH.SIGNIN);
      }
    } catch (e) {
      router.replace(ROUTES.AUTH.SIGNIN);
    }
  }, [router]);

  return <div className="p-8">Redirection en cours...</div>;
}
