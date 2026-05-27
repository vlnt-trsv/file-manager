import { useChildren, useRootNodes, useSearch } from "../../hooks/useNodes";
import { useExplorerStore } from "../../store/explorerStore";
import type { Node } from "../../types";
import { FileItem } from "./FileItem";

interface Props {
  search: string;
}

export function FileGrid({ search }: Props) {
  const {
    currentFolderId,
    setCurrentFolderId,
    pushBreadcrumb,
    clearSelection,
  } = useExplorerStore();

  const { data: rootNodes } = useRootNodes();
  const { data: children } = useChildren(currentFolderId);
  const { data: searchResults } = useSearch(search);

  const nodes =
    search.length > 1 ? searchResults : currentFolderId ? children : rootNodes;

  const handleDoubleClick = (node: Node) => {
    if (node.type === "FOLDER") {
      setCurrentFolderId(node.id);
      pushBreadcrumb(node);
    }
  };

  const handleBackgroundClick = () => {
    clearSelection();
  };

  if (!nodes || nodes.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-full text-gray-400 text-sm"
        onClick={handleBackgroundClick}
      >
        {search ? "Nothing found" : "This folder is empty"}
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-2 content-start"
      onClick={handleBackgroundClick}
    >
      {/* Сначала папки, потом файлы */}
      {[...nodes]
        .sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "FOLDER" ? -1 : 1;
        })
        .map((node) => (
          <FileItem
            key={node.id}
            node={node}
            onDoubleClick={handleDoubleClick}
          />
        ))}
    </div>
  );
}
