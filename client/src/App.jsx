import React, { useEffect } from 'react'
import io from 'socket.io-client'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Header from './Header'
import Footer from './Footer'
import DisasterSection from './components/DisasterSection'
import ReportSection from './components/ReportSection'
import SocialFeedSection from './components/SocialFeedSection'
import ResourceSection from './components/ResourceSection'
import VerificationSection from './components/VerificationSection'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Connect to the backend WebSocket server.
    // Replace with your actual server URL in production.
    const socket = io('http://localhost:3001') // Mock server URL

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id)
    })

    socket.on('disaster_updated', (data) => {
      console.log('Disaster updated:', data)
      // Here you would update the state of the DisasterSection component
    })

    socket.on('social_media_updated', (data) => {
      console.log('Social media updated:', data)
      // Here you would update the state of the SocialFeedSection component
    })
    
    // Disconnect on component unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <main className="flex-1 w-full">
        <DisasterSection />
        <ReportSection />
        <SocialFeedSection />
        <ResourceSection />
        <VerificationSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
