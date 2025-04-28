import React, { useState, useEffect } from 'react';
import { useLighting } from '../contexts/LightingContext';
import { useCamera } from '../contexts/CameraContext';
import PresetsPanel from './PresetsPanel';
import CustomPanel from './CustomPanel';
import FavoritesPanel from './FavoritesPanel';
import LongPressHint from './LongPressHint';
import { Palette, Sliders, Heart, Image, X, Coffee } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import zanshang from '../assets/images/zanshang.jpg';

type Tab = 'presets' | 'custom' | 'favorites' | 'photos';

// 本地存储键
const PHOTOS_HINT_SHOWN_KEY = 'beauty-light-photos-hint-shown';

const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('presets');
  const { capturedPhotos, previewPhoto, setPreviewPhoto } = useCamera();
  const [showDonation, setShowDonation] = useState(false);
  const [showLongPressHint, setShowLongPressHint] = useState(false);
  
  // 检查是否已经显示过提示
  useEffect(() => {
    const hasShownHint = sessionStorage.getItem(PHOTOS_HINT_SHOWN_KEY) === 'true';
    
    // 如果有照片且从未显示过提示，则在切换到相册标签时显示提示
    if (activeTab === 'photos' && capturedPhotos.length > 0 && !hasShownHint) {
      setShowLongPressHint(true);
    }
  }, [activeTab, capturedPhotos.length]);
  
  const handleLongPressHintClose = () => {
    setShowLongPressHint(false);
    sessionStorage.setItem(PHOTOS_HINT_SHOWN_KEY, 'true');
  };
  
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
  
  // 模拟长按保存到相册
  const handleLongPress = (e: React.MouseEvent, photo: string) => {
    e.preventDefault();
    // 这里可以实现实际的保存到相册功能
    // 为演示目的，仅显示提示
    alert('照片已保存到相册');
    trackEvent('Photos', 'save_to_gallery');
  };
  
  const TabButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badge?: number;
  }> = ({ isActive, onClick, icon, label, badge }) => (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-3 relative ${
        isActive 
          ? 'text-white border-b-2 border-white' 
          : 'text-white/50 hover:text-white/80'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="mt-1 text-xs">{label}</span>
      
      {badge && badge > 0 && (
        <span className="absolute top-2 right-1/4 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[1.25rem] text-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
  
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
          <div className="relative">
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
                  <div 
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-black/30 
                      backdrop-blur-sm border border-white/20 hover:border-white/40 
                      transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <button
                      className="w-full h-full"
                      onClick={() => handlePreviewPhoto(photo)}
                      onContextMenu={(e) => handleLongPress(e, photo)}
                    >
                      <img 
                        src={photo} 
                        alt={`照片 ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* 长按提示 */}
            <LongPressHint 
              show={showLongPressHint} 
              onClose={handleLongPressHintClose}
            />
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
            onContextMenu={(e) => handleLongPress(e, previewPhoto)}
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

export default ControlPanel;