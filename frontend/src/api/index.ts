import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const nodesApi = {
  getRoot: () => api.get<Node[]>("/nodes").then((result) => result.data),

  getChildren: (id: string) =>
    api.get<Node[]>(`/nodes/${id}/children`).then((result) => result.data),

  getOne: (id: string) => api.get<Node>(`/nodes/${id}`).then((result) => result.data),

  getTree: (id: string) =>
    api.get<Node[]>(`/nodes/${id}/tree`).then((result) => result.data),

  search: (query: string) =>
    api.get<Node[]>(`/nodes/search?query=${query}`).then((result) => result.data),

  create: (data: {
    name: string;
    type: "FILE" | "FOLDER";
    parentId?: string;
  }) => api.post<Node>("/nodes", data).then((result) => result.data),

  rename: (id: string, name: string) =>
    api.patch<Node>(`/nodes/${id}/rename`, { name }).then((result) => result.data),

  move: (id: string, parentId: string | null) =>
    api.patch<Node>(`/nodes/${id}/move`, { parentId }).then((result) => result.data),

  remove: (id: string) => api.delete(`/nodes/${id}`).then((result) => result.data),
};
