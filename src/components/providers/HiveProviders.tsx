"use client";
import { createContext, useContext } from "react";
import { HiveRole } from "@prisma/client";
import { useRealtime } from "@/hooks/useRealtime";

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
    useRealtime("HiveMember", { column: "userId", value: userId });

    return (
        <HiveContext.Provider value={{ role, userId, hiveId }}>
            {children}
        </HiveContext.Provider>
    );
};