import React, { Suspense } from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GeneralSettingsForm } from "@/components/settings/GeneralSettingsForm";
import { ManageInvitesAction } from "@/components/settings/ManageInvitesAction";
import { CopyInviteButton } from "@/components/settings/CopyInviteButton";
import { RemoveMemberButton } from "@/components/settings/RemoveMemberButton";
import { DeleteInviteButton } from "@/components/settings/DeleteInviteButton";
import { RealtimeListener } from "@/components/shared/RealtimeListener";
import { getHiveMembership } from "@/lib/session";
import { DangerZoneSettings } from "@/components/settings/DangerZoneSettings";
import { ChangeRoleDropdown } from "@/components/settings/ChangeRoleDropdown";
import { LeaveHiveSection } from "@/components/settings/LeaveHiveSection";
import { Permissions } from "@/lib/permissions";

// ─────────────────────────────────────────
// Skeletons
// ─────────────────────────────────────────

function MemberRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-high" />
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-surface-container-high rounded-lg" />
        </div>
      </div>
      <div className="w-20 h-8 bg-surface-container-high rounded-xl" />
    </div>
  );
}

function SectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl overflow-hidden clay-card divide-y divide-surface-container">
      {Array.from({ length: rows }).map((_, i) => <MemberRowSkeleton key={i} />)}
    </div>
  );
}

// ─────────────────────────────────────────
// Async Widgets
// ─────────────────────────────────────────

async function GeneralSection({ hiveId }: { hiveId: string }) {
  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
    select: { id: true, title: true, icon: true, description: true },
  });
  if (!hive) return null;

  return <GeneralSettingsForm hive={hive} />;
}

async function MembersSection({ hiveId }: { hiveId: string }) {
  const members = await prisma.hiveMember.findMany({
    where: { hiveId },
    select: {
      id: true,
      role: true,
      user: { select: { name: true, image: true, avatarColor: true, avatarType: true } },
    },
  });

  return (
    <>
      <RealtimeListener tableName="HiveMember" filterColumn="hiveId" filterValue={hiveId} />
      <div className="bg-surface-container-lowest rounded-3xl clay-card">
        <div className="divide-y divide-surface-container">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-surface-container-low transition-colors gap-4 first:rounded-t-3xl last:rounded-b-3xl"
          >
            <div className="flex items-center gap-4 text-left">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner overflow-hidden shrink-0"
                style={{ backgroundColor: member.user.avatarColor }}
              >
                {member.user.image && member.user.avatarType === "image" ? (
                  <Image 
                    src={member.user.image} 
                    alt={member.user.name || "User"} 
                    width={40}
                    height={40}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  member.user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-semibold text-on-surface truncate max-w-[200px]">{member.user.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              <ChangeRoleDropdown hiveId={hiveId} memberId={member.id} currentRole={member.role} />
              <RemoveMemberButton hiveId={hiveId} memberId={member.id} targetRole={member.role} />
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}

async function InvitesSection({ hiveId }: { hiveId: string }) {
  const invites = await prisma.hiveInvite.findMany({
    where: { hiveId },
    orderBy: { createdAt: "desc" },
    select: { id: true, code: true, expiresAt: true, createdAt: true },
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-on-surface">Invite Links</h2>
          <p className="text-on-surface-variant">
            Create shareable links with optional expiration to onboard new members.
          </p>
        </div>
        <ManageInvitesAction hiveId={hiveId} invites={invites} />
      </div>

      <div className="bg-surface-container-lowest rounded-3xl clay-card">
        <div className="divide-y divide-surface-container">
          {invites.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant/40 text-sm font-medium">
              No active invite links. Generate one to get started.
            </div>
          ) : (
            invites.map((invite) => {
              const isExpired = invite.expiresAt && invite.expiresAt < new Date();
              return (
                <div key={invite.id} className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors first:rounded-t-3xl last:rounded-b-3xl">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className={`material-symbols-outlined text-xl ${isExpired ? "text-error" : "text-primary"}`}>
                      {isExpired ? "link_off" : "link"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono font-medium text-on-surface truncate">/join/{invite.code}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${isExpired ? "text-error" : "text-on-surface-variant"}`}>
                        {isExpired
                          ? "Expired"
                          : invite.expiresAt
                          ? `Expires ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(invite.expiresAt)}`
                          : "Never expires"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CopyInviteButton code={invite.code} />
                    <DeleteInviteButton hiveId={hiveId} inviteId={invite.id} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────
// Page Shell
// ─────────────────────────────────────────

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ hiveId: string }>;
}) {
  const { hiveId } = await params;
  const [exists, membership] = await Promise.all([
    prisma.hive.findUnique({ where: { id: hiveId }, select: { id: true } }),
    getHiveMembership(hiveId),
  ]);
  if (!exists) return notFound();

  const canManageHive = membership ? Permissions.canManageHive(membership.role) : false;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">Manage Hive</h1>
      </div>

      {/* General Details */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-on-surface">General Details</h2>
          <p className="text-on-surface-variant">Update your hive&apos;s identity and visual presence.</p>
        </div>
        <Suspense fallback={<div className="animate-pulse h-40 bg-surface-container-high rounded-2xl" />}>
          <GeneralSection hiveId={hiveId} />
        </Suspense>
      </section>

      {/* Members */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-on-surface">Manage Members</h2>
          <p className="text-on-surface-variant">Control who can access and edit this workspace.</p>
        </div>
        <Suspense fallback={<SectionSkeleton rows={3} />}>
          <MembersSection hiveId={hiveId} />
        </Suspense>
      </section>

      {/* Invites */}
      <section className="space-y-6">
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <InvitesSection hiveId={hiveId} />
        </Suspense>
      </section>

      {/* Leave Hive */}
      <LeaveHiveSection hiveId={hiveId} />

      {/* Danger Zone */}
      <DangerZoneSettings hiveId={hiveId} canManageHive={canManageHive} />
    </div>
  );
}
