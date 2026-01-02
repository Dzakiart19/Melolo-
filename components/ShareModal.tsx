
import React from 'react';
import { X, Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Link berhasil disalin!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold mb-6">Bagikan Drama</h3>
        <div className="grid grid-cols-4 gap-4 mb-8">
          <button onClick={copyLink} className="flex flex-col items-center gap-2 group">
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary transition-colors">
              <Copy className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Salin</span>
          </button>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#1877F2] transition-colors">
              <Facebook className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Facebook</span>
          </div>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#1DA1F2] transition-colors">
              <Twitter className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Twitter</span>
          </div>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#25D366] transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">WhatsApp</span>
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-xl flex items-center gap-2 overflow-hidden">
          <input readOnly value={url} className="bg-transparent text-xs text-gray-400 w-full outline-none" />
          <button onClick={copyLink} className="text-primary text-xs font-bold whitespace-nowrap">Copy</button>
        </div>
      </div>
    </div>
  );
};
