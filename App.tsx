
import React, { useState, useEffect } from 'react';
import {
  Building2,
  BookOpen,
  LayoutDashboard,
  Truck,
  Search,
  Info,
  MapPin,
  ClipboardCheck,
  Settings as SettingsIcon,
  Phone,
  User,
  X,
  ArrowRight,
  Camera,
  Trash2,
  Loader2,
  Cloud as CloudCheck,
  CloudOff,
  Leaf
} from 'lucide-react';
import { ref, onValue, set } from "firebase/database";
import { db } from './firebase';
import { AppView, Company, SOPStep } from './types';
import { INITIAL_SOP_STEPS } from './constants';
import { CompanyList } from './components/CompanyList';
import { CompanyImporter } from './components/CompanyImporter';
import { TrainingGuide } from './components/TrainingGuide';
import { SOPStepEditor } from './components/SOPStepEditor';
import { CompanyDetails } from './components/CompanyDetails';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sopSteps, setSopSteps] = useState<SOPStep[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialEditMode, setInitialEditMode] = useState(false);

  // Real-time synchronization with Firebase
  useEffect(() => {
    const companiesRef = ref(db, 'companies');
    const sopRef = ref(db, 'sopSteps');

    const unsubCompanies = onValue(companiesRef, (snapshot) => {
      const data = snapshot.val();
      setCompanies(data || []);
      setIsLoading(false);
    });

    const unsubSop = onValue(sopRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSopSteps(data);
      } else {
        // Seed initial steps if empty
        set(sopRef, INITIAL_SOP_STEPS);
      }
    });

    return () => {
      unsubCompanies();
      unsubSop();
    };
  }, []);

  const syncData = async (path: string, data: any) => {
    setIsSyncing(true);
    try {
      await set(ref(db, path), data);
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to save to cloud. Check your connection.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportCompanies = (newCompanies: Company[]) => {
    const updated = [...companies, ...newCompanies];
    syncData('companies', updated);
    setActiveView('companies');
  };

  const handleDeleteCompany = (id: string) => {
    // Confirmation handled in UI
    const updated = companies.filter(c => c.id !== id);
    syncData('companies', updated);
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    const updated = companies.map(c => c.id === updatedCompany.id ? updatedCompany : c);
    syncData('companies', updated);
  };

  const handleUpdateStepImage = (stepId: number, base64Image: string) => {
    const updated = sopSteps.map(step =>
      step.id === stepId ? { ...step, image: base64Image } : step
    );
    syncData('sopSteps', updated);
  };

  const handleSelectCompany = (id: string, edit: boolean = false) => {
    setSelectedCompanyId(id);
    setInitialEditMode(edit);
  };

  const clearAllData = () => {
    if (confirm("DANGER: This will permanently wipe all cloud data. Proceed?")) {
      syncData('companies', []);
      syncData('sopSteps', INITIAL_SOP_STEPS);
      setActiveView('dashboard');
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  const NavItem: React.FC<{ view: AppView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => { setActiveView(view); setSelectedCompanyId(null); }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${activeView === view
        ? 'bg-emerald-800 text-white shadow-lg'
        : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-emerald-800 animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Connecting to Bellabona Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveView('dashboard'); setSelectedCompanyId(null); }}>
            <h1 className="text-xl font-black text-emerald-950 tracking-tight block">BELLABONA</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <NavItem view="dashboard" icon={<Search className="w-4 h-4" />} label="Lookup" />
            <NavItem view="companies" icon={<Building2 className="w-4 h-4" />} label="Database" />
            <NavItem view="training" icon={<BookOpen className="w-4 h-4" />} label="SOP Setup" />
            <NavItem view="driver-view" icon={<ClipboardCheck className="w-4 h-4" />} label="SOP Guide" />
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center">
              {isSyncing ? (
                <div className="flex items-center text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Syncing
                </div>
              ) : (
                <div className="flex items-center text-green-500 text-[10px] font-bold uppercase tracking-widest">
                  <CloudCheck className="w-3 h-3 mr-1" />
                  Cloud Connected
                </div>
              )}
            </div>
            <button
              onClick={() => { setActiveView('settings'); setSelectedCompanyId(null); }}
              className={`p-2 rounded-full transition-colors ${activeView === 'settings' ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-3 md:p-6">
        {activeView === 'dashboard' && !selectedCompanyId && (
          <div className="max-w-2xl mx-auto mt-6 animate-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Company Search</h2>
              <p className="text-gray-500 text-sm">Enter company name for details.</p>
            </div>

            <div className="relative group mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                placeholder="Type company name..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-base shadow-lg focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-3">
              {searchQuery && filteredCompanies.length > 0 ? (
                filteredCompanies.slice(0, 8).map(company => {
                  const hasData = company.deliveryDetails || company.images?.length;
                  return (
                    <div
                      key={company.id}
                      className="w-full bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-700 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900">{company.name}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {company.address}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSelectCompany(company.id, false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${hasData ? 'bg-emerald-800 text-white shadow-lg hover:bg-emerald-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleSelectCompany(company.id, true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!hasData ? 'bg-amber-500 text-white shadow-lg hover:bg-amber-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : searchQuery ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 font-medium">No company found with that name.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-800 font-black text-xs uppercase tracking-widest block mb-2">Instructions</span>
                    <p className="text-sm text-emerald-900 font-medium">Search for your next delivery stop to view site specific info.</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-gray-700 font-black text-xs uppercase tracking-widest block mb-2">Quick Access</span>
                    <button onClick={() => setActiveView('driver-view')} className="text-sm text-gray-800 font-bold flex items-center hover:text-emerald-700 transition-colors">
                      View SOP Steps <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCompanyId && selectedCompany && activeView === 'dashboard' && (
          <div className="max-w-3xl mx-auto animate-in">
            <button
              onClick={() => setSelectedCompanyId(null)}
              className="mb-6 flex items-center text-gray-500 hover:text-gray-900 font-bold"
            >
              <X className="w-5 h-5 mr-2" />
              Back to Search
            </button>
            <CompanyDetails
              company={selectedCompany}
              onUpdate={handleUpdateCompany}
              initialEditMode={initialEditMode}
            />
          </div>
        )}

        {activeView === 'companies' && (
          <div className="space-y-6 animate-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black">Company Registry</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter database..."
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CompanyList companies={filteredCompanies} onDelete={handleDeleteCompany} />
          </div>
        )}

        {activeView === 'training' && (
          <div className="space-y-6 animate-in">
            <h2 className="text-2xl font-black">SOP Visual Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sopSteps.map(step => (
                <SOPStepEditor key={step.id} step={step} onImageUpdate={(img) => handleUpdateStepImage(step.id, img)} />
              ))}
            </div>
          </div>
        )}

        {activeView === 'driver-view' && <TrainingGuide steps={sopSteps} />}

        {activeView === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in">
            <h2 className="text-2xl font-black flex items-center space-x-2">
              <SettingsIcon className="w-6 h-6" />
              <span>System Settings</span>
            </h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <CompanyImporter onImport={handleImportCompanies} />
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 flex md:hidden items-center justify-around p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => { setActiveView('dashboard'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'dashboard' ? 'text-emerald-800' : 'text-gray-400'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Lookup</span>
        </button>
        <button onClick={() => { setActiveView('driver-view'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'driver-view' ? 'text-emerald-800' : 'text-gray-400'}`}>
          <ClipboardCheck className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Guide</span>
        </button>
        <button onClick={() => { setActiveView('companies'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'companies' ? 'text-emerald-800' : 'text-gray-400'}`}>
          <Building2 className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">DB</span>
        </button>
        <button onClick={() => { setActiveView('settings'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'settings' ? 'text-emerald-800' : 'text-gray-400'}`}>
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Apps</span>
        </button>
      </nav>
    </div>
  );
};

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default App;
