"use client";

import {
  apiDeleteCustoms,
  apiGetCustoms,
  apiPostCustoms,
} from "@/lib/api_services";
import { adminEndPoints } from "@/src/constants/endpoints";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export type Permission = {
  resource: string;
  action: string;
};

export type Role = {
  name: string;
  builtin: boolean;
  permissions: Permission[];
  user_count: number;
};

export type ResourceTaxonomy = {
  resources: string[];
  actions: string[];
};

const queryKeys = {
  resources: ["admin", "resources"] as const,
  roles: ["admin", "roles"] as const,
  userRoles: (user_id: string) =>
    ["admin", "users", user_id, "roles"] as const,
};

const errorMessage = (err: any, fallback: string) => {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) return detail[0]?.msg || fallback;
  if (typeof detail === "string") return detail;
  return fallback;
};

export const useResources = () => {
  return useQuery({
    queryKey: queryKeys.resources,
    queryFn: async (): Promise<ResourceTaxonomy> => {
      const res = await apiGetCustoms(adminEndPoints.resources);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: queryKeys.roles,
    queryFn: async (): Promise<Role[]> => {
      const res = await apiGetCustoms(adminEndPoints.roles);
      const data = res.data;
      // tolerate both [roles] and { roles: [...] } shapes
      return Array.isArray(data) ? data : data?.roles || [];
    },
  });
};

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["admin", "create-role"],
    mutationFn: async (payload: { name: string; permissions: Permission[] }) => {
      const res = await apiPostCustoms(adminEndPoints.roles, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role created");
      qc.invalidateQueries({ queryKey: queryKeys.roles });
    },
    onError: (err) => {
      // 403 is already toasted by the interceptor; only toast other errors
      const status = (err as any)?.response?.status;
      if (status === 403) return;
      toast.error(errorMessage(err, "Failed to create role"));
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["admin", "delete-role"],
    mutationFn: async (role: string) => {
      const res = await apiDeleteCustoms(adminEndPoints.role(role));
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role deleted");
      qc.invalidateQueries({ queryKey: queryKeys.roles });
    },
    onError: (err) => {
      const status = (err as any)?.response?.status;
      if (status === 403) return;
      toast.error(errorMessage(err, "Failed to delete role"));
    },
  });
};

export const useUserRoles = (user_id: string) => {
  return useQuery({
    queryKey: queryKeys.userRoles(user_id),
    queryFn: async (): Promise<string[]> => {
      const res = await apiGetCustoms(adminEndPoints.userRoles(user_id));
      const data = res.data;
      const raw: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.roles)
          ? (data as any).roles
          : [];
      return raw
        .map((r) =>
          typeof r === "string" ? r : ((r as any)?.name as string | undefined),
        )
        .filter((name): name is string => !!name);
    },
    enabled: !!user_id,
  });
};

export const useGrantRole = (user_id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["admin", "grant-role", user_id],
    mutationFn: async (role: string) => {
      const res = await apiPostCustoms(adminEndPoints.userRoles(user_id), {
        role,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role granted");
      qc.invalidateQueries({ queryKey: queryKeys.userRoles(user_id) });
      qc.invalidateQueries({ queryKey: queryKeys.roles });
    },
    onError: (err) => {
      const status = (err as any)?.response?.status;
      if (status === 403) return;
      toast.error(errorMessage(err, "Failed to grant role"));
    },
  });
};

export const useRevokeRole = (user_id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["admin", "revoke-role", user_id],
    mutationFn: async (role: string) => {
      const res = await apiDeleteCustoms(
        adminEndPoints.userRole(user_id, role),
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role revoked");
      qc.invalidateQueries({ queryKey: queryKeys.userRoles(user_id) });
      qc.invalidateQueries({ queryKey: queryKeys.roles });
    },
    onError: (err) => {
      const status = (err as any)?.response?.status;
      if (status === 403) return;
      toast.error(errorMessage(err, "Failed to revoke role"));
    },
  });
};
