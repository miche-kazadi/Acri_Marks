import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { applyTheme } from "./hooks/useTheme";

applyTheme(
  (localStorage.getItem("theme") as "light" | "dark") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)