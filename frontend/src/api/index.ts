import axios from "axios";
import type { FileNode } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export const nodesApi = {
  getRoot: () => api.get<FileNode[]>("/nodes").then((result) => result.data),

  getChildren: (id: string) =>
    api.get<FileNode[]>(`/nodes/${id}/children`).then((result) => result.data),

  getOne: (id: string) => api.get<FileNode>(`/nodes/${id}`).then((result) => result.data),

  getTree: (id: string) =>
    api.get<FileNode[]>(`/nodes/${id}/tree`).then((result) => result.data),

  search: (query: string) =>
    api.get<FileNode[]>(`/nodes/search?query=${query}`).then((result) => result.data),

  create: (data: {
    name: string;
    type: "FILE" | "FOLDER";
    parentId?: string;
  }) => api.post<FileNode>("/nodes", data).then((result) => result.data),

  rename: (id: string, name: string) =>
    api.patch<FileNode>(`/nodes/${id}/rename`, { name }).then((result) => result.data),

  move: (id: string, parentId: string | null) =>
    api.patch<FileNode>(`/nodes/${id}/move`, { parentId }).then((result) => result.data),

  remove: (id: string) => api.delete(`/nodes/${id}`).then((result) => result.data),
};
