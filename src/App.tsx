import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Companies from './pages/Companies'
import Deals from './pages/Deals'
import Activities from './pages/Activities'
import NotFound from './pages/NotFound'
import { Toaster } from './components/ui/sonner'

export default function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster richColors position="top-right" />
    </>
  )
}
