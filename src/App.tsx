import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteFooter from './components/layout/SiteFooter'
import SiteHeader from './components/layout/SiteHeader'
import Committees, { CommitteeDetail } from './pages/Committees'
import Contact from './pages/Contact'
import ExecutiveBoard from './pages/ExecutiveBoard'
import Home from './pages/Home'
import Registration from './pages/Registration'

type PlaceholderPageProps = {
  title: string
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="foundation">
      <h1>{title}</h1>
      <p className="foundation__status">Content coming soon.</p>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/committees" element={<Committees />} />
        <Route path="/committees/:slug" element={<CommitteeDetail />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/itinerary" element={<PlaceholderPage title="Itinerary" />} />
        <Route path="/executive-board" element={<ExecutiveBoard />} />
        <Route path="/secretariat" element={<PlaceholderPage title="Secretariat" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  )
}

export default App
