import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import gsap from 'gsap'
import './index.css'
import App from './App.jsx'

// Expose gsap globally so the modern-mode animation helpers can use window.gsap
window.gsap = gsap

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
