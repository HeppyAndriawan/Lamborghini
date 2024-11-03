"use client";
import React, { ReactNode, Suspense } from "react";
import ThemeUtility from "@/components/HomeLanding/ThemeUtility/ThemeUtility";
import { Toaster } from "@/components/ui/sonner"

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <div className="w-full relative overflow-hidden">
      <ThemeUtility>
        <Suspense>{children}</Suspense>
        <Toaster expand visibleToasts={9}/>
      </ThemeUtility>
    </div>
  );
}
