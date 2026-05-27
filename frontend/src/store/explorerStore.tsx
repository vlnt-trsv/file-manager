import { create } from "zustand";
import type { Node } from "../types";

interface ContextMenuState {
  x: number;
  y: number;
  node: Node | null;
}

interface ExplorerStore {
  // Текущая открытая папка
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;

  // История для breadcrumb
  breadcrumbs: Node[];
  pushBreadcrumb: (node: Node) => void;
  popBreadcrumbTo: (id: string | null) => void;

  // Выбранные узлы
  selectedIds: Set<string>;
  selectNode: (id: string, multi: boolean) => void;
  clearSelection: () => void;

  // Контекстное меню
  contextMenu: ContextMenuState | null;
  openContextMenu: (x: number, y: number, node: Node | null) => void;
  closeContextMenu: () => void;

  // Модалки
  isCreateModalOpen: boolean;
  createModalType: "FILE" | "FOLDER";
  openCreateModal: (type: "FILE" | "FOLDER") => void;
  closeCreateModal: () => void;

  isRenameModalOpen: boolean;
  renameTarget: Node | null;
  openRenameModal: (node: Node) => void;
  closeRenameModal: () => void;
}

export const useExplorerStore = create<ExplorerStore>((set) => ({
  currentFolderId: null,
  setCurrentFolderId: (id) =>
    set({ currentFolderId: id, selectedIds: new Set() }),

  breadcrumbs: [],
  pushBreadcrumb: (node) =>
    set((s) => ({ breadcrumbs: [...s.breadcrumbs, node] })),
  popBreadcrumbTo: (id) =>
    set((s) => ({
      breadcrumbs:
        id === null
          ? []
          : s.breadcrumbs.slice(
              0,
              s.breadcrumbs.findIndex((b) => b.id === id) + 1,
            ),
      currentFolderId: id,
      selectedIds: new Set(),
    })),

  selectedIds: new Set(),
  selectNode: (id, multi) =>
    set((s) => {
      if (multi) {
        const next = new Set(s.selectedIds);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        next.has(id) ? next.delete(id) : next.add(id);
        return { selectedIds: next };
      }
      return { selectedIds: new Set([id]) };
    }),
  clearSelection: () => set({ selectedIds: new Set() }),

  contextMenu: null,
  openContextMenu: (x, y, node) => set({ contextMenu: { x, y, node } }),
  closeContextMenu: () => set({ contextMenu: null }),

  isCreateModalOpen: false,
  createModalType: "FOLDER",
  openCreateModal: (type) =>
    set({ isCreateModalOpen: true, createModalType: type }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),

  isRenameModalOpen: false,
  renameTarget: null,
  openRenameModal: (node) =>
    set({ isRenameModalOpen: true, renameTarget: node }),
  closeRenameModal: () => set({ isRenameModalOpen: false, renameTarget: null }),
}));
