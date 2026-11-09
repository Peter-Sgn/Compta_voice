import type { ReactNode } from "react";
import { TabBar } from "@/components/layout/tab-bar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <div className="flex-1 pb-28">{children}</div>
      <TabBar />
    </div>
  );
}

