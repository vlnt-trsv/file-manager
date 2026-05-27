import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRenameNode } from "../../hooks/useNodes";
import { useExplorerStore } from "../../store/explorerStore";

export function RenameModal() {
  const { isRenameModalOpen, renameTarget, closeRenameModal } =
    useExplorerStore();
  const [name, setName] = useState("");
  const renameNode = useRenameNode();

  useEffect(() => {
    if (renameTarget) setName(renameTarget.name);
  }, [renameTarget]);

  if (!isRenameModalOpen || !renameTarget) return null;

  const handleSubmit = () => {
    if (!name.trim() || name === renameTarget.name) return;

    renameNode.mutate(
      { id: renameTarget.id, name: name.trim() },
      { onSuccess: closeRenameModal },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") closeRenameModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Rename</h2>
          <button
            onClick={closeRenameModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={closeRenameModal}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !name.trim() || name === renameTarget.name || renameNode.isPending
            }
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}
