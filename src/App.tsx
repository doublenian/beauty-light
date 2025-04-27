import React from 'react';
import CameraView from './components/CameraView';
import { LightingProvider } from './contexts/LightingContext';
import { CameraProvider } from './contexts/CameraContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { useLighting } from './contexts/LightingContext';
import { useCamera } from './contexts/CameraContext';
import { Menu, Camera } from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import { Toaster } from 'react-hot-toast';
import { trackEvent } from './utils/analytics';

const AppContent = () => {
  const { activePreset, brightness } = useLighting();
  const { capturePhoto } = useCamera();
  const [showPanel, setShowPanel] = React.useState(false);
  const [isCapturing, setIsCapturing] = React.useState(false);
  
  const getBackgroundStyle = () => {
    const color = activePreset.gradient || activePreset.color;
    return {
      background: color,
      filter: `brightness(${(brightness + 0.5) * 100}%) saturate(150%)`
    };
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      await capturePhoto();
      trackEvent('Camera', 'capture_photo', 'success');
    } catch (error) {
      console.error('Failed to capture photo:', error);
      trackEvent('Camera', 'capture_photo', 'error');
    }
    setIsCapturing(false);
  };

  const handleTogglePanel = (show: boolean) => {
    setShowPanel(show);
    trackEvent('UI', 'toggle_panel', show ? 'open' : 'close');
  };

  return (
    <div className="fixed inset-0 text-white">
      <Toaster position="top-center" />
      
      {/* Background with color effect */}
      <div className="absolute inset-0 transition-all duration-300" style={getBackgroundStyle()} />

      {/* Menu Button */}
      <button 
        className="absolute top-4 left-4 p-3 bg-black/30 backdrop-blur-sm rounded-full z-[60] hover:bg-black/50 transition-colors"
        onClick={() => handleTogglePanel(!showPanel)}
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* Control Panel */}
      <div 
        className={`absolute inset-y-0 left-0 w-80 bg-black/80 backdrop-blur-md transform transition-transform duration-300 ease-in-out z-[70] ${
          showPanel ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-16 h-full">
          <ControlPanel />
        </div>
      </div>

      {/* Camera View */}
      <div className="absolute top-4 right-4 w-[100px] h-[100px] rounded-lg overflow-hidden shadow-lg z-30">
        <CameraView />
      </div>

      {/* Capture Button */}
      <div className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2">
        <button
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
            ${isCapturing 
              ? 'scale-95 bg-red-500/80' 
              : 'scale-100 bg-white/20 hover:bg-white/30'
            }
            backdrop-blur-md border-2 border-white/30 shadow-lg
            before:absolute before:inset-1 before:rounded-full before:bg-white/10 before:backdrop-blur-md
          `}
          onClick={handleCapture}
          disabled={isCapturing}
        >
          <div className={`relative z-10 w-16 h-16 rounded-full 
            ${isCapturing 
              ? 'bg-red-500/90' 
              : 'bg-white/90'
            } flex items-center justify-center`}>
            <Camera 
              size={28} 
              className={isCapturing ? 'text-white' : 'text-black'} 
            />
          </div>
        </button>
      </div>

      {/* Overlay to close panel when clicking outside */}
      {showPanel && (
        <div 
          className="fixed inset-0 z-[65] bg-black/20"
          onClick={() => handleTogglePanel(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <CameraProvider>
        <LightingProvider>
          <AppContent />
        </LightingProvider>
      </CameraProvider>
    </FavoritesProvider>
  );
}

export default App;