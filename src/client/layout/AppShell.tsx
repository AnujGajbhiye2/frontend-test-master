import React from "react";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-800">Query Builder</h1>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
};

export default AppShell;
