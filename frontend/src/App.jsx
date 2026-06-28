import { lazy, Suspense, useState } from 'react'
import Chatbot from './components/Chatbot'
import StateBlock from './components/StateBlock'
import './App.css'

const Dashboard = lazy(() => import('./components/Dashboard'))

function App() {
  const [view, setView] = useState('chat')

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setView('chat')} aria-label="Venturizer home">
          Venturizer
        </button>
        <nav className="nav-tabs" aria-label="Primary navigation">
          <button
            className={view === 'chat' ? 'active' : ''}
            type="button"
            aria-current={view === 'chat' ? 'page' : undefined}
            onClick={() => setView('chat')}
          >
            Assistant
          </button>
          <button
            className={view === 'dashboard' ? 'active' : ''}
            type="button"
            aria-current={view === 'dashboard' ? 'page' : undefined}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main id="main-content">
        {view === 'chat' ? (
          <Chatbot />
        ) : (
          <Suspense fallback={<StateBlock title="Loading dashboard" message="Preparing lead data…" />}>
            <Dashboard />
          </Suspense>
        )}
      </main>
    </div>
  )
}

export default App
