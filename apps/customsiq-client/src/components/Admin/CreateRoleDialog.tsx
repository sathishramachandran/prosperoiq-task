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
  Permission,
  useCreateRole,
  useResources,
} from "@/src/hooks/useAdmin";
import { useEffect, useState } from "react";
import PermissionMatrix from "./PermissionMatrix";

const NAME_REGEX = /^[a-z][a-z0-9_]{0,63}$/;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateRoleDialog = ({ open, onOpenChange }: Props) => {
  const { data: resourcesData, isPending: resourcesLoading } = useResources();
  const { mutateAsync, isPending: submitting } = useCreateRole();

  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permTouched, setPermTouched] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setNameTouched(false);
      setPermissions([]);
      setPermTouched(false);
    }
  }, [open]);

  const nameError = !NAME_REGEX.test(name)
    ? "Name must start with a lowercase letter and contain only lowercase letters, digits and underscores (max 64 chars)"
    : null;
  const permError = permissions.length === 0 ? "Select at least one permission" : null;

  const canSubmit = !nameError && !permError && !submitting;

  const onSubmit = async () => {
    setNameTouched(true);
    setPermTouched(true);
    if (!canSubmit) return;
    try {
      await mutateAsync({ name, permissions });
      onOpenChange(false);
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0F172A]">Create Custom Role</DialogTitle>
          <DialogDescription className="text-[#64748B]">
            Choose a unique role name and the permissions this role should grant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#0F172A] inline-block mb-1.5">
              Role name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              placeholder="e.g. boe_uploader"
              className="border bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] border-[#E2E8F0] py-2.5 px-3.5 w-full rounded-md focus:outline-0 focus:border-ciq-primary"
            />
            {nameTouched && nameError && (
              <p className="text-[#DC2626] text-xs ml-1 mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[#0F172A] inline-block mb-1.5">
              Permissions <span className="text-red-500">*</span>
            </label>
            {resourcesLoading ? (
              <p className="text-sm text-[#64748B] py-4">Loading permissions...</p>
            ) : (
              <PermissionMatrix
                resources={resourcesData?.resources || []}
                actions={resourcesData?.actions || []}
                value={permissions}
                onChange={(next) => {
                  setPermissions(next);
                  setPermTouched(true);
                }}
                disabled={submitting}
              />
            )}
            {permTouched && permError && (
              <p className="text-[#DC2626] text-xs ml-1 mt-1.5">{permError}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-[#475569] border border-[#E2E8F0] rounded-md hover:bg-[#F8FAFC] cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="px-5 py-2 text-sm font-medium text-white bg-ciq-primary rounded-md hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create role"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleDialog;
