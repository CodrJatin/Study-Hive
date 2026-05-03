"use client";

import { createContext, useContext } from "react";
import type { HiveRole } from "@/types/client-prisma";

interface HiveContextType {
    role: HiveRole;
    userId: string;
    hiveId: string;
}

export const HiveContext = createContext<HiveContextType | null>(null);

export const useHiveContext = () => {
    const context = useContext(HiveContext);
    if (!context) throw new Error("useHiveContext must be used within HiveProvider");
    return context;
};

export const HiveProvider = ({
    children,
    role,
    userId,
    hiveId,
}: {
    children: React.ReactNode;
    role: HiveRole;
    userId: string;
    hiveId: string;
}) => {
    // NOTE: Realtime subscriptions are NOT embedded here.
    // Membership changes should be listened to only on routes that display
    // membership data (e.g. settings page has its own <RealtimeListener>).
    // Embedding useRealtime here would cause router.refresh() across the
    // entire hive subtree on every membership change.
    return (
        <HiveContext.Provider value={{ role, userId, hiveId }}>
            {children}
        </HiveContext.Provider>
    );
};
