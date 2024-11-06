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

  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker
  //       .register('/sw.js', { scope: '/' })
  //       .then((registration) => console.log('scope is: ', registration.scope));
  //   }
  // }, []);
  return (
    <div className="w-full relative overflow-hidden">
      <ThemeUtility>
        <Suspense>{children}</Suspense>
        <Toaster expand visibleToasts={9} />
      </ThemeUtility>
    </div>
  );
}
