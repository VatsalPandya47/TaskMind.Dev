import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

window.addEventListener('resize', () => {
  const minWidth = 320; // Minimum width for the entire page
  if (window.innerWidth < minWidth) {
    document.body.style.width = `${minWidth}px`;
  } else {
    document.body.style.width = 'auto';
  }
});
