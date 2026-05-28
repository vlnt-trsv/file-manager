import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nodesApi } from "../api";

export const useRootNodes = () =>
  useQuery({
    queryKey: ["nodes", "root"],
    queryFn: nodesApi.getRoot,
  });

export const useChildren = (id: string | null) =>
  useQuery({
    queryKey: ["nodes", id, "children"],
    queryFn: () => nodesApi.getChildren(id!),
    enabled: !!id,
  });

export const useSearch = (q: string) =>
  useQuery({
    queryKey: ["nodes", "search", q],
    queryFn: () => nodesApi.search(q),
    enabled: q.length > 1,
  });

export const useCreateNode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: nodesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nodes"] }),
  });
};

export const useRenameNode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      nodesApi.rename(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nodes"] }),
  });
};

export const useMoveNode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parentId }: { id: string; parentId: string | null }) =>
      nodesApi.move(id, parentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nodes"] }),
  });
};

export const useDeleteNode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: nodesApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nodes"] }),
  });
};
