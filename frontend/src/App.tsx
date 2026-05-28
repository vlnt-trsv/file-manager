import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FileTree } from "./components/FileTree/FileTree";
import { FileGrid } from "./components/FileGrid/FileGrid";
import { Breadcrumb } from "./components/Breadcrumb/Breadcrumb";
import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import { CreateNodeModal } from "./components/Modals/CreateNodeModal";
import { RenameModal } from "./components/Modals/RenameModal";
import { useExplorerStore } from "./store/explorerStore";

const queryClient = new QueryClient();

function FileManager() {
  const [search, setSearch] = useState("");
  const { contextMenu, closeContextMenu, openContextMenu } = useExplorerStore();

  const handleRootContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, null);
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      onClick={closeContextMenu}
    >
      <header className="flex items-center gap-4 px-4 py-2 bg-white border-b border-gray-200">
        <Breadcrumb />
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <FileTree />
        </aside>

        <main
          className="flex-1 overflow-y-auto p-4"
          onContextMenu={handleRootContextMenu}
        >
          <FileGrid search={search} />
        </main>
      </div>

      {contextMenu && <ContextMenu />}

      <CreateNodeModal />
      <RenameModal />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <FileManager />
      </DndProvider>
    </QueryClientProvider>
  );
}
