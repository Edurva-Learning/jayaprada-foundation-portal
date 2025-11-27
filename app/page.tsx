import Dashboard from './components/Dashboard';

export default function Home() {
  // Landing page for unauthenticated users: show dashboard stats
  // without the welcome header or side panel.
  return <main className="min-h-screen bg-gray-50"><Dashboard showWelcome={false} /></main>;
}