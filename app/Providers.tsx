"use client";
import React, { ReactNode, Suspense, useEffect } from "react";
import ThemeUtility from "@/components/ThemeUtility/ThemeUtility";
import { Toaster } from "@/components/ui/sonner";
import $ from "jquery";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
      <ThemeUtility>
        <Suspense>{children}</Suspense>
        <Toaster expand visibleToasts={9} />
      </ThemeUtility>
    </div>
  );
}
