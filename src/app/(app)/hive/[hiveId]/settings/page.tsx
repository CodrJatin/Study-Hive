import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeleteHiveButton } from "@/components/settings/DeleteHiveButton";
import { GeneralSettingsForm } from "@/components/settings/GeneralSettingsForm";
import { ManageInvitesAction } from "@/components/settings/ManageInvitesAction";
import { CopyInviteButton } from "@/components/settings/CopyInviteButton";
import { RemoveMemberButton } from "@/components/settings/RemoveMemberButton";
import { DeleteInviteButton } from "@/components/settings/DeleteInviteButton";

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
          <div className="h-3 w-44 bg-surface-container-high rounded" />
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
    select: { id: true, title: true, subject: true, description: true },
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
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="bg-surface-container-lowest rounded-3xl overflow-hidden clay-card">
      <div className="divide-y divide-surface-container">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-surface-container-low transition-colors gap-4"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container">
                {member.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-on-surface truncate max-w-[200px]">{member.user.name}</p>
                <p className="text-sm text-on-surface-variant truncate max-w-[200px]">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              {member.role === "ADMIN" ? (
                <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/10">
                  Admin
                </div>
              ) : (
                <select
                  className="bg-surface-container-high hover:bg-surface-container-highest border-none rounded-xl text-sm font-bold py-2 pl-4 pr-10 focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer appearance-none text-on-surface"
                  defaultValue={member.role}
                >
                  <option value="MEMBER">Member</option>
                  <option value="VIEW_ONLY">View Only</option>
                </select>
              )}
              {member.role !== "ADMIN" && (
                <RemoveMemberButton hiveId={hiveId} memberId={member.id} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
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

      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden clay-card">
        <div className="divide-y divide-surface-container">
          {invites.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant/40 text-sm font-medium">
              No active invite links. Generate one to get started.
            </div>
          ) : (
            invites.map((invite) => {
              const isExpired = invite.expiresAt && invite.expiresAt < new Date();
              return (
                <div key={invite.id} className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors">
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

  const exists = await prisma.hive.findUnique({ where: { id: hiveId }, select: { id: true } });
  if (!exists) return notFound();

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

      {/* Danger Zone */}
      <section className="pt-8 border-t border-outline-variant/10">
        <div className="bg-error-container/30 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-error/10">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-error">Danger Zone</h3>
            <p className="text-on-surface-variant max-w-lg">
              Deleting a hive is permanent. All notes, members, and collaborative progress will be erased forever.
            </p>
          </div>
          <DeleteHiveButton hiveId={hiveId} />
        </div>
      </section>
    </div>
  );
}
