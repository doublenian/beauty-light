import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useCamera } from '../contexts/CameraContext';
import { useLighting } from '../contexts/LightingContext';
import CameraViewHint from './CameraViewHint';

// 本地存储键
const CAMERA_HINT_SHOWN_KEY = 'beauty-light-camera-hint-shown';

const CameraView: React.FC = () => {
  const { videoRef, isLoading, error } = useCamera();
  const { activePreset } = useLighting();
  const [expanded, setExpanded] = useState(false);
  const [showCameraHint, setShowCameraHint] = useState(false);
  
  // 检查是否已经显示过提示
  useEffect(() => {
    const hasShownHint = sessionStorage.getItem(CAMERA_HINT_SHOWN_KEY) === 'true';
    
    if (!hasShownHint) {
      // 延迟一点时间显示提示，以便页面先渲染
      const timer = setTimeout(() => {
        setShowCameraHint(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleCameraHintClose = () => {
    setShowCameraHint(false);
    sessionStorage.setItem(CAMERA_HINT_SHOWN_KEY, 'true');
  };
  
  // 点击切换大小
  const toggleView = () => {
    setExpanded(!expanded);
    
    // 修改父元素样式
    const parentElement = document.querySelector('[data-camera-container]');
    if (parentElement) {
      // 使用普通过渡动画
      parentElement.classList.remove('spring-animation');
      parentElement.classList.add('normal-animation');
      
      if (!expanded) {
        // 放大 - 只占屏幕高度的一半
        parentElement.classList.remove('top-4', 'right-4', 'w-[100px]', 'h-[100px]');
        parentElement.classList.add('top-1/4', 'left-1/2', '-translate-x-1/2', 'w-auto', 'h-1/2', 'aspect-square', 'z-50');
      } else {
        // 恢复原始大小
        parentElement.classList.remove('top-1/4', 'left-1/2', '-translate-x-1/2', 'w-auto', 'h-1/2', 'aspect-square', 'z-50');
        parentElement.classList.add('top-4', 'right-4', 'w-[100px]', 'h-[100px]');
      }
      
      // 动画结束后移除动画类
      setTimeout(() => {
        parentElement.classList.remove('normal-animation');
      }, 500);
    }
  };
  
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
    trackMouse: false
  });

  return (
    <div 
      className="relative overflow-hidden w-full h-full bg-black"
      {...handlers}
      onClick={toggleView}
    >
      {/* Camera Preview */}
      <div className="flex absolute inset-0 justify-center items-center">
        {isLoading && (
          <div className="text-center">
            <div className="mx-auto w-6 h-6 rounded-full border-t-2 border-b-2 border-white animate-spin"></div>
            <p className="mt-2 text-xs">Loading...</p>
          </div>
        )}
        
        {error && (
          <div className="p-2 text-xs text-center rounded-lg bg-red-900/80">
            <p className="mb-1 font-bold">Error</p>
            <p>{error}</p>
            <button 
              className="px-2 py-1 mt-2 text-xs font-medium text-red-900 bg-white rounded-full"
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
          } transition-all duration-300`}
        />
      </div>
      
      {/* 相机放大提示 */}
      <CameraViewHint 
        show={showCameraHint} 
        onClose={handleCameraHintClose}
      />
      
      {expanded && (
        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white"
          onClick={(e) => {
            e.stopPropagation();
            toggleView();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default CameraView;