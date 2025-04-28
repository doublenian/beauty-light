import React, { useState, useEffect } from 'react';
import { useLighting } from '../contexts/LightingContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Preset } from '../contexts/LightingContext';
import { Heart } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import LightingEffectHint from './LightingEffectHint';

// 本地存储键
const LIGHTING_HINT_SHOWN_KEY = 'beauty-light-lighting-hint-shown';

const PresetsPanel: React.FC = () => {
  const { presets, activePreset, setActivePreset } = useLighting();
  const { addToFavorites, isFavorite } = useFavorites();
  const [showLightingHint, setShowLightingHint] = useState(false);
  
  // 检查是否已经显示过提示
  useEffect(() => {
    const hasShownHint = sessionStorage.getItem(LIGHTING_HINT_SHOWN_KEY) === 'true';
    
    if (!hasShownHint) {
      // 延迟一点时间显示提示，以便页面先渲染
      const timer = setTimeout(() => {
        setShowLightingHint(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleLightingHintClose = () => {
    setShowLightingHint(false);
    sessionStorage.setItem(LIGHTING_HINT_SHOWN_KEY, 'true');
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
      <h3 className="mb-3 text-sm text-white/80">选择光效</h3>
      <div id="presets-list" className="flex overflow-x-auto pb-2 space-x-3 snap-x">
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
              <button 
                className={`absolute -top-1 -right-1 bg-black/50 p-1 rounded-full 
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
              </button>
            </button>
            <p className="mt-1 w-16 text-xs text-center truncate">{preset.name}</p>
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