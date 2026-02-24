import { ChevronDown } from 'lucide-react'

interface HeaderProps {
  title?: string
}

export default function Header({ title = 'APPLY IMPORT PERMIT MODULE' }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-jagota-red font-black text-xl tracking-wide uppercase">
                        <img
              src="/logo.png"
              alt="TradeFlow Logo"
              className="w-25 h-6"
            />
          </span>
          <span className="text-gray-300 text-xl">|</span>
          <span className="text-gray-700 font-semibold text-sm tracking-wide uppercase">
            {title}
          </span>
        </div>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-sm">
          SA
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-sm font-semibold text-gray-800">
            System Admin
          </span>
          <span className="text-xs text-gray-500">JBT04</span>
        </div>
        <ChevronDown
          size={16}
          className="text-gray-400 group-hover:text-gray-600 transition-colors"
        />
      </div>
    </header>
  )
}
