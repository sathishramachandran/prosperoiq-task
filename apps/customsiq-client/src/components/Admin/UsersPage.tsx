"use client";

import { useUserRoles } from "@/src/hooks/useAdmin";
import { SubUser, useSubUsers } from "@/src/hooks/useCreateUser";
import { getEmail, getName, useUserStore } from "@/src/store/user";
import { useMemo, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import ManageUserRolesDialog from "./ManageUserRolesDialog";

const Chips = ({
  items,
  tone = "purple",
  empty = "—",
}: {
  items?: string[];
  tone?: "purple" | "slate";
  empty?: string;
}) => {
  if (!items?.length) {
    return <span className="text-xs text-[#94A3B8]">{empty}</span>;
  }
  const palette =
    tone === "slate"
      ? "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]"
      : "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`inline-flex items-center text-xs rounded-full border px-2 py-0.5 ${palette}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const UserRolesCell = ({ user_id }: { user_id: string }) => {
  const { data: roles, isPending, isError } = useUserRoles(user_id);

  if (isPending) {
    return <span className="text-xs text-[#94A3B8]">Loading...</span>;
  }
  if (isError) {
    return <span className="text-xs text-[#DC2626]">Failed to load</span>;
  }
  return <Chips items={roles} />;
};

const UsersPage = () => {
  const { data: users = [], isPending, isError } = useSubUsers();
  const currentUser = useUserStore((s) => s.user);
  const [manageUser, setManageUser] = useState<SubUser | null>(null);
  const [search, setSearch] = useState("");

  const allUsers = useMemo<SubUser[]>(() => {
    if (!currentUser || currentUser.user_type !== "admin") return users;
    const hasAdminInList = users.some((u) => u.user_type === "admin");
    if (hasAdminInList) return users;
    const adminRow: SubUser = {
      user_id: currentUser.id,
      email: getEmail(currentUser),
      name: getName(currentUser),
      user_type: "admin",
    };
    return [adminRow, ...users];
  }, [users, currentUser]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.user_id?.toLowerCase().includes(q),
    );
  }, [allUsers, search]);

  return (
    <div className="px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A]">
            User Management
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            All sub-users in your organisation. Manage their role assignments
            from here.
          </p>
        </div>

        <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
          <header className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Users{" "}
              <span className="text-[#64748B] font-normal text-sm">
                ({allUsers.length})
              </span>
            </h2>
            <div className="relative w-64 max-w-full">
              <FiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, name or ID"
                className="border bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] border-[#E2E8F0] py-2 pl-9 pr-3 w-full rounded-md focus:outline-0 focus:border-ciq-primary"
              />
            </div>
          </header>

          {isPending ? (
            <p className="text-sm text-[#64748B] px-6 py-8">Loading users...</p>
          ) : isError ? (
            <p className="text-sm text-[#B91C1C] px-6 py-8">
              Failed to load users.
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-[#64748B] px-6 py-8">
              {allUsers.length === 0
                ? "No users yet."
                : "No users match your search."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B] px-6 py-2.5">
                      User
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B] px-6 py-2.5">
                      Products
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B] px-6 py-2.5">
                      Roles
                    </th>
                    <th className="px-6 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const isAdminRow = user.user_type === "admin";
                    return (
                      <tr
                        key={user.user_id}
                        className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      >
                        <td className="px-6 py-3 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                              <FiUser size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#0F172A] truncate flex items-center gap-2">
                                <span className="truncate">
                                  {user.email || "—"}
                                </span>
                                {isAdminRow && (
                                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[#7C3AED] bg-[#F3E8FF] rounded px-1.5 py-0.5">
                                    Admin
                                  </span>
                                )}
                              </p>
                              {user.name && (
                                <p className="text-xs text-[#64748B] truncate mt-0.5">
                                  {user.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <Chips items={user.products} tone="slate" />
                        </td>
                        <td className="px-6 py-3 align-middle">
                          <UserRolesCell user_id={user.user_id} />
                        </td>
                        <td className="px-6 py-3 text-right align-middle whitespace-nowrap">
                          <button
                            type="button"
                            disabled={isAdminRow}
                            onClick={() => !isAdminRow && setManageUser(user)}
                            title={
                              isAdminRow
                                ? "Admin roles can't be changed here"
                                : undefined
                            }
                            className="px-3 py-1.5 text-sm font-medium text-ciq-primary border border-[#E9D5FF] rounded-md hover:bg-[#F3E8FF] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          >
                            Manage roles
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {manageUser && (
        <ManageUserRolesDialog
          user_id={manageUser.user_id}
          userLabel={manageUser.email || manageUser.name}
          open={!!manageUser}
          onOpenChange={(open) => !open && setManageUser(null)}
        />
      )}
    </div>
  );
};

export default UsersPage;
