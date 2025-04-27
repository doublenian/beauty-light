import React, { createContext, useContext, useState } from 'react';

export interface Preset {
  id: string;
  name: string;
  color: string;
  secondColor?: string;
  gradient?: string;
  brightness?: number;
  secondBrightness?: number;
  description: string;
  splitMode?: boolean;
  isCustom?: boolean;
}

const defaultPresets: Preset[] = [
  {
    id: 'neon-sunset',
    name: '霓虹日落',
    color: '#FF1E1E',
    gradient: 'linear-gradient(135deg, #FF1E1E 0%, #FF9310 50%, #FFDB4C 100%)',
    brightness: 0.75,
    description: '充满活力的霓虹渐变，营造温暖氛围'
  },
  {
    id: 'electric-blue',
    name: '电光蓝',
    color: '#00FFFF',
    gradient: 'linear-gradient(135deg, #00FFFF 0%, #0066FF 50%, #4D4DFF 100%)',
    brightness: 0.8,
    description: '明亮的电子蓝色，展现科技感'
  },
  {
    id: 'vibrant-magenta',
    name: '炫彩洋红',
    color: '#FF00FF',
    gradient: 'linear-gradient(135deg, #FF00FF 0%, #FF33CC 50%, #FF66B2 100%)',
    brightness: 0.7,
    description: '鲜艳的洋红色调，创造时尚氛围'
  },
  {
    id: 'cyber-green',
    name: '赛博绿',
    color: '#00FF66',
    gradient: 'linear-gradient(135deg, #00FF66 0%, #33FF99 50%, #66FFCC 100%)',
    brightness: 0.85,
    description: '明亮的霓虹绿，展现未来感'
  },
  {
    id: 'plasma-purple',
    name: '等离子紫',
    color: '#9933FF',
    gradient: 'linear-gradient(135deg, #9933FF 0%, #CC33FF 50%, #FF33FF 100%)',
    brightness: 0.72,
    description: '炫丽的紫色渐变，营造梦幻效果'
  },
  {
    id: 'solar-orange',
    name: '太阳橙',
    color: '#FF6600',
    gradient: 'linear-gradient(135deg, #FF6600 0%, #FF9933 50%, #FFCC00 100%)',
    brightness: 0.78,
    description: '明亮的橙色系，展现阳光活力'
  },
  {
    id: 'aqua-burst',
    name: '湛蓝爆发',
    color: '#00CCFF',
    gradient: 'linear-gradient(135deg, #00CCFF 0%, #33FFFF 50%, #66FFFF 100%)',
    brightness: 0.82,
    description: '清新的蓝色渐变，呈现水晶质感'
  },
  {
    id: 'neon-rose',
    name: '霓虹玫瑰',
    color: '#FF0066',
    gradient: 'linear-gradient(135deg, #FF0066 0%, #FF3399 50%, #FF66CC 100%)',
    brightness: 0.75,
    description: '鲜艳的玫瑰色，展现甜美气质'
  },
  {
    id: 'lime-flash',
    name: '闪电青柠',
    color: '#CCFF00',
    gradient: 'linear-gradient(135deg, #CCFF00 0%, #99FF33 50%, #66FF66 100%)',
    brightness: 0.88,
    description: '明亮的青柠色，营造清新活力'
  },
  {
    id: 'fusion-gold',
    name: '熔融金',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    brightness: 0.85,
    description: '璀璨的金色渐变，展现奢华感'
  }
];

const LightingContext = createContext<LightingContextType | undefined>(undefined);

export const LightingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePreset, setActivePreset] = useState<Preset>(defaultPresets[0]);
  const [customColor, setCustomColor] = useState('#FFB6C1');
  const [brightness, setBrightness] = useState(0.75);
  const [splitMode, setSplitMode] = useState(false);
  const [secondColor, setSecondColor] = useState('#E0EEFF');
  const [secondBrightness, setSecondBrightness] = useState(0.85);
  
  const value = {
    activePreset,
    setActivePreset,
    presets: defaultPresets,
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
  };
  
  return (
    <LightingContext.Provider value={value}>
      {children}
    </LightingContext.Provider>
  );
};

export const useLighting = () => {
  const context = useContext(LightingContext);
  if (context === undefined) {
    throw new Error('useLighting must be used within a LightingProvider');
  }
  return context;
};