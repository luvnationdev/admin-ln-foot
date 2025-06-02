// components/AppSetup.tsx
"use client";

import { useEffect } from 'react';
import { registerAuthInterceptor } from '@/lib/api-client/auth-interceptor'; // Adjust path if necessary

export function AppSetup() {
  useEffect(() => {
    registerAuthInterceptor();
    // If you had an eject function and wanted to use it on cleanup:
    // return () => {
    //   ejectAuthInterceptor();
    // };
  }, []); // Empty dependency array ensures this runs once on mount

  return null; // This component does not render anything
}
