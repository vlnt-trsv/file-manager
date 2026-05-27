import { ChevronRight, Home } from 'lucide-react'
import { useExplorerStore } from '../../store/explorerStore'

export function Breadcrumb() {
  const { breadcrumbs, popBreadcrumbTo } = useExplorerStore()

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-gray-200 text-sm">
      <button
        onClick={() => popBreadcrumbTo(null)}
        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
      >
        <Home size={14} />
        Root
      </button>

      {breadcrumbs.map((node, index) => (
        <div key={node.id} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-gray-300" />
          <button
            onClick={() => popBreadcrumbTo(node.id)}
            className={`
              hover:text-blue-600 transition-colors
              ${index === breadcrumbs.length - 1
                ? 'text-gray-800 font-medium'
                : 'text-gray-500'
              }
            `}
          >
            {node.name}
          </button>
        </div>
      ))}
    </div>
  )
}