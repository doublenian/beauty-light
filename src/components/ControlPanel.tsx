import React, { useState } from 'react';
import { useLighting } from '../contexts/LightingContext';
import { useCamera } from '../contexts/CameraContext';
import PresetsPanel from './PresetsPanel';
import CustomPanel from './CustomPanel';
import FavoritesPanel from './FavoritesPanel';
import { Palette, Sliders, Heart, Image, X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

type Tab = 'presets' | 'custom' | 'favorites' | 'photos';

const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('presets');
  const { capturedPhotos, previewPhoto, setPreviewPhoto } = useCamera();
  
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    trackEvent('UI', 'change_tab', tab);
  };

  const handlePreviewPhoto = (photo: string | null) => {
    setPreviewPhoto(photo);
    trackEvent('Photos', photo ? 'open_preview' : 'close_preview');
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        <TabButton 
          isActive={activeTab === 'presets'} 
          onClick={() => handleTabChange('presets')}
          icon={<Palette size={20} />}
          label="预设"
        />
        <TabButton 
          isActive={activeTab === 'custom'} 
          onClick={() => handleTabChange('custom')}
          icon={<Sliders size={20} />}
          label="自定义"
        />
        <TabButton 
          isActive={activeTab === 'favorites'} 
          onClick={() => handleTabChange('favorites')}
          icon={<Heart size={20} />}
          label="收藏"
        />
        <TabButton 
          isActive={activeTab === 'photos'} 
          onClick={() => handleTabChange('photos')}
          icon={<Image size={20} />}
          label="相册"
          badge={capturedPhotos.length > 0 ? capturedPhotos.length : undefined}
        />
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'presets' && <PresetsPanel />}
        {activeTab === 'custom' && <CustomPanel />}
        {activeTab === 'favorites' && <FavoritesPanel />}
        {activeTab === 'photos' && (
          <div>
            <h3 className="text-sm text-white/80 mb-3">已拍摄的照片</h3>
            {capturedPhotos.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-white/70">还没有拍摄照片</p>
                <p className="text-xs text-white/50 mt-2">
                  点击拍照按钮开始拍摄
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {capturedPhotos.map((photo, index) => (
                  <button
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-black/30 
                      backdrop-blur-sm border border-white/20 hover:border-white/40 
                      transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={() => handlePreviewPhoto(photo)}
                  >
                    <img 
                      src={photo} 
                      alt={`照片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Preview */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => handlePreviewPhoto(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewPhoto(null);
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={previewPhoto} 
            alt="预览" 
            className="max-w-full max-h-full object-contain p-4"
          />
        </div>
      )}
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label, badge }) => {
  return (
    <button
      className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors relative
        ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/90'}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
      {badge !== undefined && (
        <span className="absolute top-2 right-2 min-w-[18px] h-[18px] rounded-full bg-white/20 
          text-xs flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </button>
  );
};

export default ControlPanel;