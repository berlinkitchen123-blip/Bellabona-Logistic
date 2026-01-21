
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
  Package,
  Plus,
  // Added missing Truck icon to fix error on line 119
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

  const images = company.images || [];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
      {/* Visual Header / Carousel */}
      <div className="h-72 md:h-96 bg-gray-50 relative group">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIdx]}
              alt="Location"
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setImgIdx(p => p > 0 ? p - 1 : images.length - 1)} className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white"><ChevronLeft /></button>
                <button onClick={() => setImgIdx(p => p < images.length - 1 ? p + 1 : 0)} className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white"><ChevronRight /></button>
              </div>
            )}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => removeImage(imgIdx)}
                className="bg-red-500/80 backdrop-blur-md text-white p-2 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="bg-white/80 backdrop-blur-md text-blue-600 p-2 rounded-xl shadow-lg hover:bg-white transition-colors"
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
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 px-10 text-center">
            <div className="bg-gray-100 p-8 rounded-[2rem] mb-4">
              <Camera className="w-16 h-16 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Location Photos</h3>
            <p className="text-sm mt-2 mb-6">Take a photo of the entrance, gate, or specific drop-off point to help future drivers.</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Upload Location Photo</span>
            </button>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleImageUpload} />
      </div>

      <div className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="flex-1">
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
              Delivery Destination
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  className="text-4xl font-black text-gray-900 leading-tight w-full bg-gray-50 border-b-2 border-blue-500 focus:outline-none"
                  value={editedCompany.name}
                  onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                  placeholder="Company Name"
                />
                <div className="flex items-center text-gray-500 font-medium">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    value={editedCompany.address}
                    onChange={(e) => setEditedCompany({ ...editedCompany, address: e.target.value })}
                    placeholder="Address"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-black text-gray-900 leading-tight mb-2">{company.name}</h2>
                <div className="flex items-center text-gray-500 font-medium">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                  {company.address}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            {isEditing ? (
              <div className="flex flex-col space-y-2">
                <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <input
                    type="text"
                    className="bg-transparent font-bold text-indigo-900 focus:outline-none w-24"
                    value={editedCompany.assignedTour || ''}
                    onChange={(e) => setEditedCompany({ ...editedCompany, assignedTour: e.target.value })}
                    placeholder="Tour ID"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditedCompany(company); }}
                    className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {company.assignedTour && (
                  <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center justify-center space-x-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl text-blue-500 shadow-sm"><User className="w-5 h-5" /></div>
              <h4 className="font-black text-gray-900">Contact Person</h4>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-lg text-gray-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                value={editedCompany.contactPerson || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, contactPerson: e.target.value })}
                placeholder="Name"
              />
            ) : (
              <p className="text-lg text-gray-700 font-bold">{company.contactPerson || "Not specified"}</p>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl text-green-500 shadow-sm"><Phone className="w-5 h-5" /></div>
              <h4 className="font-black text-gray-900">Phone Number</h4>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-lg text-gray-700 font-bold focus:ring-2 focus:ring-green-500 outline-none"
                value={editedCompany.phoneNumber || ''}
                onChange={(e) => setEditedCompany({ ...editedCompany, phoneNumber: e.target.value })}
                placeholder="Phone"
              />
            ) : (
              <>
                {company.phoneNumber ? (
                  <a href={`tel:${company.phoneNumber}`} className="text-xl text-blue-600 font-black hover:underline">{company.phoneNumber}</a>
                ) : (
                  <p className="text-lg text-gray-400 font-bold">No number added</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><Info className="w-6 h-6" /></div>
            <h4 className="text-xl font-black text-amber-900">Delivery Instructions</h4>
          </div>
          {isEditing ? (
            <textarea
              className="w-full bg-white border border-amber-200 rounded-2xl p-4 text-amber-900 leading-relaxed text-lg min-h-[150px] focus:ring-2 focus:ring-amber-500 outline-none"
              value={editedCompany.deliveryDetails || ''}
              onChange={(e) => setEditedCompany({ ...editedCompany, deliveryDetails: e.target.value })}
              placeholder="Enter special instructions here..."
            />
          ) : (
            <div className="text-amber-800 leading-relaxed text-lg whitespace-pre-wrap font-medium">
              {company.deliveryDetails || "Standard delivery procedures apply. No special instructions recorded."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
