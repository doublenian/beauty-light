import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLighting } from '../contexts/LightingContext';
import { Trash2 } from 'lucide-react';

const FavoritesPanel: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { setActivePreset } = useLighting();
  
  if (favorites.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-white/70">暂无收藏的预设</p>
        <p className="text-xs text-white/50 mt-2">
          点击心形图标收藏喜欢的光效预设
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-sm text-white/80 mb-3">已收藏的光效</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {favorites.map((preset) => (
          <div 
            key={preset.id}
            className="flex items-center bg-white/5 rounded-md p-2 group"
          >
            <div 
              className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
              style={{ 
                background: preset.gradient || preset.color,
                boxShadow: `0 0 10px ${preset.color}`
              }}
              onClick={() => setActivePreset(preset)}
            />
            <div className="flex-grow min-w-0" onClick={() => setActivePreset(preset)}>
              <h4 className="font-medium truncate">{preset.name}</h4>
              <p className="text-xs text-white/60 truncate">
                {preset.splitMode ? '分区模式' : '单色模式'} 
                {preset.isCustom ? ' • 自定义' : ''}
              </p>
            </div>
            <button 
              className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeFromFavorites(preset.id);
              }}
            >
              <Trash2 size={18} className="text-white/60 hover:text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPanel;