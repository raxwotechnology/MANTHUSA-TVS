"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

/**
 * Dashboard layout — forces dark mode regardless of public site preference.
 * Saves the current theme on mount, sets dark, and restores when leaving.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme();
  const previousTheme = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Save whatever the user had before entering the dashboard
    previousTheme.current = theme;
    setTheme("dark");

    return () => {
      // Restore when navigating away from dashboard
      if (previousTheme.current && previousTheme.current !== "dark") {
        setTheme(previousTheme.current);
      }
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
