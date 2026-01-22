import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { BoardsProvider } from './context/BoardsContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <BoardsProvider>
        <App />
      </BoardsProvider>
    </ThemeProvider>
  </BrowserRouter>,
)
