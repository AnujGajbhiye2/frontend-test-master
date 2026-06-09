import React from 'react';
import { Toaster } from '@/components/ui/sonner';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen bg-muted/40'>
      <header className='sticky top-0 z-10 border-b bg-background px-6 py-3'>
        <span className='text-xl font-semibold tracking-tight'>Query Builder</span>
      </header>
      <Toaster richColors position='top-center' />
      <main className='mx-auto px-6 py-8'>{children}</main>
    </div>
  );
};

export default AppShell;
