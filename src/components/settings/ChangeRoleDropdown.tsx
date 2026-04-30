"use client";

import React, { useTransition } from "react";
import { HiveRole } from "@prisma/client";
import { updateMemberRole } from "@/actions/hive";
import { toast } from "sonner";
import { useHiveContext } from "@/components/providers/HiveProviders";
import { Permissions } from "@/lib/permissions";
import { Dropdown, DropdownOption } from "@/components/shared/Dropdown";

interface ChangeRoleDropdownProps {
  hiveId: string;
  memberId: string;
  currentRole: HiveRole;
}

export function ChangeRoleDropdown({ hiveId, memberId, currentRole }: ChangeRoleDropdownProps) {
  const [isPending, startTransition] = useTransition();
  const { role: currentUserRole } = useHiveContext();

  // If the target is an ADMIN, no one can change their role (must be passed/left)
  if (currentRole === "ADMIN") {
    return (
      <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/10">
        Admin
      </div>
    );
  }

  // If the current user cannot manage the target's current role, just show the role as text
  if (!Permissions.canManageRole(currentUserRole, currentRole)) {
    return (
      <div className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-wider border border-outline-variant/10">
        {currentRole.replace("_", " ")}
      </div>
    );
  }

  const handleChange = (newRole: string) => {
    const role = newRole as HiveRole;
    if (role === currentRole) return;

    startTransition(() => {
      toast.promise(
        (async () => {
          const result = await updateMemberRole(hiveId, memberId, role);
          if (result?.error) throw new Error(result.error);
        })(),
        {
          loading: "Updating role...",
          success: "Role updated successfully!",
          error: (err: Error) => err.message || "Failed to update role",
        }
      );
    });
  };

  const roleOptions: DropdownOption[] = [];
  
  if (Permissions.canManageRole(currentUserRole, "MODERATOR")) {
    roleOptions.push({ id: "MODERATOR", title: "Moderator", icon: "shield_person", subtext: "Can manage content and members." });
  }
  if (Permissions.canManageRole(currentUserRole, "MEMBER")) {
    roleOptions.push({ id: "MEMBER", title: "Member", icon: "person", subtext: "Standard access to view and interact." });
  }
  if (Permissions.canManageRole(currentUserRole, "VIEWER")) {
    roleOptions.push({ id: "VIEWER", title: "View Only", icon: "visibility", subtext: "Can view content but cannot interact." });
  }

  return (
    <div className="w-48">
      <Dropdown
        options={roleOptions}
        value={currentRole}
        onChange={handleChange}
        disabled={isPending}
      />
    </div>
  );
}
