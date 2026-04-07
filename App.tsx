
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
  Cloud,
  CloudOff,
  AlertTriangle
} from 'lucide-react';
import { ref, onValue, set } from "firebase/database";
import { db, DB_URL } from './firebase';
import { AppView, Company, SOPStep } from './types';
import { INITIAL_SOP_STEPS } from './constants';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { CompanyList } from './components/CompanyList';
import { CompanyImporter } from './components/CompanyImporter';
import { TrainingGuide } from './components/TrainingGuide';
import { SOPStepEditor } from './components/SOPStepEditor';
import { CompanyDetails } from './components/CompanyDetails';

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as any)}
        className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer appearance-none pr-2"
      >
        <option value="auto">Auto Lang</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="tr">Türkçe</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sopSteps, setSopSteps] = useState<SOPStep[]>(INITIAL_SOP_STEPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [customDbUrl, setCustomDbUrl] = useState(localStorage.getItem('custom_db_url') || '');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Real-time synchronization with Firebase
  useEffect(() => {
    console.log("App mounted, initializing listeners...");
    
    if (!db) {
      console.error("Database reference is missing. Check firebase.ts initialization.");
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setConnectionStatus('disconnected');
      }, 2000);
      return () => clearTimeout(timeout);
    }

    const handlePermissionError = (error: any) => {
      console.error("Permission Error Detected:", error);
      if (error.message?.includes('permission_denied') || error.code === 'PERMISSION_DENIED') {
        setHasPermissionError(true);
      }
    };

    const companiesRef = ref(db, 'companies');
    const sopRef = ref(db, 'sopSteps');

    console.log("Setting up onValue listeners...");
    
    const unsubCompanies = onValue(companiesRef, (snapshot) => {
      console.log("Companies data received from Firebase");
      const data = snapshot.val();
      setCompanies(data || []);
      setIsLoading(false);
      setHasPermissionError(false);
    }, (error) => {
      console.error("Firebase companies listener error:", error);
      handlePermissionError(error);
      setIsLoading(false); 
    });

    const unsubSop = onValue(sopRef, (snapshot) => {
      console.log("SOP data received from Firebase");
      const data = snapshot.val();
      console.log("Raw SOP data from Firebase:", data);
      if (data) {
        // Handle both array and object formats from Firebase
        let stepsArray = Array.isArray(data) 
          ? data.filter(Boolean) 
          : Object.values(data);
        
        // Ensure they are objects to prevent crashes
        stepsArray = stepsArray.filter(s => s && typeof s === 'object');
        
        // Deep Recovery: Automatically fix missing image fields or missing prefixes
        let recoveryCount = 0;
        stepsArray = (stepsArray as SOPStep[]).map(step => {
          let currentImage = step.image;
          
          // 1. If 'image' is missing, look for ANY field that looks like image data
          if (!currentImage) {
            const keys = Object.keys(step);
            const imageKey = keys.find(k => {
              const val = (step as any)[k];
              // Check for base64 strings or URLs in any field
              return typeof val === 'string' && (
                val.startsWith('data:image') || 
                val.startsWith('http') || 
                (val.length > 200 && /^[A-Za-z0-9+/=]+$/.test(val.substring(0, 100)))
              );
            });
            if (imageKey) {
              currentImage = (step as any)[imageKey];
              recoveryCount++;
              console.log(`Auto-recovered image for step ${step.id} from field '${imageKey}'`);
            }
          }

          // 2. If 'image' is an object (sometimes happens with Firebase/JSON imports)
          if (currentImage && typeof currentImage === 'object') {
            const obj = currentImage as any;
            currentImage = obj.data || obj.url || obj.uri || obj.base64 || obj.src || currentImage;
          }

          // 3. Ensure base64 prefix if it's a raw base64 string
          if (currentImage && typeof currentImage === 'string' && !currentImage.startsWith('data:') && !currentImage.startsWith('http')) {
            if (currentImage.length > 50) {
              // Try to detect if it's base64
              currentImage = `data:image/png;base64,${currentImage.trim()}`;
            }
          }

          return { ...step, image: currentImage };
        });
        
        // Ensure steps are sorted by ID for consistent display
        stepsArray = (stepsArray as SOPStep[]).sort((a, b) => (a.id || 0) - (b.id || 0));
        
        console.log(`Parsed ${stepsArray.length} SOP steps. Images detected: ${stepsArray.filter(s => !!s.image).length}. Recovered in this pass: ${recoveryCount}`);
        setSopSteps(stepsArray as SOPStep[]);
      } else {
        console.log("No SOP data found, seeding initial steps...");
        set(sopRef, INITIAL_SOP_STEPS).catch(err => {
          console.error("Seeding error:", err);
          handlePermissionError(err);
        });
      }
    }, (error) => {
      console.error("Firebase SOP listener error:", error);
      handlePermissionError(error);
    });

    // Connection Test
    const connectedRef = ref(db, '.info/connected');
    const unsubConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        console.log("Firebase connected successfully");
        setConnectionStatus('connected');
      } else {
        console.log("Firebase disconnected");
        setConnectionStatus('disconnected');
      }
    });

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(prev => {
        if (prev) {
          console.warn("Firebase connection timed out after 10s. Forcing offline mode.");
          return false;
        }
        return prev;
      });
    }, 10000);

    return () => {
      unsubCompanies();
      unsubSop();
      unsubConnected();
      clearTimeout(timeout);
    };
  }, []);

  const syncData = async (path: string, data: any) => {
    setIsSyncing(true);
    try {
      // Firebase does not allow undefined values. 
      // This removes any undefined properties before syncing.
      const cleanData = JSON.parse(JSON.stringify(data));
      await set(ref(db, path), cleanData);
    } catch (error) {
      console.error("Sync error:", error);
      alert(`Sync error:\n${error instanceof Error ? error.message : String(error)}`);
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
    if (confirm("Delete this company from the database?")) {
      const updated = companies.filter(c => c.id !== id);
      syncData('companies', updated);
    }
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    const updated = companies.map(c => c.id === updatedCompany.id ? updatedCompany : c);
    syncData('companies', updated);
  };

  const getDisplayImage = (img: string | undefined): string | undefined => {
    if (!img || typeof img !== 'string') return undefined;
    const trimmed = img.trim();
    if (trimmed.startsWith('data:') || trimmed.startsWith('http')) return trimmed;
    if (trimmed.length > 200 && !trimmed.includes('/')) return `data:image/png;base64,${trimmed}`;
    // If it's a relative path like "sop-images/...", just return it and let the browser try to resolve it
    return trimmed;
  };

  const isValidImage = (img: string | undefined): boolean => {
    const display = getDisplayImage(img);
    return !!display; // If it returns a string, consider it valid enough to try rendering
  };

  const handleUpdateStepImage = (stepId: number, base64Image: string) => {
    const updated = sopSteps.map(step => 
      step.id === stepId ? { ...step, image: base64Image } : step
    );
    syncData('sopSteps', updated);
  };

  const clearAllData = () => {
    if (confirm("DANGER: This will permanently wipe all cloud data. Proceed?")) {
      syncData('companies', []);
      syncData('sopSteps', INITIAL_SOP_STEPS);
      setActiveView('dashboard');
    }
  };

  const filteredCompanies = (companies || []).filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.address || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  const NavItem: React.FC<{ view: AppView; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => { setActiveView(view); setSelectedCompanyId(null); }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
        activeView === view 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  if (hasPermissionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full border-2 border-red-100">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6">
            <CloudOff className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Database Access Denied</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your Firebase Realtime Database rules are preventing the app from connecting. 
            Please update your rules in the Firebase Console to allow read/write access.
          </p>
          
          <div className="bg-gray-900 p-4 rounded-xl text-left mb-8 overflow-x-auto">
            <pre className="text-blue-400 text-xs font-mono">
{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
            </pre>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]"
          >
            I've updated the rules, retry
          </button>
          <p className="mt-4 text-xs text-gray-400">
            Project ID: <span className="font-mono">bellabona-logistic</span><br/>
            Database URL: <span className="font-mono text-[10px]">{db?.app.options.databaseURL || 'Not Set'}</span>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-black text-gray-900 mb-2">Connecting to Cloud</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Establishing secure connection to Bellabona Logistic database...
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all"
            >
              Retry Connection
            </button>
            <button 
              onClick={() => setIsLoading(false)}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
            >
              Continue Offline
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Status</p>
            <p className="text-[10px] text-amber-500 font-mono break-all">
              {connectionStatus === 'connecting' ? 'Waiting for Firebase response...' : 'Connection failed or slow.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        {connectionStatus === 'disconnected' && !isLoading && (
          <div className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 text-center animate-pulse">
            Working Offline - Changes will not sync to cloud
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveView('dashboard'); setSelectedCompanyId(null); }}>
            <div className="bg-blue-600 p-2 rounded-xl shadow-md">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight hidden sm:block">LogiTrain</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem view="dashboard" icon={<Search className="w-4 h-4" />} label="Lookup" />
            <NavItem view="companies" icon={<Building2 className="w-4 h-4" />} label="Database" />
            <NavItem view="training" icon={<BookOpen className="w-4 h-4" />} label="SOP Setup" />
            <NavItem view="driver-view" icon={<ClipboardCheck className="w-4 h-4" />} label="SOP Guide" />
          </nav>

          <div className="flex items-center space-x-4">
             <LanguageSwitcher />
             <div className="hidden sm:flex items-center">
                {isSyncing ? (
                   <div className="flex items-center text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                     <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                     Syncing
                   </div>
                ) : connectionStatus === 'connected' ? (
                   <div className="flex items-center text-green-500 text-[10px] font-bold uppercase tracking-widest">
                     <Cloud className="w-3 h-3 mr-1" />
                     Cloud Connected
                   </div>
                ) : (
                   <button 
                     onClick={() => window.location.reload()}
                     className="flex items-center text-red-400 text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
                   >
                     <CloudOff className="w-3 h-3 mr-1" />
                     Offline Mode (Tap to Reconnect)
                   </button>
                )}
             </div>
             <button 
                onClick={() => { setActiveView('settings'); setSelectedCompanyId(null); }}
                className={`p-2 rounded-full transition-colors ${activeView === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {activeView === 'dashboard' && !selectedCompanyId && (
          <div className="max-w-2xl mx-auto mt-6 md:mt-12 animate-in">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 md:mb-4">Company Search</h2>
              <p className="text-gray-500 text-base md:text-lg">Enter company name to see delivery instructions & photos.</p>
            </div>

            <div className="relative group mb-8">
              <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Type company name..." 
                className="w-full pl-12 md:pl-14 pr-4 py-4 md:py-5 bg-white border-2 border-gray-100 rounded-2xl md:rounded-3xl text-lg md:text-xl shadow-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-3">
              {searchQuery && filteredCompanies.length > 0 ? (
                filteredCompanies.slice(0, 8).map(company => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompanyId(company.id)}
                    className="w-full bg-white p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="bg-blue-50 p-2 md:p-3 rounded-lg md:rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">{company.name}</h4>
                        <div className="flex items-center text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {company.address}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                ))
              ) : searchQuery ? (
                <div className="text-center py-10">
                   <p className="text-gray-400 font-medium">No company found with that name.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-5 md:p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <span className="text-blue-700 font-black text-[10px] md:text-xs uppercase tracking-widest block mb-2">Instructions</span>
                      <p className="text-sm text-blue-800 font-medium">Search for your next delivery stop to view site specific info.</p>
                   </div>
                   <div className="p-5 md:p-6 bg-gray-50 rounded-2xl border border-gray-200">
                      <span className="text-gray-700 font-black text-[10px] md:text-xs uppercase tracking-widest block mb-2">Quick Access</span>
                      <button onClick={() => setActiveView('driver-view')} className="text-sm text-gray-800 font-bold flex items-center hover:text-blue-600 transition-colors">
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
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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

            {hasPermissionError && (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900">Database Permission Denied</h4>
                  <p className="text-sm text-red-700 mt-1">
                    The application cannot read or write to the cloud database. Please check your Firebase Security Rules or contact your administrator.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Cloud Configuration</h3>
                <p className="text-xs text-gray-500 mb-4">Current database endpoint being used by the app.</p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-mono text-[10px] break-all text-gray-600">
                  {DB_URL}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Manual Database Override</h4>
                <p className="text-[10px] text-gray-500 mb-3">If you have a specific Firebase URL from yesterday, enter it here to reconnect.</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://your-project.firebaseio.com"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={customDbUrl}
                    onChange={(e) => setCustomDbUrl(e.target.value)}
                  />
                  <button 
                    onClick={() => {
                      if (customDbUrl) {
                        localStorage.setItem('custom_db_url', customDbUrl);
                        alert("Database URL updated. The app will reload to apply changes.");
                        window.location.reload();
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button 
                    onClick={() => {
                      const legacyUrl = "https://bellabona-logistic.firebaseio.com";
                      setCustomDbUrl(legacyUrl);
                      localStorage.setItem('custom_db_url', legacyUrl);
                      alert("Trying legacy URL format. App will reload.");
                      window.location.reload();
                    }}
                    className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-200 transition-colors"
                  >
                    Try Legacy URL
                  </button>
                  {localStorage.getItem('custom_db_url') && (
                    <button 
                      onClick={() => {
                        localStorage.removeItem('custom_db_url');
                        alert("Override cleared. Reloading...");
                        window.location.reload();
                      }}
                      className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">SOP Steps</p>
                  <p className="text-2xl font-black text-blue-900">{sopSteps.length}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1">Steps with Images</p>
                  <p className="text-2xl font-black text-indigo-900">{sopSteps.filter(s => !!s.image).length}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Data Health & Recovery</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h5 className="text-sm font-bold text-gray-900 mb-2">Deep Scan Results</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Total SOP Steps:</span>
                        <span className="font-mono font-bold">{sopSteps.length}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Steps with 'image' field:</span>
                        <span className="font-mono font-bold text-blue-600">{sopSteps.filter(s => !!s.image).length}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Steps with hidden image data:</span>
                        <span className="font-mono font-bold text-amber-600">
                          {sopSteps.filter(s => {
                            const keys = Object.keys(s);
                            return !s.image && keys.some(k => {
                              const val = (s as any)[k];
                              return typeof val === 'string' && (val.startsWith('data:image') || val.startsWith('http'));
                            });
                          }).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => {
                        if (confirm("This will overwrite the cloud data with the current recovered images. Proceed?")) {
                          syncData('sopSteps', sopSteps);
                          alert("Cloud data repaired and synced.");
                        }
                      }}
                      className="text-[10px] bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all"
                    >
                      Repair & Sync Cloud
                    </button>

                    <button 
                      onClick={() => {
                        const recovered = sopSteps.map(step => {
                          let currentImage = step.image;
                          
                          // If no image, look in other fields
                          if (!currentImage) {
                            const keys = Object.keys(step);
                            const imageKey = keys.find(k => {
                              const val = (step as any)[k];
                              return typeof val === 'string' && (val.startsWith('data:image') || val.startsWith('http') || val.length > 500);
                            });
                            if (imageKey) {
                              currentImage = (step as any)[imageKey];
                              console.log(`Recovered image for step ${step.id} from field '${imageKey}'`);
                            }
                          }

                          // If we have a string that looks like base64 but lacks prefix, add it
                          if (currentImage && typeof currentImage === 'string' && !currentImage.startsWith('data:') && !currentImage.startsWith('http')) {
                            if (currentImage.length > 100) {
                              console.log(`Adding missing base64 prefix to image for step ${step.id}`);
                              currentImage = `data:image/png;base64,${currentImage}`;
                            }
                          }

                          return { ...step, image: currentImage };
                        });
                        syncData('sopSteps', recovered);
                        alert("Deep recovery attempt complete. Check your steps.");
                      }}
                      className="text-[10px] bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all"
                    >
                      Deep Image Recovery
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log("FULL DATABASE STATE:", { companies, sopSteps });
                        alert("Full database state logged to browser console (F12 -> Console).");
                      }}
                      className="text-[10px] bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Inspect Raw Objects
                    </button>
                  </div>

                  <details className="group">
                    <summary className="text-xs text-blue-600 font-bold cursor-pointer hover:underline list-none flex items-center">
                      <ChevronRight className="w-3 h-3 mr-1 group-open:rotate-90 transition-transform" />
                      View Raw Cloud Data (JSON)
                    </summary>
                    <pre className="mt-4 p-4 bg-gray-900 text-green-400 text-[10px] rounded-2xl overflow-auto max-h-64 font-mono">
                      {JSON.stringify(sopSteps, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <CompanyImporter onImport={handleImportCompanies} />
              </div>
            </div>

            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-red-900">Cloud Data Reset</h4>
                <p className="text-sm text-red-700">Warning: This clears the entire Firebase database.</p>
              </div>
              <button onClick={clearAllData} className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-red-700 transition-colors">
                Clear Cloud Data
              </button>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 flex md:hidden items-center justify-around p-3 z-50">
        <button onClick={() => { setActiveView('dashboard'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Lookup</span>
        </button>
        <button onClick={() => { setActiveView('driver-view'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'driver-view' ? 'text-blue-600' : 'text-gray-400'}`}>
          <ClipboardCheck className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Guide</span>
        </button>
        <button onClick={() => { setActiveView('companies'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'companies' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Building2 className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">DB</span>
        </button>
        <button onClick={() => { setActiveView('settings'); setSelectedCompanyId(null); }} className={`p-2 flex flex-col items-center ${activeView === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}>
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Apps</span>
        </button>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
