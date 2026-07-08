"use client";

import { Role, useDeleteRole, useRoles } from "@/src/hooks/useAdmin";
import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "./ConfirmDialog";
import CreateRoleDialog from "./CreateRoleDialog";

const formatPermissions = (role: Role) => {
  if (!role.permissions?.length) return "—";
  return role.permissions
    .map((p) => `${p.action.toUpperCase()} ${p.resource}`)
    .join(", ");
};

const RoleRow = ({
  role,
  onDelete,
}: {
  role: Role;
  onDelete?: (role: Role) => void;
}) => {
  return (
    <tr className="border-t border-[#E2E8F0]">
      <td className="px-4 py-3 text-sm text-[#0F172A] align-top font-medium">
        {role.name}
        {role.builtin && (
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[#7C3AED] bg-[#F3E8FF] rounded px-1.5 py-0.5 align-middle">
            Built-in
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-[#475569] align-top">
        {formatPermissions(role)}
      </td>
      <td className="px-4 py-3 text-sm text-[#475569] align-top whitespace-nowrap">
        {role.user_count ?? 0}
      </td>
      <td className="px-4 py-3 text-right align-top whitespace-nowrap">
        {!role.builtin && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(role)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] px-2.5 py-1.5 rounded-md cursor-pointer"
          >
            <FiTrash2 size={14} />
            Delete
          </button>
        )}
      </td>
    </tr>
  );
};

const RolesTable = ({
  roles,
  onDelete,
}: {
  roles: Role[];
  onDelete?: (role: Role) => void;
}) => {
  if (!roles.length) {
    return (
      <p className="text-sm text-[#64748B] px-4 py-6">No roles to show.</p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B] px-4 py-2.5">
              Name
            </th>
            <th className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B] px-4 py-2.5">
              Permissions
            </th>
            <th className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B] px-4 py-2.5">
              Users
            </th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <RoleRow key={r.name} role={r} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RolesPage = () => {
  const { data: roles = [], isPending, isError } = useRoles();
  const deleteRole = useDeleteRole();

  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null);

  const builtins = roles.filter((r) => r.builtin);
  const customs = roles.filter((r) => !r.builtin);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteRole.mutateAsync(pendingDelete.name);
      setPendingDelete(null);
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#0F172A]">
              Role Management
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Built-in roles ship with the system. Create custom roles to grant
              specific combinations of permissions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-ciq-primary rounded-md hover:opacity-90 cursor-pointer"
          >
            <FiPlus size={16} />
            Create custom role
          </button>
        </div>

        {isPending && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm px-4 py-6 text-sm text-[#64748B]">
            Loading roles...
          </div>
        )}

        {isError && !isPending && (
          <div className="bg-white border border-[#FECACA] rounded-2xl shadow-sm px-4 py-6 text-sm text-[#B91C1C]">
            Failed to load roles.
          </div>
        )}

        {!isPending && !isError && (
          <>
            <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <header className="px-6 py-4 border-b border-[#E2E8F0]">
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Built-in roles
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  System roles — cannot be edited or deleted.
                </p>
              </header>
              <RolesTable roles={builtins} />
            </section>

            <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <header className="px-6 py-4 border-b border-[#E2E8F0]">
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Custom roles
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Roles created for this organisation.
                </p>
              </header>
              <RolesTable
                roles={customs}
                onDelete={(role) => setPendingDelete(role)}
              />
            </section>
          </>
        )}
      </div>

      <CreateRoleDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete role "${pendingDelete?.name ?? ""}"?`}
        description={
          pendingDelete?.user_count
            ? `This role is currently assigned to ${pendingDelete.user_count} user(s). They will lose the permissions granted by this role.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete role"
        destructive
        loading={deleteRole.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default RolesPage;
