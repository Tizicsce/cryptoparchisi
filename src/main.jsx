import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root')
if (!root) {
  console.error('Root element not found!')
} else {
  console.log('Root element found, mounting React...')
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('React mounted successfully')
  } catch (e) {
    console.error('Error mounting React:', e)
    root.innerHTML = '<div style="color:red;padding:20px">Error: ' + e.message + '</div>'
  }
}
