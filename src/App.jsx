
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { UserProvider } from './contexts/UserContext'
import Home from './pages/Home'
import Account from './pages/Account'
import Favorites from './pages/Favorites'
import MyListings from './pages/MyListings'
import Settings from './pages/Settings'
import ListingDetail from './pages/ListingDetail'
import SellerProfile from './pages/SellerProfile'
import Categories from './pages/Categories'
import Balance from './pages/Balance'
import CreateListing from './pages/CreateListing'

function App() {
  console.log('App rendering WITH UserContext and Real Components')
  return (
    <UserProvider>
      <BrowserRouter future={{ 
        v7_relativeSplatPath: true,
        v7_startTransition: true 
      }}>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/account" element={<Layout><Account /></Layout>} />
          <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
          <Route path="/my-listings" element={<Layout><MyListings /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/listing/:id" element={<Layout><ListingDetail /></Layout>} />
          <Route path="/seller/:id" element={<Layout><SellerProfile /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />
          <Route path="/balance" element={<Layout><Balance /></Layout>} />
          <Route path="/create-listing" element={<Layout><CreateListing /></Layout>} />
          <Route path="/edit-listing/:id" element={<Layout><CreateListing /></Layout>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
