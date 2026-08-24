"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      {/* key forces remount on route change */}
      <div key={pathname}>{children}</div>
    </AnimatePresence>
  );
}