import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, TrendingUp, CalendarCheck, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/deals', label: 'Deals', icon: TrendingUp },
  { to: '/activities', label: 'Activities', icon: CalendarCheck },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 bg-[#fafafa] flex flex-col',
          'border-r border-[#e5e5e5]',
          'transition-transform duration-200 md:relative md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 h-14">
          <span className="font-semibold text-[#171717] tracking-tight text-[0.9375rem]">
            SalesPulse
          </span>
          <button
            className="ml-auto md:hidden text-[#a3a3a3] hover:text-[#171717] transition-colors duration-100 p-1"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-4 pb-1">
          <span className="text-[0.6875rem] font-medium text-[#a3a3a3] uppercase tracking-widest">
            Menu
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-100',
                  isActive
                    ? 'text-[#2563eb] font-medium'
                    : 'text-[#737373] font-normal hover:text-[#171717]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className={isActive ? 'text-[#2563eb]' : 'text-[#a3a3a3]'}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#e5e5e5]">
          <p className="text-[0.6875rem] text-[#a3a3a3]">© 2025 SalesPulse CRM</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#171717]/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile only) */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-[#e5e5e5]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-[#737373] hover:text-[#171717] transition-colors duration-100"
            aria-label="Open menu"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
          <span className="font-semibold text-[#171717] text-sm">SalesPulse</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
