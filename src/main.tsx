import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext.tsx'
import './i18n'

createRoot(document.getElementById("root")!).render(
  <UserPreferencesProvider>
    <App />
  </UserPreferencesProvider>
);
