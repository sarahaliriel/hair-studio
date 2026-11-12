"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/shared/ui/PageTransition";

/** Signals a committed route, including its server-rendered page content. */
export default function RouteTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { ready } = usePageTransition();
  useLayoutEffect(() => { ready(pathname); }, [pathname, ready]);
  return children;
}
