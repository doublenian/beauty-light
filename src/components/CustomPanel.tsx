import React, { useState } from 'react';
import { useLighting } from '../contexts/LightingContext';
import ColorWheel from './ColorWheel';
import { useFavorites } from '../contexts/FavoritesContext';
import { Save, Droplet } from 'lucide-react';

const CustomPanel: React.FC = () => {
  const { 
    customColor, 
    setCustomColor, 
    brightness, 
    setBrightness,
    splitMode,
    setSplitMode,
    secondColor,
    setSecondColor,
    secondBrightness,
    setSecondBrightness
  } = useLighting();
  
  const { addToFavorites } = useFavorites();
  const [presetName, setPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [activeZone, setActiveZone] = useState<'primary' | 'secondary'>('primary');
  const [savedColors, setSavedColors] = useState<{
    primary?: string;
    secondary?: string;
  }>({});
  
  const handleSaveZoneColor = () => {
    if (activeZone === 'primary') {
      setSavedColors(prev => ({ ...prev, primary: customColor }));
      setActiveZone('secondary');
    } else {
      setSavedColors(prev => ({ ...prev, secondary: secondColor }));
      handleCreatePreset();
    }
  };
  
  const handleCreatePreset = () => {
    if (!presetName.trim()) return;
    
    const gradient = splitMode 
      ? `linear-gradient(to right, ${savedColors.primary || customColor}, ${secondColor})`
      : undefined;
    
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: presetName,
      color: savedColors.primary || customColor,
      secondColor: splitMode ? secondColor : undefined,
      gradient,
      brightness,
      secondBrightness: splitMode ? secondBrightness : undefined,
      splitMode,
      description: '自定义光效预设',
      isCustom: true
    };
    
    addToFavorites(newPreset);
    setPresetName('');
    setShowSaveDialog(false);
    setSavedColors({});
  };
  
  return (
    <div>
      {/* Split mode toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm text-white/80">自定义光效</h3>
        <div className="flex items-center">
          <span className="text-xs mr-2">分区模式</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={splitMode}
              onChange={() => {
                setSplitMode(!splitMode);
                setSavedColors({});
              }}
            />
            <div className="w-9 h-5 bg-white/20 rounded-full peer peer-checked:bg-white/50 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:rounded-full after:h-4 after:w-4 
                          after:transition-all"></div>
          </label>
        </div>
      </div>
      
      {/* Zone selector (only in split mode) */}
      {splitMode && (
        <div className="mb-4 flex space-x-3">
          <button 
            className={`flex-1 py-2 px-4 rounded-md ${activeZone === 'primary' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/5 text-white/70'}`}
            onClick={() => setActiveZone('primary')}
          >
            区域 1 {savedColors.primary && '✓'}
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md ${activeZone === 'secondary' 
              ? 'bg-white/20 text-white' 
              : 'bg-white/5 text-white/70'}`}
            onClick={() => setActiveZone('secondary')}
          >
            区域 2 {savedColors.secondary && '✓'}
          </button>
        </div>
      )}
      
      {/* Color wheel */}
      <div className="mb-4">
        <ColorWheel 
          color={activeZone === 'primary' ? customColor : secondColor}
          onChange={(color) => {
            if (activeZone === 'primary') {
              setCustomColor(color);
            } else {
              setSecondColor(color);
            }
          }}
        />
      </div>
      
      {/* Brightness slider */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm flex items-center">
            <Droplet size={16} className="mr-1" />
            亮度
          </label>
          <span className="text-xs">
            {Math.round((activeZone === 'primary' ? brightness : secondBrightness) * 100)}%
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={activeZone === 'primary' ? brightness : secondBrightness}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (activeZone === 'primary') {
              setBrightness(value);
            } else {
              setSecondBrightness(value);
            }
          }}
          className="w-full accent-white bg-white/20 h-2 rounded-full appearance-none"
        />
      </div>
      
      {/* Save button */}
      <button 
        className="flex items-center justify-center w-full py-2 bg-white/10 hover:bg-white/20 
                   rounded-md transition-colors mt-2"
        onClick={() => {
          if (splitMode) {
            if (!savedColors.primary) {
              handleSaveZoneColor();
            } else {
              setShowSaveDialog(true);
            }
          } else {
            setShowSaveDialog(true);
          }
        }}
      >
        <Save size={18} className="mr-2" />
        {splitMode && !savedColors.primary 
          ? '保存区域 1' 
          : splitMode && !savedColors.secondary 
          ? '保存区域 2' 
          : '保存为预设'}
      </button>
      
      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-4 w-full max-w-xs">
            <h3 className="text-lg font-medium mb-3">保存预设</h3>
            <input 
              type="text"
              placeholder="预设名称"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full p-2 bg-black/50 border border-white/20 rounded mb-4 text-white"
            />
            <div className="flex space-x-3">
              <button 
                className="flex-1 py-2 bg-white/10 rounded"
                onClick={() => {
                  setShowSaveDialog(false);
                  setSavedColors({});
                }}
              >
                取消
              </button>
              <button 
                className="flex-1 py-2 bg-white text-black rounded font-medium"
                onClick={handleCreatePreset}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPanel;