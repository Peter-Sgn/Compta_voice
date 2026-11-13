import type { ReactNode } from "react";
import { TabBar } from "@/components/layout/tab-bar";
import { OfflineBanner } from "@/components/layout/offline-banner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex justify-center bg-border">
      <div className="w-full max-w-[480px] min-h-dvh flex flex-col bg-bg border-x border-border shadow-soft relative">
        <OfflineBanner />
        <main
          className="flex-1"
          style={{
            paddingBottom: "calc(7rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          {children}
        </main>
        <TabBar />
      </div>
    </div>
  );
}
