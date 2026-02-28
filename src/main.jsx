import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Debug
console.log('main.jsx loaded')
console.log('React:', React)
console.log('ReactDOM:', ReactDOM)

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

try {
  const root = ReactDOM.createRoot(rootElement)
  console.log('Root created')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('Render called')
} catch (e) {
  console.error('ERROR:', e)
  rootElement.innerHTML = '<div style="color:red;padding:20px;text-align:center">' +
    '<h2>Error Loading App</h2>' +
    '<p>' + e.message + '</p>' +
    '</div>'
}
