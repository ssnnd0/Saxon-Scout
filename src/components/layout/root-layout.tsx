// src/components/layout/root-layout.tsx
import React from "react";
import { NavBar } from "./nav-bar";
import { MobileNav } from "./mobile-nav";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex min-h-screen flex-col">
        <NavBar className="hidden md:flex" />
        <MobileNav className="md:hidden" />
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};