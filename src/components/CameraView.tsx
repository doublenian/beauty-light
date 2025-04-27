import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useCamera } from '../contexts/CameraContext';
import { useLighting } from '../contexts/LightingContext';

const CameraView: React.FC = () => {
  const { videoRef, isLoading, error } = useCamera();
  const { activePreset } = useLighting();
  
  // Handle swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const presetsList = document.getElementById('presets-list');
      if (presetsList) {
        presetsList.scrollBy({ left: 80, behavior: 'smooth' });
      }
    },
    onSwipedRight: () => {
      const presetsList = document.getElementById('presets-list');
      if (presetsList) {
        presetsList.scrollBy({ left: -80, behavior: 'smooth' });
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  return (
    <div 
      className="relative h-full w-full overflow-hidden bg-black"
      {...handlers}
    >
      {/* Camera Preview */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mx-auto"></div>
            <p className="mt-2 text-xs">Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center p-2 bg-red-900/80 rounded-lg text-xs">
            <p className="font-bold mb-1">Error</p>
            <p>{error}</p>
            <button 
              className="mt-2 px-2 py-1 bg-white text-red-900 rounded-full text-xs font-medium"
              onClick={(e) => {
                e.stopPropagation();
                window.location.reload();
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className={`h-full w-full object-cover scale-x-[-1] ${
            isLoading || error ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>
    </div>
  );
};

export default CameraView;