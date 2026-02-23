
import React, { useRef, useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, Info, Copy } from 'lucide-react';
import { Company } from '../types';

interface Props {
  onImport: (companies: Company[]) => void;
}

export const CompanyImporter: React.FC<Props> = ({ onImport }) => {
  const [error, setError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processJson = (jsonString: string) => {
    try {
      const json = JSON.parse(jsonString);
      
      if (!Array.isArray(json)) {
        throw new Error("Invalid format: Expected an array of objects.");
      }

      const validCompanies: Company[] = json.map((item: any, idx: number) => {
        if (!item.name || !item.address) {
          throw new Error(`Item at index ${idx} is missing required 'name' or 'address' field.`);
        }
        return {
          id: crypto.randomUUID(),
          name: item.name,
          address: item.address,
          deliveryDetails: item.details || item.deliveryDetails || item.instruction || '',
          assignedTour: item.tour || '',
          contactPerson: item.contactPerson || item.person || item.contact || '',
          phoneNumber: item.phoneNumber || item.phone || item.mobile || '',
          images: item.images || []
        };
      });

      onImport(validCompanies);
      setError(null);
      setJsonInput('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to parse JSON data. Please check your syntax.");
      setIsSuccess(false);
    }
  };

  const handleManualImport = () => {
    if (!jsonInput.trim()) {
      setError("Please paste some JSON data first.");
      return;
    }
    processJson(jsonInput);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      processJson(event.target?.result as string);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-black text-gray-700 flex items-center space-x-2">
          <Copy className="w-4 h-4 text-blue-500" />
          <span>Batch Data Import (JSON)</span>
        </label>
        <textarea 
          className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono text-xs focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
          placeholder='[{"name": "Company X", "address": "St 44", "phone": "+123", "contact": "John Doe"}]'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button 
          onClick={handleManualImport}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <Upload className="w-5 h-5" />
          <span>Process & Merge Data</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
          <span className="px-4 bg-white text-gray-400">or upload file</span>
        </div>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
      >
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload}
        />
        <div className="bg-gray-100 group-hover:bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3 transition-colors">
          <FileCode className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
        </div>
        <p className="text-gray-900 font-bold">Select .json file</p>
      </div>

      {isSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center space-x-3 border border-green-100 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold">Successfully imported!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start space-x-3 border border-red-100">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
         <div className="flex items-center space-x-2 text-blue-800 font-black mb-3">
            <Info className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wider">Example Structure</span>
         </div>
         <pre className="text-[10px] text-blue-700 overflow-x-auto bg-blue-100/30 p-4 rounded-xl font-mono leading-relaxed">
{`[
  {
    "name": "Tesla Berlin",
    "address": "Giga Factory 1",
    "phone": "+49 123 456",
    "contact": "Elon Musk",
    "details": "Drop at main lobby",
    "tour": "T-102"
  }
]`}
         </pre>
      </div>
    </div>
  );
};
