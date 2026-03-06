import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './enchant-optimizer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
