import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyPrefs } from './lib/prefs';
import { startAnalytics } from './lib/analytics';
import { startExplorer } from './lib/explorer';

applyPrefs();
startAnalytics();
startExplorer();

createRoot(document.getElementById('root')!).render(<App />);
