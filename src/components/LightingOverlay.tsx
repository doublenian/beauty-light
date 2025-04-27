import React from 'react';
import { useLighting } from '../contexts/LightingContext';

const LightingOverlay: React.FC = () => {
  const { 
    activePreset, 
    customColor, 
    brightness, 
    splitMode,
    secondColor,
    secondBrightness
  } = useLighting();
  
  // Determine colors based on active preset or custom settings
  const color = activePreset.isCustom ? customColor : activePreset.color;
  const secondaryColor = activePreset.isCustom && splitMode ? secondColor : activePreset.secondColor;
  
  // Apply brightness and increased saturation
  const applyBrightness = (color: string, brightness: number) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${brightness})`;
    }
    if (color.startsWith('hsl')) {
      const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        const [, h, s, l] = match;
        const adjustedS = Math.min(100, parseInt(s) + 20); // Increase saturation
        const adjustedL = Math.min(100, parseInt(l) + (brightness * 50));
        return `hsla(${h}, ${adjustedS}%, ${adjustedL}%, ${brightness})`;
      }
    }
    return color;
  };
  
  const primaryColorWithBrightness = applyBrightness(
    color, 
    activePreset.isCustom ? brightness : (activePreset.brightness || 0.7)
  );
  
  const secondaryColorWithBrightness = secondaryColor 
    ? applyBrightness(
        secondaryColor, 
        activePreset.isCustom ? secondBrightness : (activePreset.secondBrightness || 0.7)
      )
    : null;
  
  const backgroundStyle = splitMode || activePreset.splitMode
    ? {
        background: `linear-gradient(to right, ${primaryColorWithBrightness} 50%, ${secondaryColorWithBrightness || primaryColorWithBrightness} 50%)`
      }
    : {
        background: primaryColorWithBrightness
      };
    
  return (
    <div 
      className="absolute inset-0 pointer-events-none mix-blend-screen z-10"
      style={backgroundStyle}
    />
  );
};

export default LightingOverlay;