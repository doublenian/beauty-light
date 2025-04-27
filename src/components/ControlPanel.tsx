import React, { useState } from 'react';
import { useLighting } from '../contexts/LightingContext';
import { useCamera } from '../contexts/CameraContext';
import PresetsPanel from './PresetsPanel';
import CustomPanel from './CustomPanel';
import FavoritesPanel from './FavoritesPanel';
import { Palette, Sliders, Heart, Image, X, Coffee } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import zanshang from '../assets/images/zanshang.jpg';
type Tab = 'presets' | 'custom' | 'favorites' | 'photos';

const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('presets');
  const { capturedPhotos, previewPhoto, setPreviewPhoto } = useCamera();
  const [showDonation, setShowDonation] = useState(false);
  
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    trackEvent('UI', 'change_tab', tab);
  };

  const handlePreviewPhoto = (photo: string | null) => {
    setPreviewPhoto(photo);
    trackEvent('Photos', photo ? 'open_preview' : 'close_preview');
  };
  
  const handleDonation = () => {
    setShowDonation(true);
    trackEvent('UI', 'open_donation');
  };
  
  const handleCloseDonation = () => {
    setShowDonation(false);
    trackEvent('UI', 'close_donation');
  };
  
  return (
    <div className="flex flex-col h-full">
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
      <div className="overflow-y-auto flex-1 p-4">
        {activeTab === 'presets' && <PresetsPanel />}
        {activeTab === 'custom' && <CustomPanel />}
        {activeTab === 'favorites' && <FavoritesPanel />}
        {activeTab === 'photos' && (
          <div>
            <h3 className="mb-3 text-sm text-white/80">已拍摄的照片</h3>
            {capturedPhotos.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-white/70">还没有拍摄照片</p>
                <p className="mt-2 text-xs text-white/50">
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
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Donation Button */}
      <div className="px-4 py-3 border-t border-white/10">
        <button 
          className="flex items-center transition-colors text-white/70 hover:text-white"
          onClick={handleDonation}
        >
          <Coffee size={16} className="mr-2" />
          <span className="text-sm">给开发者一点鼓励吧</span>
        </button>
      </div>

      {/* Photo Preview */}
      {previewPhoto && (
        <div 
          className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/90"
          onClick={() => handlePreviewPhoto(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 rounded-full transition-colors bg-black/50 hover:bg-black/70"
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
            className="object-contain p-4 max-w-full max-h-full"
          />
        </div>
      )}
      
      {/* Donation Preview */}
      {showDonation && (
        <div 
          className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/90"
          onClick={handleCloseDonation}
        >
          <div 
            className="flex flex-col items-center p-6 max-w-xs rounded-2xl border backdrop-blur-md bg-white/10 border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-medium text-white">给解念念的赞赏码</h3>
            <div className="p-2 mb-4 bg-white rounded-lg">
              <img 
                src={zanshang}  
                alt="赞赏码" 
                className="w-full max-w-[200px]"
              />
            </div>
            <p className="mb-4 text-sm text-center text-white/70">
              您的支持是我继续开发的动力 ❤️
            </p>
            <button 
              className="px-4 py-2 text-white rounded-lg transition-colors bg-white/20 hover:bg-white/30"
              onClick={handleCloseDonation}
            >
              关闭
            </button>
          </div>
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
        ${isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white/90'}`}
      onClick={onClick}
    >
      {icon}
      <span className="mt-1 text-xs">{label}</span>
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