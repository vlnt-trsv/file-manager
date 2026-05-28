export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  path: string;
  parentId: string | null;
  size: number | null;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
  children?: Node[];
}

export type NodeType = "FILE" | "FOLDER";
