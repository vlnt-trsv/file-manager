import { useState } from "react";
import { X } from "lucide-react";
import { useCreateNode } from "../../hooks/useNodes";
import { useExplorerStore } from "../../store/explorerStore";

export function CreateNodeModal() {
  const [name, setName] = useState("");
  const {
    isCreateModalOpen,
    createModalType,
    closeCreateModal,
    currentFolderId,
  } = useExplorerStore();

  const createNode = useCreateNode();

  if (!isCreateModalOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    createNode.mutate(
      {
        name: name.trim(),
        type: createModalType,
        parentId: currentFolderId ?? undefined,
      },
      {
        onSuccess: () => {
          setName("");
          closeCreateModal();
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") closeCreateModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">
            Create {createModalType === "FOLDER" ? "Folder" : "File"}
          </h2>
          <button
            onClick={closeCreateModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <input
          autoFocus
          type="text"
          placeholder={
            createModalType === "FOLDER" ? "Folder name" : "File name"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={closeCreateModal}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || createNode.isPending}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
