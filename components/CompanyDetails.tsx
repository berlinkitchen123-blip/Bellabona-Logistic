
import React, { useRef, useState } from 'react';
import { Company } from '../types';
import {
  MapPin,
  Phone,
  User,
  Info,
  Camera,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Plus,
  Truck
} from 'lucide-react';

interface Props {
  company: Company;
  onUpdate: (company: Company) => void;
  initialEditMode?: boolean;
}

export const CompanyDetails: React.FC<Props> = ({ company, onUpdate, initialEditMode = false }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editedCompany, setEditedCompany] = useState<Company>(company);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const images = company.images || [];
      onUpdate({ ...company, images: [...images, base64] });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (idx: number) => {
    const images = (company.images || []).filter((_, i) => i !== idx);
    onUpdate({ ...company, images });
    if (imgIdx >= images.length) setImgIdx(Math.max(0, images.length - 1));
  };

  const handleSave = () => {
    onUpdate(editedCompany);
    setIsEditing(false);
  };

  const parsePhoneNumbers = (phoneStr: string | undefined) => {
    if (!phoneStr) return [];
    // Split by comma, newline, or " / "
    return phoneStr.split(/,|\n|\/|;/).map(s => s.trim()).filter(s => s.length > 0);
  };

  const images = company.images || [];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
      {/* Visual Header / Carousel */}
      <div className="w-full bg-gray-50 relative group min-h-[300px]">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIdx]}
              alt="Location"
              className="w-full h-auto object-contain max-h-[80vh]"
            />
            {images.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setImgIdx(p => p > 0 ? p - 1 : images.length - 1)} className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white text-emerald-800"><ChevronLeft /></button>
                <button onClick={() => setImgIdx(p => p < images.length - 1 ? p + 1 : 0)} className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white text-emerald-800"><ChevronRight /></button>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-end space-x-2">
              <button
                onClick={() => removeImage(imgIdx)}
                className="bg-red-500/80 backdrop-blur-md text-white p-2 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="bg-white/80 backdrop-blur-md text-emerald-600 p-2 rounded-xl shadow-lg hover:bg-white transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === imgIdx ? 'bg-white shadow-md w-6' : 'bg-white/40'} transition-all`} />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 px-10 text-center py-20">
            <div className="bg-gray-100 p-8 rounded-[2rem] mb-4">
              <Camera className="w-16 h-16 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Location Photos</h3>
            <p className="text-sm mt-2 mb-6">Take a photo of the entrance, gate, or specific drop-off point to help future drivers.</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-emerald-700 transition-all flex items-center space-x-2 touch-manipulation"
            >
              <Camera className="w-5 h-5" />
              <span>Upload Location Photo</span>
            </button>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleImageUpload} />
      </div>

      <div className="p-5 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="flex-1">
            <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
              Delivery Destination
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  className="text-2xl font-black text-gray-900 leading-tight w-full bg-gray-50 border-b-2 border-emerald-500 focus:outline-none"
                  value={editedCompany.name}
                  onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                  placeholder="Company Name"
                />
                <div className="flex items-center text-gray-500 font-medium">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-gray-300 focus:border-emerald-500 focus:outline-none text-sm"
                    value={editedCompany.address}
                    onChange={(e) => setEditedCompany({ ...editedCompany, address: e.target.value })}
                    placeholder="Address"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{company.name}</h2>
                <div className="flex items-center text-gray-500 font-medium text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                  {company.address}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            {isEditing ? (
              <div className="flex flex-col space-y-2">
                <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <input
                    type="text"
                    className="bg-transparent font-bold text-emerald-900 focus:outline-none w-24"
                    value={editedCompany.assignedTour || ''}
                    onChange={(e) => setEditedCompany({ ...editedCompany, assignedTour: e.target.value })}
                    placeholder="Tour ID"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditedCompany(company); }}
                    className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {company.assignedTour && (
                  <div className="bg-emerald-800 text-white px-4 py-2 rounded-xl shadow-lg flex items-center justify-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span className="font-bold">Tour: {company.assignedTour}</span>
                  </div>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Edit Details
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-200 mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white p-2 rounded-xl text-gray-600 shadow-sm"><Info className="w-6 h-6" /></div>
            <h4 className="text-xl font-black text-gray-900">Delivery Instructions</h4>
          </div>
          {isEditing ? (
            <textarea
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 leading-relaxed text-lg min-h-[150px] focus:ring-2 focus:ring-emerald-500 outline-none"
              value={editedCompany.deliveryDetails || ''}
              onChange={(e) => setEditedCompany({ ...editedCompany, deliveryDetails: e.target.value })}
              placeholder="Enter special instructions here..."
            />
          ) : (
            <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap font-medium">
              {company.deliveryDetails || "Standard delivery procedures apply. No special instructions recorded."}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm"><User className="w-5 h-5" /></div>
              <h4 className="font-black text-gray-900">Contact Person</h4>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg text-gray-700 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                value={editedCompany.contactPerson || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, contactPerson: e.target.value })}
                placeholder="Name"
                autoCapitalize="words"
              />
            ) : (
              <p className="text-lg text-gray-700 font-bold">{company.contactPerson || "Not specified"}</p>
            )}
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm"><Phone className="w-5 h-5" /></div>
              <h4 className="font-black text-emerald-900">Contact Numbers</h4>
            </div>
            {isEditing ? (
              <textarea
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg text-gray-700 font-bold focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                value={editedCompany.phoneNumber || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, phoneNumber: e.target.value })}
                placeholder="Enter numbers (comma separated)"
              />
            ) : (
              <div className="flex flex-col space-y-3">
                {parsePhoneNumbers(company.phoneNumber).length > 0 ? (
                  parsePhoneNumbers(company.phoneNumber).map((number, idx) => (
                    <a
                      key={idx}
                      href={`tel:${number.replace(/[^\d+]/g, '')}`}
                      className="bg-white text-emerald-800 px-4 py-3 rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-emerald-50 hover:scale-[1.02] transition-all flex items-center justify-between group border border-emerald-100"
                    >
                      <span className="text-base">{number}</span>
                      <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Phone className="w-4 h-4 fill-current" />
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-lg text-gray-400 font-bold">No number added</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
