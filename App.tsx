import React, { useState, useEffect } from 'react';
import ProgramForm from './components/ProgramForm';
import AdminDashboard from './components/AdminDashboard';
import PublicSchedule from './components/PublicSchedule';
import AdminLogin from './components/AdminLogin';
import { getEntries } from './services/storageService';
import { ProgramEntry, ProgramType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState<ProgramEntry[]>([]);
  const [forceAddMode, setForceAddMode] = useState(false);

  // Poll for entries to determine app state
  useEffect(() => {
    const load = () => setEntries(getEntries());
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  // Check if program is "booked" (Has Start and End Prayer)
  const hasStart = entries.some(e => e.type === ProgramType.START_PRAYER);
  const hasEnd = entries.some(e => e.type === ProgramType.END_PRAYER);
  const isProgramBooked = hasStart && hasEnd;

  // Toggle Admin/User View
  const toggleView = () => {
    if (view === 'user') {
      setView('admin');
    } else {
      setView('user');
      setForceAddMode(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Determine what to render in User View
  const renderUserView = () => {
    // If program is fully booked, show schedule. 
    // EXCEPT if user explicitly clicked "Add Item" (forceAddMode)
    if (isProgramBooked && !forceAddMode) {
      return <PublicSchedule onBack={() => setForceAddMode(true)} />;
    }
    
    // Otherwise (Incomplete OR Force Add), show Form
    return (
      <div className="max-w-md mx-auto">
         <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-church-900 mb-2">Sunday Service</h2>
            <p className="text-church-600">
              {isProgramBooked 
                ? "The main program is set, but you can still add songs." 
                : "Please select a slot to join the prayer."}
            </p>
         </div>
         <ProgramForm onSubmission={() => setForceAddMode(false)} />
         <p className="text-center text-xs text-church-400 mt-8">
           Submissions are saved automatically.
         </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-church-50 pb-20">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-church-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setView('user')}>
                <span className="text-2xl">⛪</span>
                <h1 className="font-serif font-bold text-xl text-church-900 tracking-tight">PrayerFlow</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleView}
                className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                   view === 'user' 
                   ? 'bg-church-50 text-church-600 border-church-200 hover:bg-church-100'
                   : 'bg-church-700 text-white border-church-700 hover:bg-church-800'
                }`}
              >
                {view === 'user' ? 'Admin Login' : 'Back to Public View'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="transition-all duration-300">
          {view === 'user' ? (
            renderUserView()
          ) : !isAuthenticated ? (
            <AdminLogin 
              onSuccess={handleLoginSuccess} 
              onCancel={() => setView('user')}
            />
          ) : (
            <AdminDashboard />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;