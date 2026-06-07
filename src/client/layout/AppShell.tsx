import React from "react";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-background px-6 py-3">
        <span className="text-sm font-semibold tracking-tight">Query Builder</span>
      </header>
      <main className="mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default AppShell;
