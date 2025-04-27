import React, { useState } from 'react';
import { useCamera } from '../contexts/CameraContext';
import { useLighting } from '../contexts/LightingContext';
import { Camera, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const CaptureControls: React.FC = () => {
  const { capturePhoto, captureMultiple } = useCamera();
  const { presets, activePreset, setActivePreset } = useLighting();
  const [showDelayOptions, setShowDelayOptions] = useState(false);
  const [selectedDelay, setSelectedDelay] = useState(0);
  const [isCaptureInProgress, setIsCaptureInProgress] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const delayOptions = [0, 3, 5, 8];
  
  const handleCaptureWithDelay = () => {
    if (isCaptureInProgress) return;
    
    if (selectedDelay === 0) {
      capturePhoto();
      return;
    }
    
    setIsCaptureInProgress(true);
    setCountdown(selectedDelay);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          capturePhoto();
          setTimeout(() => {
            setIsCaptureInProgress(false);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleCaptureMultiple = () => {
    if (isCaptureInProgress) return;
    
    setIsCaptureInProgress(true);
    captureMultiple(3)
      .finally(() => {
        setIsCaptureInProgress(false);
      });
  };

  const scrollPresets = (direction: 'left' | 'right') => {
    const presetsList = document.getElementById('presets-scroll');
    if (presetsList) {
      const scrollAmount = direction === 'left' ? -120 : 120;
      presetsList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="bg-black/70 backdrop-blur-sm">
      {/* Presets Scroll */}
      <div className="relative px-2 py-3 border-b border-white/10">
        <div className="flex items-center">
          <button 
            className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm"
            onClick={() => scrollPresets('left')}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div 
            id="presets-scroll" 
            className="flex space-x-3 overflow-x-auto scrollbar-hide px-2 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {presets.map((preset) => (
              <button
                key={preset.id}
                className={`flex flex-col items-center snap-start ${
                  activePreset.id === preset.id ? 'opacity-100' : 'opacity-70'
                }`}
                onClick={() => setActivePreset(preset)}
              >
                <div 
                  className={`w-12 h-12 rounded-full ${
                    activePreset.id === preset.id 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-black' 
                      : ''
                  }`}
                  style={{ 
                    background: preset.gradient || preset.color,
                    boxShadow: `0 0 15px ${preset.color}40`
                  }}
                />
                <span className="text-xs mt-1 whitespace-nowrap">{preset.name}</span>
              </button>
            ))}
          </div>
          
          <button 
            className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm"
            onClick={() => scrollPresets('right')}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Capture Controls */}
      <div className="py-4 px-6">
        <div className="flex justify-between items-center">
          {/* Delay options */}
          <div className="relative">
            <button
              className="flex items-center p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setShowDelayOptions(!showDelayOptions)}
            >
              <Clock size={20} />
              {selectedDelay > 0 && (
                <span className="ml-2">{selectedDelay}s</span>
              )}
            </button>
            
            {showDelayOptions && (
              <div className="absolute bottom-full left-0 mb-2 bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden">
                {delayOptions.map(delay => (
                  <button
                    key={delay}
                    className={`w-full px-4 py-2 text-left ${
                      selectedDelay === delay ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                    onClick={() => {
                      setSelectedDelay(delay);
                      setShowDelayOptions(false);
                    }}
                  >
                    {delay === 0 ? 'No delay' : `${delay}s`}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Capture button */}
          <button 
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isCaptureInProgress 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-white hover:bg-gray-200'
            }`}
            onClick={handleCaptureWithDelay}
            disabled={isCaptureInProgress}
          >
            {isCaptureInProgress ? (
              <span className="text-xl font-bold text-white">{countdown}</span>
            ) : (
              <Camera size={30} className="text-black" />
            )}
          </button>
          
          {/* Burst mode button */}
          <button
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 relative"
            onClick={handleCaptureMultiple}
            disabled={isCaptureInProgress}
          >
            <div className="relative">
              <Camera size={20} />
              <span className="absolute -top-1 -right-2 text-xs font-bold">3</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptureControls;