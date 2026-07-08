"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/Dialog";
import {
  useGrantRole,
  useRevokeRole,
  useRoles,
  useUserRoles,
} from "@/src/hooks/useAdmin";
import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import ConfirmDialog from "./ConfirmDialog";

type Props = {
  user_id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLabel?: string;
};

const ManageUserRolesDialog = ({
  user_id,
  open,
  onOpenChange,
  userLabel,
}: Props) => {
  const { data: assignedRoles = [], isPending: rolesLoading } = useUserRoles(
    open ? user_id : "",
  );
  const { data: allRoles = [], isPending: allRolesLoading } = useRoles();
  const grant = useGrantRole(user_id);
  const revoke = useRevokeRole(user_id);

  const [pendingRevoke, setPendingRevoke] = useState<string | null>(null);
  const [selectedToGrant, setSelectedToGrant] = useState<string>("");

  const grantableRoles = useMemo(() => {
    const assigned = new Set(assignedRoles);
    return allRoles
      .map((r) => r.name)
      .filter((name) => name !== "role_admin" && !assigned.has(name));
  }, [allRoles, assignedRoles]);

  const confirmRevoke = async () => {
    if (!pendingRevoke) return;
    try {
      await revoke.mutateAsync(pendingRevoke);
      setPendingRevoke(null);
    } catch {
      // toast handled in hook
    }
  };

  const onGrant = async () => {
    if (!selectedToGrant) return;
    try {
      await grant.mutateAsync(selectedToGrant);
      setSelectedToGrant("");
    } catch {
      // toast handled in hook
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0F172A]">Manage roles</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              {userLabel ? (
                <>
                  Roles for{" "}
                  <span className="font-medium text-[#0F172A]">
                    {userLabel}
                  </span>
                </>
              ) : (
                <>
                  User ID: <span className="font-mono">{user_id}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#0F172A] inline-block mb-2">
                Current roles
              </label>
              {rolesLoading ? (
                <p className="text-sm text-[#64748B]">Loading...</p>
              ) : assignedRoles.length === 0 ? (
                <p className="text-sm text-[#64748B]">No roles assigned.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assignedRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1.5 text-sm bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF] rounded-full pl-3 pr-1.5 py-1"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => setPendingRevoke(role)}
                        disabled={revoke.isPending}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-[#E9D5FF] cursor-pointer disabled:opacity-60"
                        aria-label={`Revoke ${role}`}
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[#0F172A] inline-block mb-2">
                Add a role
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedToGrant}
                  onChange={(e) => setSelectedToGrant(e.target.value)}
                  disabled={allRolesLoading || grant.isPending}
                  className="flex-1 border bg-white text-sm text-[#0F172A] border-[#E2E8F0] py-2.5 px-3 rounded-md focus:outline-0 focus:border-ciq-primary disabled:opacity-60"
                >
                  <option value="">
                    {allRolesLoading
                      ? "Loading roles..."
                      : grantableRoles.length === 0
                        ? "No roles available to grant"
                        : "Select a role..."}
                  </option>
                  {grantableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onGrant}
                  disabled={!selectedToGrant || grant.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-ciq-primary rounded-md hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {grant.isPending ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-[#475569] border border-[#E2E8F0] rounded-md hover:bg-[#F8FAFC] cursor-pointer"
            >
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!pendingRevoke}
        onOpenChange={(open) => !open && setPendingRevoke(null)}
        title={`Revoke role "${pendingRevoke ?? ""}"?`}
        description="The user will immediately lose the permissions granted by this role."
        confirmLabel="Revoke"
        destructive
        loading={revoke.isPending}
        onConfirm={confirmRevoke}
      />
    </>
  );
};

export default ManageUserRolesDialog;
