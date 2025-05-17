"use client";

import { Outlet } from '@tanstack/react-router';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/trpc';

export function RootRouteComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
