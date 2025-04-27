import React from 'react';
import { useLighting } from '../contexts/LightingContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const PresetsPanel: React.FC = () => {
  const { presets, activePreset, setActivePreset } = useLighting();
  const { addToFavorites, isFavorite } = useFavorites();
  
  const handlePresetChange = (preset: Preset) => {
    setActivePreset(preset);
    trackEvent('Lighting', 'change_preset', preset.name);
  };

  const handleAddToFavorites = (preset: Preset) => {
    addToFavorites(preset);
    trackEvent('Favorites', 'add_favorite', preset.name);
  };
  
  return (
    <div>
      <h3 className="text-sm text-white/80 mb-3">选择光效</h3>
      <div id="presets-list" className="flex space-x-3 overflow-x-auto pb-2 snap-x">
        {presets.map((preset) => (
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
            <p className="text-xs text-center mt-1 truncate w-16">{preset.name}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium">{activePreset.name}</h4>
        <p className="text-xs text-white/70">{activePreset.description}</p>
      </div>
    </div>
  );
};

export default PresetsPanel;