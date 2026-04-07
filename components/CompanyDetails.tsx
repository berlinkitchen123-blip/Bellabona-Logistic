
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
  Truck,
  Edit2,
  Save,
  X,
  ClipboardPaste
} from 'lucide-react';
import { TranslatedText } from './TranslatedText';

interface Props {
  company: Company;
  onUpdate: (company: Company) => void;
}

export const CompanyDetails: React.FC<Props> = ({ company, onUpdate }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Company>(company);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(company);
    setIsEditing(false);
  };

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

  const handlePasteButton = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
        for (const imageType of imageTypes) {
          const blob = await clipboardItem.getType(imageType);
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const images = company.images || [];
            onUpdate({ ...company, images: [...images, base64] });
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
      alert("No image found in clipboard. Please copy an image first.");
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      alert("Unable to read clipboard. Please make sure you have granted permission, or use the upload button.");
    }
  };

  const handlePasteEvent = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const images = company.images || [];
            onUpdate({ ...company, images: [...images, base64] });
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  const removeImage = (idx: number) => {
    const images = (company.images || []).filter((_, i) => i !== idx);
    onUpdate({ ...company, images });
    if (imgIdx >= images.length) setImgIdx(Math.max(0, images.length - 1));
  };

  const images = company.images || [];

  return (
    <div 
      className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col focus-within:ring-2 focus-within:ring-blue-500 outline-none"
      tabIndex={0}
      onPaste={handlePasteEvent}
    >
      {/* Visual Header / Carousel */}
      <div className="h-72 md:h-96 bg-gray-50 relative group">
        {images.length > 0 ? (
          <>
            <img 
              src={images[imgIdx]} 
              alt="Location" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
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
                title="Delete Image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePasteButton}
                className="bg-indigo-500/80 backdrop-blur-md text-white p-2 rounded-xl shadow-lg hover:bg-indigo-600 transition-colors"
                title="Paste from Clipboard"
              >
                <ClipboardPaste className="w-5 h-5" />
              </button>
              <button 
                onClick={() => fileRef.current?.click()}
                className="bg-white/80 backdrop-blur-md text-blue-600 p-2 rounded-xl shadow-lg hover:bg-white transition-colors"
                title="Upload Image"
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
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => fileRef.current?.click()}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Upload Photo</span>
              </button>
              <button 
                onClick={handlePasteButton}
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
              >
                <ClipboardPaste className="w-5 h-5" />
                <span>Paste Image</span>
              </button>
            </div>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleImageUpload} />
      </div>

      <div className="p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-3">
              Delivery Destination
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">{company.name}</h2>
            <div className="flex items-center text-sm md:text-base text-gray-500 font-medium">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
              {company.address}
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
             {isEditing ? (
               <div className="flex space-x-2">
                 <button onClick={handleCancel} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-gray-200">
                   <X className="w-4 h-4" />
                   <span>Cancel</span>
                 </button>
                 <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-700 shadow-md">
                   <Save className="w-4 h-4" />
                   <span>Save</span>
                 </button>
               </div>
             ) : (
               <button onClick={() => setIsEditing(true)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors">
                 <Edit2 className="w-4 h-4" />
                 <span>Edit Details</span>
               </button>
             )}
             {!isEditing && company.assignedTour && (
               <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center justify-center space-x-2">
                 <Truck className="w-4 h-4" />
                 <span className="font-bold text-sm md:text-base">Tour: {company.assignedTour}</span>
               </div>
             )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</label>
                <input 
                  type="text" 
                  value={editForm.address} 
                  onChange={e => setEditForm({...editForm, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Person</label>
                <input 
                  type="text" 
                  value={editForm.contactPerson || ''} 
                  onChange={e => setEditForm({...editForm, contactPerson: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phoneNumber || ''} 
                  onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assigned Tour</label>
                <input 
                  type="text" 
                  value={editForm.assignedTour || ''} 
                  onChange={e => setEditForm({...editForm, assignedTour: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Instructions</label>
                <textarea 
                  value={editForm.deliveryDetails || ''} 
                  onChange={e => setEditForm({...editForm, deliveryDetails: e.target.value})}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
              <div className="bg-gray-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                 <div className="flex items-center space-x-3 mb-3 md:mb-4">
                    <div className="bg-white p-2 rounded-lg md:rounded-xl text-blue-500 shadow-sm"><User className="w-4 h-4 md:w-5 md:h-5" /></div>
                    <h4 className="font-black text-gray-900 text-sm md:text-base">Contact Person</h4>
                 </div>
                 <p className="text-base md:text-lg text-gray-700 font-bold">{company.contactPerson || "Not specified"}</p>
              </div>

              <div className="bg-gray-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                 <div className="flex items-center space-x-3 mb-3 md:mb-4">
                    <div className="bg-white p-2 rounded-lg md:rounded-xl text-green-500 shadow-sm"><Phone className="w-4 h-4 md:w-5 md:h-5" /></div>
                    <h4 className="font-black text-gray-900 text-sm md:text-base">Phone Number</h4>
                 </div>
                 {company.phoneNumber ? (
                   <a href={`tel:${company.phoneNumber}`} className="text-lg md:text-xl text-blue-600 font-black hover:underline">{company.phoneNumber}</a>
                 ) : (
                   <p className="text-base md:text-lg text-gray-400 font-bold">No number added</p>
                 )}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-amber-100">
              <div className="flex items-center space-x-3 mb-3 md:mb-4">
                 <div className="bg-amber-100 p-2 rounded-lg md:rounded-xl text-amber-600"><Info className="w-5 h-5 md:w-6 md:h-6" /></div>
                 <h4 className="text-lg md:text-xl font-black text-amber-900">Delivery Instructions</h4>
              </div>
              <TranslatedText 
                text={company.deliveryDetails || "Standard delivery procedures apply. No special instructions recorded."}
                className="text-amber-800 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-medium"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
