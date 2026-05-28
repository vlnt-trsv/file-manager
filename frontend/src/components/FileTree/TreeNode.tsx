import { useRef, useState } from "react";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";
import { useDrop } from "react-dnd";
import { useChildren } from "../../hooks/useNodes";
import { useMoveNode } from "../../hooks/useNodes";
import type { FileNode } from "../../types";
import { useExplorerStore } from "../../store/explorerStore";

interface Props {
  node: FileNode;
}

export function TreeNode({ node }: Props) {
  const [expanded, setExpanded] = useState(false);

  const {
    currentFolderId,
    setCurrentFolderId,
    pushBreadcrumb,
    openContextMenu,
  } = useExplorerStore();

  const { data: children } = useChildren(expanded ? node.id : null);
  const moveNode = useMoveNode();

  const [{ isOver }] = useDrop({
    accept: "NODE",
    drop: (item: { id: string }) => {
      if (item.id !== node.id) {
        moveNode.mutate({ id: item.id, parentId: node.id });
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const divRef = useRef<HTMLDivElement>(null);

  const isActive = currentFolderId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
    setCurrentFolderId(node.id);
    pushBreadcrumb(node);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, node);
  };

  return (
    <div>
      <div
        ref={divRef}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={`
          flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded-md mx-1 text-sm
          ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
          ${isOver ? "bg-blue-50 ring-2 ring-blue-400" : ""}
        `}
      >
        <span className="text-gray-400 w-4 flex-shrink-0">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <Folder size={16} className="text-yellow-500 flex-shrink-0" />
        <span className="truncate">{node.name}</span>
      </div>

      {expanded && children && (
        <div className="ml-4">
          {children
            .filter((child) => child.type === "FOLDER")
            .map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
        </div>
      )}
    </div>
  );
}
