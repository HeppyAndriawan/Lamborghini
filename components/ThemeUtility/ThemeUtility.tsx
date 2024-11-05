"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";

interface ThemeUtilityProps {
  children: ReactNode;
}
export default function ThemeUtility({ children }: ThemeUtilityProps) {
  // Theme setup
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
