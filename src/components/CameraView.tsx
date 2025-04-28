import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useCamera } from '../contexts/CameraContext';
import { useLighting } from '../contexts/LightingContext';
import { useGuide } from '../contexts/GuideContext';

const CameraView: React.FC = () => {
  const { videoRef, isLoading, error } = useCamera();
  const { activePreset } = useLighting();
  const { checkAllHintsShown } = useGuide();
  const [expanded, setExpanded] = useState(false);
  
  // 点击切换大小
  const toggleView = () => {
    setExpanded(!expanded);
    
    // 修改父元素样式
    const parentElement = document.querySelector('[data-camera-container]');
    if (parentElement) {
      // 使用弹性动画
      parentElement.classList.remove('normal-animation');
      parentElement.classList.add('spring-animation');
      
      // 添加过渡开始的缩放效果
      if (!expanded) {
        // 先添加一点缩放效果
        (parentElement as HTMLElement).style.transform = 'scale(0.95)';
        
        // 放大 - 只改变宽高，保持位置不变
        parentElement.classList.remove('w-[100px]', 'h-[100px]');
        parentElement.classList.add('w-[300px]', 'h-[300px]', 'z-50');
        
        // 延迟重置变换
        setTimeout(() => {
          (parentElement as HTMLElement).style.transform = '';
        }, 50);
      } else {
        // 先添加一点缩放效果
        (parentElement as HTMLElement).style.transform = 'scale(1.05)';
        
        // 恢复原始大小
        parentElement.classList.remove('w-[300px]', 'h-[300px]', 'z-50');
        parentElement.classList.add('w-[100px]', 'h-[100px]');
        
        // 延迟重置变换
        setTimeout(() => {
          (parentElement as HTMLElement).style.transform = '';
        }, 50);
      }
      
      // 动画结束后移除动画类
      setTimeout(() => {
        parentElement.classList.remove('spring-animation');
      }, 800); // 延长动画时间
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
      className="overflow-hidden relative w-full h-full bg-black"
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
      
      {expanded && (
        <button 
          className="flex absolute top-4 right-4 justify-center items-center w-8 h-8 text-white rounded-full bg-black/50"
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