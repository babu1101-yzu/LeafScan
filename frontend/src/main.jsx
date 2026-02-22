import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    this.setState({ info })
    console.error('LeafScan Error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#050D0A', color: '#00FF87',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '2rem', fontFamily: 'monospace'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ LeafScan Error</h1>
          <pre style={{
            background: '#0A1F14', padding: '1.5rem', borderRadius: '0.5rem',
            border: '1px solid rgba(0,255,135,0.3)', maxWidth: '800px',
            overflow: 'auto', color: '#f87171', fontSize: '0.85rem'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.info?.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem', padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #00FF87, #00D4FF)',
              color: '#050D0A', border: 'none', borderRadius: '0.5rem',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
            }}
          >
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15, 45, 28, 0.95)',
            color: '#E8F5E9',
            border: '1px solid rgba(0, 255, 135, 0.3)',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(16px)',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: '500',
            letterSpacing: '0.05em',
          },
          success: {
            iconTheme: { primary: '#00FF87', secondary: '#050D0A' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#050D0A' },
          },
        }}
        />
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
