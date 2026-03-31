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
import { Plus, MoreHorizontal, Pencil, Trash2, Check, CalendarCheck } from 'lucide-react'

const TABLE_ID = 'bddcd59b0dca43779e3898786b84f266'

const ACTIVITY_TYPES = ['Call', 'Email', 'Meeting', 'Task', 'Note']

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  'Call':    { icon: '📞', color: 'text-blue-600',  bg: 'bg-blue-50' },
  'Email':   { icon: '✉️', color: 'text-purple-600', bg: 'bg-purple-50' },
  'Meeting': { icon: '🤝', color: 'text-green-600', bg: 'bg-green-50' },
  'Task':    { icon: '✅', color: 'text-orange-600', bg: 'bg-orange-50' },
  'Note':    { icon: '📝', color: 'text-gray-600',  bg: 'bg-gray-50' },
}

const emptyForm = {
  type: 'Call', title: '', description: '', contact_name: '',
  deal_title: '', due_date: '', completed: false
}

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [typeFilter, setTypeFilter] = useState('All')

  const load = async () => {
    const res = await table(TABLE_ID).getRows({ sort: [{ column: 'due_date', direction: 'desc' }] })
    if (res.success) setActivities(res.data as any[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...emptyForm }); setEditing(null); setDialogOpen(true) }
  const openEdit = (a: any) => {
    setForm({
      type: a.type || 'Call', title: a.title || '', description: a.description || '',
      contact_name: a.contact_name || '', deal_title: a.deal_title || '',
      due_date: a.due_date ? a.due_date.slice(0, 16) : '', completed: a.completed || false
    })
    setEditing(a.row_id)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    const res = editing
      ? await table(TABLE_ID).updateRow(editing, form as any)
      : await table(TABLE_ID).insertRow(form as any)
    if (res.success) {
      toast.success(editing ? 'Activity updated!' : 'Activity logged!')
      setDialogOpen(false)
      load()
    } else toast.error('Something went wrong')
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this activity?')) return
    const res = await table(TABLE_ID).deleteRow(id)
    if (res.success) { toast.success('Activity deleted'); load() }
    else toast.error('Could not delete activity')
  }

  const toggleComplete = async (a: any) => {
    const res = await table(TABLE_ID).updateRow(a.row_id, { completed: !a.completed })
    if (res.success) {
      setActivities(activities.map(act => act.row_id === a.row_id ? { ...act, completed: !act.completed } : act))
      toast.success(a.completed ? 'Marked as pending' : 'Marked as complete!')
    }
  }

  const filtered = activities.filter(a => {
    const matchStatus = filter === 'all' || (filter === 'pending' && !a.completed) || (filter === 'completed' && a.completed)
    const matchType = typeFilter === 'All' || a.type === typeFilter
    return matchStatus && matchType
  })

  const pending = activities.filter(a => !a.completed).length
  const completed = activities.filter(a => a.completed).length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pending} pending &bull; {completed} completed</p>
        </div>
        <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> Log Activity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['All', ...ACTIVITY_TYPES].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                typeFilter === t ? 'bg-slate-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t !== 'All' && typeConfig[t]?.icon} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CalendarCheck size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No activities found</p>
          <p className="text-sm mt-1">Log a call, email, meeting, or task to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const cfg = typeConfig[a.type] || typeConfig['Note']
            return (
              <div
                key={a.row_id}
                className={`flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm transition-all ${a.completed ? 'opacity-60' : ''}`}
              >
                {/* Complete button */}
                <button
                  onClick={() => toggleComplete(a)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                    a.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {a.completed && <Check size={12} />}
                </button>

                {/* Icon */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg ${cfg.bg}`}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-medium text-gray-800 ${a.completed ? 'line-through' : ''}`}>{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-xs font-medium ${cfg.color}`}>{a.type}</span>
                        {a.contact_name && <span className="text-xs text-gray-400">· {a.contact_name}</span>}
                        {a.deal_title && <span className="text-xs text-gray-400">· {a.deal_title}</span>}
                        {a.due_date && (
                          <span className="text-xs text-gray-400">
                            · {new Date(a.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      {a.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-400 flex-shrink-0">
                          <MoreHorizontal size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(a)}>
                          <Pencil size={13} className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(a.row_id)}>
                          <Trash2 size={13} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Activity' : 'Log New Activity'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{typeConfig[t]?.icon} {t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due Date / Time</Label>
              <Input type="datetime-local" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Follow up on proposal" className="mt-1" />
            </div>
            <div>
              <Label>Contact Name</Label>
              <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Jane Doe" className="mt-1" />
            </div>
            <div>
              <Label>Deal Title</Label>
              <Input value={form.deal_title} onChange={e => setForm({ ...form, deal_title: e.target.value })} placeholder="Enterprise License" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Activity notes or description..." className="mt-1" rows={3} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="completed"
                checked={form.completed}
                onChange={e => setForm({ ...form, completed: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <Label htmlFor="completed" className="cursor-pointer">Mark as completed</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Log Activity'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
