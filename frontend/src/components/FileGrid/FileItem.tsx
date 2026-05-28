import { useDrag, useDrop } from "react-dnd";
import {
  File,
  FileText,
  FileImage,
  Music,
  Film,
  Folder,
} from "lucide-react";
import { useMoveNode } from "../../hooks/useNodes";
import type { FileNode } from "../../types";
import { useExplorerStore } from "../../store/explorerStore";

interface Props {
  node: FileNode;
  onDoubleClick: (node: FileNode) => void;
}

function getIcon(node: FileNode) {
  if (node.type === "FOLDER")
    return <Folder size={40} className="text-yellow-400" />;

  const mime = node.mimeType ?? "";
  if (mime.startsWith("image/"))
    return <FileImage size={40} className="text-blue-400" />;
  if (mime.startsWith("audio/"))
    return <Music size={40} className="text-purple-400" />;
  if (mime.startsWith("video/"))
    return <Film size={40} className="text-red-400" />;
  if (mime.includes("pdf"))
    return <FileText size={40} className="text-red-500" />;
  if (mime.includes("text"))
    return <FileText size={40} className="text-gray-400" />;
  return <File size={40} className="text-gray-400" />;
}

function formatSize(size: number | null) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function FileItem({ node, onDoubleClick }: Props) {
  const { selectedIds, selectNode, openContextMenu } = useExplorerStore();
  const moveNode = useMoveNode();
  const isSelected = selectedIds.has(node.id);

  const [{ isDragging }, drag] = useDrag({
    type: "NODE",
    item: { id: node.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "NODE",
    canDrop: (item: { id: string }) =>
      node.type === "FOLDER" && item.id !== node.id,
    drop: (item: { id: string }) => {
      moveNode.mutate({ id: item.id, parentId: node.id });
    },
    collect: (monitor) => ({ isOver: monitor.isOver() && monitor.canDrop() }),
  });

  const ref = (el: HTMLDivElement | null) => {
    drag(el);
    drop(el);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id, e.ctrlKey || e.metaKey);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSelected) selectNode(node.id, false);
    openContextMenu(e.clientX, e.clientY, node);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      onDoubleClick={() => onDoubleClick(node)}
      onContextMenu={handleContextMenu}
      className={`
        flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer
        select-none transition-all w-24
        ${isSelected ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-gray-100"}
        ${isDragging ? "opacity-40" : ""}
        ${isOver ? "bg-blue-50 ring-2 ring-blue-300" : ""}
      `}
    >
      {getIcon(node)}
      <span className="text-xs text-center text-gray-700 break-all line-clamp-2 w-full text-center">
        {node.name}
      </span>
      {node.size && (
        <span className="text-xs text-gray-400">{formatSize(node.size)}</span>
      )}
    </div>
  );
}
