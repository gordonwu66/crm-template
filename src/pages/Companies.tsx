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
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Globe, Phone, MapPin, Building2 } from 'lucide-react'

const TABLE_ID = 'b84dc7db43c64a8588ec8ee6ae203b00'

const industryColors: Record<string, string> = {
  'Technology': 'bg-blue-100 text-blue-700',
  'Finance': 'bg-green-100 text-green-700',
  'Healthcare': 'bg-red-100 text-red-700',
  'Retail': 'bg-yellow-100 text-yellow-700',
  'Manufacturing': 'bg-orange-100 text-orange-700',
  'Education': 'bg-purple-100 text-purple-700',
  'Real Estate': 'bg-pink-100 text-pink-700',
  'Other': 'bg-gray-100 text-gray-700',
}

const emptyForm = { name: '', industry: '', website: '', size: '', phone: '', address: '', notes: '' }

type Company = {
  row_id: number
  name?: string | null
  industry?: string | null
  website?: string | null
  size?: string | null
  phone?: string | null
  address?: string | null
  notes?: string | null
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await table(TABLE_ID).getRows({ sort: [{ column: 'name', direction: 'asc' }] })
    if (res.success) setCompanies((res.data as Company[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...emptyForm }); setEditing(null); setDialogOpen(true) }
  const openEdit = (c: Company) => {
    setForm({
      name: c.name || '', industry: c.industry || '', website: c.website || '',
      size: c.size || '', phone: c.phone || '', address: c.address || '', notes: c.notes || ''
    })
    setEditing(c.row_id)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Company name is required'); return }
    setSaving(true)
    const res = editing
      ? await table(TABLE_ID).updateRow(editing, form as any)
      : await table(TABLE_ID).insertRow(form as any)
    if (res.success) {
      toast.success(editing ? 'Company updated!' : 'Company added!')
      setDialogOpen(false)
      load()
    } else toast.error('Something went wrong')
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this company?')) return
    const res = await table(TABLE_ID).deleteRow(id)
    if (res.success) { toast.success('Company deleted'); load() }
    else toast.error('Could not delete company')
  }

  const filtered = companies.filter(c =>
    `${c.name || ''} ${c.industry || ''} ${c.address || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const acronym = (name?: string | null) =>
    name?.split(' ').filter(Boolean).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '?'
  const bgColors = ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600', 'bg-pink-600', 'bg-teal-600']
  const getBg = (id: number | string) => {
    const idString = String(id)
    const lastChar = idString.slice(-1)
    const parsed = Number.parseInt(lastChar, 16)
    const index = Number.isNaN(parsed) ? 0 : parsed % bgColors.length
    return bgColors[index]
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 text-sm mt-0.5">{companies.length} total companies</p>
        </div>
        <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> Add Company
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 max-w-md"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No companies found</p>
          <p className="text-sm mt-1">Add your first company to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.row_id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${getBg(c.row_id)}`}>
                    {acronym(c.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    {c.size && <p className="text-xs text-gray-500">{c.size} employees</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {c.industry && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${industryColors[c.industry] || 'bg-gray-100 text-gray-600'}`}>
                      {c.industry}
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-400 ml-1">
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
                {c.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe size={13} className="text-gray-400" />
                    <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 truncate">{c.website}</a>
                  </div>
                )}
                {c.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={13} className="text-gray-400" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={13} className="text-gray-400" />
                    <span className="truncate">{c.address}</span>
                  </div>
                )}
                {c.notes && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{c.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Company' : 'Add New Company'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label>Company Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Acme Inc." className="mt-1" />
            </div>
            <div>
              <Label>Industry</Label>
              <Select value={form.industry} onValueChange={v => setForm({ ...form, industry: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select industry..." /></SelectTrigger>
                <SelectContent>
                  {['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Real Estate', 'Other'].map(i => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Company Size</Label>
              <Select value={form.size} onValueChange={v => setForm({ ...form, size: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select size..." /></SelectTrigger>
                <SelectContent>
                  {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Website</Label>
              <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://acme.com" className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 0100" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City, State" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." className="mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
