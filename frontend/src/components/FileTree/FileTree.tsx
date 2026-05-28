import { Folder } from "lucide-react";
import { useRootNodes } from "../../hooks/useNodes";
import { TreeNode } from "./TreeNode";
import { useExplorerStore } from "../../store/explorerStore";

export function FileTree() {
  const { data: roots, isLoading } = useRootNodes();
  const { setCurrentFolderId, openContextMenu } = useExplorerStore();

  const handleRootContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, null);
  };

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-400">Загружка...</div>;
  }

  return (
    <div className="py-2 min-h-full" onContextMenu={handleRootContextMenu}>
      <div
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700"
        onClick={() => setCurrentFolderId(null)}
      >
        <Folder size={14} />
        Дом
      </div>

      {roots
        ?.filter((node) => node.type === "FOLDER")
        .map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
    </div>
  );
}
