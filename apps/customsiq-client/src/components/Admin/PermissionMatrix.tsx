"use client";

import { Permission } from "@/src/hooks/useAdmin";

type Props = {
  resources: string[];
  actions: string[];
  value: Permission[];
  onChange: (next: Permission[]) => void;
  disabled?: boolean;
};

const has = (perms: Permission[], resource: string, action: string) =>
  perms.some((p) => p.resource === resource && p.action === action);

const toggle = (
  perms: Permission[],
  resource: string,
  action: string,
): Permission[] => {
  return has(perms, resource, action)
    ? perms.filter((p) => !(p.resource === resource && p.action === action))
    : [...perms, { resource, action }];
};

const formatName = (s: string) => s.replace(/_/g, " ").toUpperCase();

const PermissionMatrix = ({
  resources,
  actions,
  value,
  onChange,
  disabled,
}: Props) => {
  if (!resources.length || !actions.length) {
    return (
      <p className="text-sm text-[#64748B] py-4">
        Loading resource taxonomy...
      </p>
    );
  }

  return (
    <div className="border border-[#E2E8F0] rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th className="text-left font-medium text-[#0F172A] px-4 py-2.5 w-1/3">
              Resource
            </th>
            {actions.map((action) => (
              <th
                key={action}
                className="text-center font-medium text-[#0F172A] px-2 py-2.5"
              >
                {formatName(action)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, idx) => (
            <tr
              key={resource}
              className={
                idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
              }
            >
              <td className="px-4 py-2.5 text-[#0F172A] border-t border-[#E2E8F0]">
                {formatName(resource)}
              </td>
              {actions.map((action) => {
                const checked = has(value, resource, action);
                return (
                  <td
                    key={action}
                    className="text-center px-2 py-2.5 border-t border-[#E2E8F0]"
                  >
                    <input
                      type="checkbox"
                      className="accent-ciq-primary w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onChange(toggle(value, resource, action))}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionMatrix;
