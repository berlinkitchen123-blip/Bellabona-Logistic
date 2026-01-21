
import React from 'react';
import { Company } from '../types';
import { MapPin, Info, Trash2, Package } from 'lucide-react';

interface Props {
  companies: Company[];
  onDelete: (id: string) => void;
}

export const CompanyList: React.FC<Props> = ({ companies, onDelete }) => {
  if (companies.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-4">
          <Package className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No companies found</h3>
        <p className="text-gray-500 max-w-xs mx-auto mt-2">Import a JSON file or add companies manually to get started with your dispatch list.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {companies.map((company) => (
        <div
          key={company.id}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex items-start justify-between"
        >
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              {company.name}
            </h3>

            <div className="flex items-center space-x-2 mt-2 text-gray-500">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-sm leading-tight">{company.address}</span>
            </div>

            {company.deliveryDetails && (
              <div className="flex items-start space-x-2 mt-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">{company.deliveryDetails}</p>
              </div>
            )}

            {company.assignedTour && (
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md">
                  Tour: {company.assignedTour}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onDelete(company.id)}
            className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};
