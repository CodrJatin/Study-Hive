import { HiveRole } from "@prisma/client";

// Hierarchy mapping for easy comparison
const ROLE_WEIGHT: Record<HiveRole, number> = {
    ADMIN: 4,
    MODERATOR: 3,
    MEMBER: 2,
    VIEWER: 1,
};

export const Permissions = {
    canManageHive: (role: HiveRole) => ROLE_WEIGHT[role] >= ROLE_WEIGHT.ADMIN,

    canAddItems: (role: HiveRole) => ROLE_WEIGHT[role] >= ROLE_WEIGHT.MEMBER,

    canEditOrDeleteAnyItem: (role: HiveRole) => ROLE_WEIGHT[role] >= ROLE_WEIGHT.MODERATOR,

    // The specific logic for Members editing their own stuff
    canEditOrDeleteItem: (role: HiveRole, itemOwnerId: string | null, currentUserId: string) => {
        if (ROLE_WEIGHT[role] >= ROLE_WEIGHT.MODERATOR) return true;
        if (role === "MEMBER" && itemOwnerId === currentUserId) return true;
        return false;
    },

    // Role Management Logic
    canManageRole: (currentRole: HiveRole, targetUserRole: HiveRole) => {
        // Admins can manage anyone below them
        if (currentRole === "ADMIN" && targetUserRole !== "ADMIN") return true;
        // Mods can only manage Members and Viewers
        if (currentRole === "MODERATOR" && (targetUserRole === "MEMBER" || targetUserRole === "VIEWER")) return true;
        return false;
    }
};