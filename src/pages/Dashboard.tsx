import { useEffect, useState } from 'react'
import { table } from '../lib/api'
import { Skeleton } from '../components/ui/skeleton'
import {
  Users, Building2, TrendingUp, CalendarCheck, DollarSign, Target,
  Phone, Mail, CheckSquare, FileText, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const CONTACTS_TABLE = 'db2d8a7d8ffc4445a1e06ad62c0f876a'
const COMPANIES_TABLE = 'e865da470d894d31a482d59c694915c7'
const DEALS_TABLE = '9a554477c5234eda86046528b9977300'
const ACTIVITIES_TABLE = '30b15f4b814c4169895fb8ab34e09bfb'

// ── Stat card ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  loading?: boolean
}

function StatCard({ label, value, icon: Icon, loading }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between">
        <span className="text-[0.6875rem] font-medium text-[#a3a3a3] uppercase tracking-widest">
          {label}
        </span>
        <Icon size={15} strokeWidth={1.5} className="text-[#d4d4d4]" />
      </div>
      {loading ? (
        <Skeleton className="h-8 w-20 bg-[#f5f5f5]" />
      ) : (
        <span className="text-[1.75rem] font-semibold text-[#171717] leading-none tracking-tight">
          {value}
        </span>
      )}
    </div>
  )
}

// ── Stage badge ────────────────────────────────────────────────────────────────

const stageBadge: Record<string, { bg: string; text: string }> = {
  'Prospecting':   { bg: '#f5f5f5', text: '#525252' },
  'Qualification': { bg: '#eff6ff', text: '#2563eb' },
  'Proposal':      { bg: '#fefce8', text: '#ca8a04' },
  'Negotiation':   { bg: '#fff7ed', text: '#c2410c' },
  'Closed Won':    { bg: '#f0fdf4', text: '#16a34a' },
  'Closed Lost':   { bg: '#fef2f2', text: '#dc2626' },
}

function StageBadge({ stage }: { stage: string }) {
  const colors = stageBadge[stage] ?? { bg: '#f5f5f5', text: '#525252' }
  return (
    <span
      className="inline-flex items-center text-[0.6875rem] font-medium rounded-[0.25rem] px-2 py-0.5"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {stage}
    </span>
  )
}

// ── Activity type icon ─────────────────────────────────────────────────────────

const activityIcons: Record<string, React.ElementType> = {
  Call: Phone,
  Email: Mail,
  Meeting: Users,
  Task: CheckSquare,
  Note: FileText,
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats]           = useState({ contacts: 0, companies: 0, deals: 0 })
  const [dealValue, setDealValue]   = useState(0)
  const [wonDeals, setWonDeals]     = useState(0)
  const [recentDeals, setRecentDeals]         = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [contacts, companies, deals, activities] = await Promise.all([
        table(CONTACTS_TABLE).getRows({ count: true }),
        table(COMPANIES_TABLE).getRows({ count: true }),
        table(DEALS_TABLE).getRows(),
        table(ACTIVITIES_TABLE).getRows({
          sort: [{ column: 'due_date', direction: 'desc' }],
          limit: 5,
        }),
      ])

      const dealsData  = deals.success ? (deals.data as any[]) : []
      const totalValue = dealsData.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
      const won        = dealsData.filter(d => d.data?.stage === 'Closed Won' || d.stage === 'Closed Won').length

      setStats({
        contacts: contacts.count || 0,
        companies: companies.count || 0,
        deals: dealsData.length,
      })
      setDealValue(totalValue)
      setWonDeals(won)
      setRecentDeals(dealsData.slice(0, 5))
      setRecentActivities(activities.success ? (activities.data as any[]) : [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const formatValue = (v: any) =>
    v ? `$${Number(v).toLocaleString()}` : '—'

  return (
    <div className="min-h-full bg-white">
      <div className="max-w-[64rem] mx-auto px-8 py-10">

        {/* ── Page header ── */}
        <div className="mb-10">
          <p className="text-[0.6875rem] font-medium text-[#a3a3a3] uppercase tracking-widest mb-1">
            Overview
          </p>
          <h1 className="text-[1.75rem] font-semibold text-[#171717] tracking-tight leading-snug">
            Dashboard
          </h1>
        </div>

        {/* ── Stat grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y divide-[#e5e5e5] border border-[#e5e5e5] rounded-lg mb-10 overflow-hidden">
          <StatCard label="Contacts"       value={stats.contacts}                                                       icon={Users}       loading={loading} />
          <StatCard label="Companies"      value={stats.companies}                                                      icon={Building2}   loading={loading} />
          <StatCard label="Active Deals"   value={stats.deals}                                                          icon={TrendingUp}  loading={loading} />
          <StatCard label="Pipeline"       value={loading ? '' : `$${dealValue.toLocaleString()}`}                      icon={DollarSign}  loading={loading} />
          <StatCard label="Deals Won"      value={wonDeals}                                                             icon={Target}      loading={loading} />
        </div>

        {/* ── Two-column feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Deals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[1.0625rem] font-semibold text-[#171717] tracking-tight">
                Recent Deals
              </h2>
              <Link
                to="/deals"
                className="flex items-center gap-1 text-xs text-[#2563eb] font-medium hover:opacity-70 transition-opacity duration-100"
              >
                View all <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-px">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full bg-[#f5f5f5]" />
                ))}
              </div>
            ) : recentDeals.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[#a3a3a3]">No deals yet.</p>
                <Link to="/deals" className="text-sm text-[#2563eb] hover:opacity-70 transition-opacity mt-1 inline-block">
                  Add your first deal
                </Link>
              </div>
            ) : (
              <div>
                {recentDeals.map((deal, idx) => {
                  const d = deal.data ?? deal
                  return (
                    <div
                      key={deal.row_id ?? idx}
                      className={`flex items-center justify-between py-3.5 group transition-colors duration-100 ${
                        idx < recentDeals.length - 1 ? 'border-b border-[#e5e5e5]/60' : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <p className="text-sm font-medium text-[#404040] group-hover:text-[#171717] transition-colors duration-100 truncate">
                          {d.title || '—'}
                        </p>
                        <p className="text-xs text-[#a3a3a3] mt-0.5 truncate">
                          {d.contact_name || d.company_name || 'No contact'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-sm font-semibold text-[#262626]">
                          {formatValue(d.value)}
                        </span>
                        {d.stage && <StageBadge stage={d.stage} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Recent Activities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[1.0625rem] font-semibold text-[#171717] tracking-tight">
                Recent Activities
              </h2>
              <Link
                to="/activities"
                className="flex items-center gap-1 text-xs text-[#2563eb] font-medium hover:opacity-70 transition-opacity duration-100"
              >
                View all <ArrowRight size={12} strokeWidth={2} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-px">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full bg-[#f5f5f5]" />
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[#a3a3a3]">No activities yet.</p>
                <Link to="/activities" className="text-sm text-[#2563eb] hover:opacity-70 transition-opacity mt-1 inline-block">
                  Log your first activity
                </Link>
              </div>
            ) : (
              <div>
                {recentActivities.map((act, idx) => {
                  const a = act.data ?? act
                  const TypeIcon = activityIcons[a.type] ?? CalendarCheck
                  const done = a.completed === true || a.completed === 'true'
                  return (
                    <div
                      key={act.row_id ?? idx}
                      className={`flex items-center gap-3 py-3.5 group transition-colors duration-100 ${
                        idx < recentActivities.length - 1 ? 'border-b border-[#e5e5e5]/60' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#f5f5f5] flex items-center justify-center">
                        <TypeIcon size={13} strokeWidth={1.5} className="text-[#737373]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#404040] group-hover:text-[#171717] transition-colors duration-100 truncate">
                          {a.title || '—'}
                        </p>
                        <p className="text-xs text-[#a3a3a3] mt-0.5 truncate">
                          {a.contact_name || 'No contact'}
                        </p>
                      </div>
                      <span
                        className="flex-shrink-0 text-[0.6875rem] font-medium rounded-[0.25rem] px-2 py-0.5"
                        style={
                          done
                            ? { backgroundColor: '#f0fdf4', color: '#16a34a' }
                            : { backgroundColor: '#f5f5f5', color: '#737373' }
                        }
                      >
                        {done ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
