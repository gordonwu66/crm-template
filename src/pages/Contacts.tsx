import { useEffect, useState } from 'react'
import { table } from '../lib/api'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
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
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Mail, Phone } from 'lucide-react'

const TABLE_ID = 'db2d8a7d8ffc4445a1e06ad62c0f876a'

const statusColors: Record<string, string> = {
  'Lead': 'bg-blue-100 text-blue-700',
  'Prospect': 'bg-yellow-100 text-yellow-700',
  'Customer': 'bg-green-100 text-green-700',
  'Churned': 'bg-red-100 text-red-700',
}

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '',
  company: '', status: 'Lead', source: '', notes: ''
}

export default function Contacts() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')

  const loadContacts = async () => {
    const res = await table(TABLE_ID).getRows({ sort: [{ column: 'first_name', direction: 'asc' }] })
    if (res.success) setContacts(res.data as any[])
    setLoading(false)
  }

  useEffect(() => { loadContacts() }, [])

  const openAdd = () => { setForm({ ...emptyForm }); setEditing(null); setDialogOpen(true) }
  const openEdit = (c: any) => {
    setForm({
      first_name: c.first_name || '', last_name: c.last_name || '',
      email: c.email || '', phone: c.phone || '',
      company: c.company || '', status: c.status || 'Lead',
      source: c.source || '', notes: c.notes || ''
    })
    setEditing(c.row_id)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.first_name.trim()) { toast.error('First name is required'); return }
    setSaving(true)
    const res = editing
      ? await table(TABLE_ID).updateRow(editing, form as any)
      : await table(TABLE_ID).insertRow(form as any)
    if (res.success) {
      toast.success(editing ? 'Contact updated!' : 'Contact added!')
      setDialogOpen(false)
      loadContacts()
    } else {
      toast.error('Something went wrong')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this contact?')) return
    const res = await table(TABLE_ID).deleteRow(String(id))
    if (res.success) { toast.success('Contact deleted'); loadContacts() }
    else toast.error('Could not delete contact')
  }

  const filtered = contacts.filter(c => {
    const name = `${c.first_name} ${c.last_name} ${c.email} ${c.company}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const initials = (c: any) => `${c.first_name?.[0] || ''}${c.last_name?.[0] || ''}`.toUpperCase() || '?'
  const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500']
  const getColor = (id: string | number) => avatarColors[Number(id) % avatarColors.length]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 text-sm mt-0.5">{contacts.length} total contacts</p>
        </div>
        <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Lead', 'Prospect', 'Customer', 'Churned'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No contacts found</p>
          <p className="text-sm mt-1">Try adjusting your search or add a new contact</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.row_id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getColor(c.row_id)}`}>
                    {initials(c)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-gray-500">{c.company || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                    {c.status || '—'}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
                        <MoreHorizontal size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(c)}>
                        <Pencil size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(c.row_id)}>
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="space-y-1.5">
                {c.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={13} className="text-gray-400" />
                    <a href={`mailto:${c.email}`} className="hover:text-blue-600 truncate">{c.email}</a>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={13} className="text-gray-400" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.source && (
                  <div className="text-xs text-gray-400 mt-1">Source: {c.source}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="Jane" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Doe" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 0123" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." className="mt-1" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Lead', 'Prospect', 'Customer', 'Churned'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={v => setForm({ ...form, source: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select source..." /></SelectTrigger>
                <SelectContent>
                  {['Website', 'Referral', 'Cold Outreach', 'Event', 'Social Media', 'Other'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." className="mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
