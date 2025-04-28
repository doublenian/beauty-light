import React, { useState, useEffect } from 'react';
import { useLighting } from '../contexts/LightingContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Preset } from '../contexts/LightingContext';
import { useGuide, LIGHTING_HINT_SHOWN_KEY } from '../contexts/GuideContext';
import { Heart } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import LightingEffectHint from './LightingEffectHint';

const PresetsPanel: React.FC = () => {
  const { presets, activePreset, setActivePreset } = useLighting();
  const { addToFavorites, isFavorite } = useFavorites();
  const [showLightingHint, setShowLightingHint] = useState(false);
  const { isGuideEnabled, checkAllHintsShown } = useGuide();
  
  // 检查是否已经显示过提示
  useEffect(() => {
    const hasShownHint = localStorage.getItem(LIGHTING_HINT_SHOWN_KEY) === 'true';
    
    if (!hasShownHint && isGuideEnabled) {
      // 延迟一点时间显示提示，以便页面先渲染
      const timer = setTimeout(() => {
        setShowLightingHint(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (!isGuideEnabled && showLightingHint) {
      // 如果引导被禁用但提示正在显示，则关闭提示
      setShowLightingHint(false);
    }
  }, [isGuideEnabled, showLightingHint]);
  
  const handleLightingHintClose = () => {
    setShowLightingHint(false);
    localStorage.setItem(LIGHTING_HINT_SHOWN_KEY, 'true');
    
    // 检查是否所有提示都已显示，如果是则自动关闭引导开关
    checkAllHintsShown();
  };
  
  const handlePresetChange = (preset: Preset) => {
    setActivePreset(preset);
    trackEvent('Lighting', 'change_preset', preset.name);
  };

  const handleAddToFavorites = (preset: Preset) => {
    addToFavorites(preset);
    trackEvent('Favorites', 'add_favorite', preset.name);
  };
  
  return (
    <div className="relative">
      <h3 className="text-sm text-white/80 mb-3">选择光效</h3>
      <div id="presets-list" className="flex space-x-3 overflow-x-auto pb-2 snap-x">
        {presets.map((preset: Preset) => (
          <div key={preset.id} className="snap-start">
            <button
              className={`relative group w-16 h-16 rounded-full flex items-center justify-center ${
                activePreset.id === preset.id 
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black' 
                  : ''
              }`}
              style={{ 
                background: preset.gradient || preset.color,
                boxShadow: `0 0 20px ${preset.color}`
              }}
              onClick={() => handlePresetChange(preset)}
            >
              <div 
                className={`absolute -top-1 -right-1 bg-black/50 p-1 rounded-full cursor-pointer
                  opacity-${activePreset.id === preset.id || isFavorite(preset.id) ? '100' : '0'}
                  group-hover:opacity-100 transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToFavorites(preset);
                }}
              >
                <Heart 
                  size={14} 
                  fill={isFavorite(preset.id) ? 'white' : 'none'} 
                  color="white" 
                />
              </div>
            </button>
            <p className="text-xs text-center mt-1 truncate w-16">{preset.name}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium">{activePreset.name}</h4>
        <p className="text-xs text-white/70">{activePreset.description}</p>
      </div>
      
      {/* 灯光效果提示 */}
      <LightingEffectHint 
        show={showLightingHint} 
        onClose={handleLightingHintClose}
      />
    </div>
  );
};

export default PresetsPanel;