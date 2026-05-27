import { FilePlus, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useDeleteNode } from "../../hooks/useNodes";
import { useExplorerStore } from "../../store/explorerStore";

export function ContextMenu() {
  const { contextMenu, closeContextMenu, openCreateModal, openRenameModal } =
    useExplorerStore();

  const deleteNode = useDeleteNode();

  if (!contextMenu) return null;

  const { x, y, node } = contextMenu;

  const handleDelete = () => {
    if (node) {
      deleteNode.mutate(node.id);
      closeContextMenu();
    }
  };

  const handleRename = () => {
    if (node) {
      openRenameModal(node);
      closeContextMenu();
    }
  };

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-40"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          openCreateModal("FOLDER");
          closeContextMenu();
        }}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <FolderPlus size={15} className="text-yellow-500" />
        New Folder
      </button>

      <button
        onClick={() => {
          openCreateModal("FILE");
          closeContextMenu();
        }}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <FilePlus size={15} className="text-blue-500" />
        New File
      </button>

      {node && (
        <>
          <div className="border-t border-gray-100 my-1" />

          <button
            onClick={handleRename}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Pencil size={15} className="text-gray-500" />
            Rename
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </>
      )}
    </div>
  );
}
