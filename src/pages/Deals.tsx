import { useEffect, useState } from 'react'
import { table } from '../lib/api'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Skeleton } from '../components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '../components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '../components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'

const TABLE_ID = '9a554477c5234eda86046528b9977300'

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

const stageConfig: Record<string, { color: string; bg: string; header: string }> = {
  'Prospecting':   { color: 'text-gray-600',   bg: 'bg-gray-50',    header: 'bg-gray-200' },
  'Qualification': { color: 'text-blue-600',   bg: 'bg-blue-50',   header: 'bg-blue-200' },
  'Proposal':      { color: 'text-yellow-700', bg: 'bg-yellow-50', header: 'bg-yellow-200' },
  'Negotiation':   { color: 'text-orange-600', bg: 'bg-orange-50', header: 'bg-orange-200' },
  'Closed Won':    { color: 'text-green-700',  bg: 'bg-green-50',  header: 'bg-green-200' },
  'Closed Lost':   { color: 'text-red-600',    bg: 'bg-red-50',    header: 'bg-red-200' },
}

const emptyForm = {
  title: '', value: '', stage: 'Prospecting', contact_name: '',
  company_name: '', close_date: '', probability: '', notes: ''
}

// ── Draggable Deal Card ─────────────────────────────────────────────────────
function DealCard({ d, onEdit, onDelete, isDragging = false }: {
  d: any
  onEdit: (d: any) => void
  onDelete: (id: string) => void
  isDragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: d.row_id })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow group select-none cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-1 mb-2">
        <p className="text-sm font-medium text-gray-800 leading-snug flex-1">
          {d.title}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-0.5 rounded hover:bg-gray-100 text-gray-400 flex-shrink-0"
              onPointerDown={e => e.stopPropagation()}
            >
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(d)}>
              <Pencil size={13} className="mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(d.row_id)}>
              <Trash2 size={13} className="mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {(d.contact_name || d.company_name) && (
        <p className="text-xs text-gray-500 mb-1.5">{d.contact_name || d.company_name}</p>
      )}
      <div className="flex items-center justify-between">
        {d.value ? (
          <span className="text-sm font-semibold text-gray-700">${Number(d.value).toLocaleString()}</span>
        ) : (
          <span className="text-xs text-gray-400">No value</span>
        )}
        {d.close_date && (
          <span className="text-xs text-gray-400">{new Date(d.close_date).toLocaleDateString()}</span>
        )}
      </div>
      {d.probability && (
        <div className="mt-2">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(100, Number(d.probability))}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{d.probability}% probability</p>
        </div>
      )}
    </div>
  )
}

// Lightweight ghost card shown in DragOverlay (no drag hooks)
function DealCardGhost({ d }: { d: any }) {
  return (
    <div className="bg-white rounded-lg border-2 border-blue-400 p-3 shadow-xl rotate-2 w-64 select-none">
      <p className="text-sm font-medium text-gray-800 leading-snug mb-1">{d.title}</p>
      {(d.contact_name || d.company_name) && (
        <p className="text-xs text-gray-500">{d.contact_name || d.company_name}</p>
      )}
      {d.value && (
        <p className="text-sm font-semibold text-gray-700 mt-1">${Number(d.value).toLocaleString()}</p>
      )}
    </div>
  )
}

// ── Droppable Column ────────────────────────────────────────────────────────
function DroppableColumn({
  stage, cfg, stageDealList, stageVal, onAdd, onEdit, onDelete, activeDealId,
}: {
  stage: string
  cfg: { color: string; bg: string; header: string }
  stageDealList: any[]
  stageVal: number
  onAdd: (stage: string) => void
  onEdit: (d: any) => void
  onDelete: (id: string) => void
  activeDealId: string | null
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div className="flex-shrink-0 w-64 flex flex-col">
      {/* Column header */}
      <div className={`rounded-t-xl px-3 py-2.5 ${cfg.header}`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${cfg.color}`}>{stage}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full bg-white/70 font-medium ${cfg.color}`}>
            {stageDealList.length}
          </span>
        </div>
        {stageVal > 0 && (
          <p className={`text-xs mt-0.5 ${cfg.color} opacity-80`}>
            ${stageVal.toLocaleString()}
          </p>
        )}
      </div>

      {/* Cards drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-b-xl p-2 min-h-32 space-y-2 transition-colors ${cfg.bg} ${
          isOver ? 'ring-2 ring-blue-400 ring-inset brightness-95' : ''
        }`}
      >
        {stageDealList.map(d => (
          <DealCard
            key={d.row_id}
            d={d}
            onEdit={onEdit}
            onDelete={onDelete}
            isDragging={d.row_id === activeDealId}
          />
        ))}
        <button
          onClick={() => onAdd(stage)}
          className={`w-full py-2 text-xs font-medium rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors ${cfg.bg}`}
        >
          + Add deal
        </button>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function Deals() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [activeDeal, setActiveDeal] = useState<any | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const load = async () => {
    const res = await table(TABLE_ID).getRows()
    if (res.success) setDeals(res.data as any[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = (stage = 'Prospecting') => {
    setForm({ ...emptyForm, stage })
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (d: any) => {
    setForm({
      title: d.title || '', value: d.value?.toString() || '', stage: d.stage || 'Prospecting',
      contact_name: d.contact_name || '', company_name: d.company_name || '',
      close_date: d.close_date || '', probability: d.probability?.toString() || '', notes: d.notes || ''
    })
    setEditing(d.row_id)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Deal title is required'); return }
    setSaving(true)
    const payload = {
      ...form,
      value: form.value ? Number(form.value) : null,
      probability: form.probability ? Number(form.probability) : null,
    }
    const res = editing
      ? await table(TABLE_ID).updateRow(editing, payload as any)
      : await table(TABLE_ID).insertRow(payload as any)
    if (res.success) {
      toast.success(editing ? 'Deal updated!' : 'Deal added!')
      setDialogOpen(false)
      load()
    } else toast.error('Something went wrong')
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this deal?')) return
    const res = await table(TABLE_ID).deleteRow(id)
    if (res.success) { toast.success('Deal deleted'); load() }
    else toast.error('Could not delete deal')
  }

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find(d => d.row_id === event.active.id)
    setActiveDeal(deal ?? null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDeal(null)

    if (!over) return                         // dropped outside any column
    const newStage = over.id as string
    const deal = deals.find(d => d.row_id === active.id)
    if (!deal || deal.stage === newStage) return  // no change

    // Optimistic update
    const prevDeals = deals
    setDeals(prev => prev.map(d => d.row_id === deal.row_id ? { ...d, stage: newStage } : d))

    const res = await table(TABLE_ID).updateRow(deal.row_id, { stage: newStage } as any)
    if (!res.success) {
      setDeals(prevDeals)                     // rollback
      toast.error('Could not move deal — changes reverted')
    } else {
      toast.success(`Moved to ${newStage}`)
    }
  }

  const stageDeals = (stage: string) => deals.filter(d => d.stage === stage)
  const stageValue = (stage: string) => stageDeals(stage).reduce((s, d) => s + (Number(d.value) || 0), 0)
  const totalPipeline = deals.filter(d => d.stage !== 'Closed Lost').reduce((s, d) => s + (Number(d.value) || 0), 0)

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {deals.length} deals &bull; ${totalPipeline.toLocaleString()} pipeline value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              List
            </button>
          </div>
          <Button onClick={() => openAdd()} className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" /> Add Deal
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(s => <Skeleton key={s} className="h-64 w-64 flex-shrink-0 rounded-xl" />)}
        </div>
      ) : view === 'kanban' ? (
        /* ── Kanban Board with DnD ── */
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map(stage => (
              <DroppableColumn
                key={stage}
                stage={stage}
                cfg={stageConfig[stage]}
                stageDealList={stageDeals(stage)}
                stageVal={stageValue(stage)}
                onAdd={openAdd}
                onEdit={openEdit}
                onDelete={handleDelete}
                activeDealId={activeDeal?.row_id ?? null}
              />
            ))}
          </div>

          {/* Floating card shown while dragging */}
          <DragOverlay dropAnimation={null}>
            {activeDeal ? <DealCardGhost d={activeDeal} /> : null}
          </DragOverlay>
        </DndContext>
      ) : (
        /* ── List View (unchanged) ── */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Deal</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Contact / Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Stage</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Value</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Close Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {deals.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No deals yet</td></tr>
              ) : deals.map(d => {
                const cfg = stageConfig[d.stage] || stageConfig['Prospecting']
                return (
                  <tr key={d.row_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{d.title}</td>
                    <td className="px-4 py-3 text-gray-500">{d.contact_name || d.company_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${cfg.header} ${cfg.color}`}>
                        {d.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">
                      {d.value ? `$${Number(d.value).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {d.close_date ? new Date(d.close_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-gray-200 text-gray-400">
                            <MoreHorizontal size={15} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(d)}><Pencil size={13} className="mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(d.row_id)}><Trash2 size={13} className="mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label>Deal Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enterprise License — Acme Corp" className="mt-1" />
            </div>
            <div>
              <Label>Value ($)</Label>
              <Input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="10000" className="mt-1" />
            </div>
            <div>
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Contact Name</Label>
              <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Jane Doe" className="mt-1" />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Acme Inc." className="mt-1" />
            </div>
            <div>
              <Label>Expected Close Date</Label>
              <Input type="date" value={form.close_date} onChange={e => setForm({ ...form, close_date: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Probability (%)</Label>
              <Input type="number" min="0" max="100" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })} placeholder="75" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Deal notes..." className="mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Deal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
