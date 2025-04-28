import React, { useState, useEffect } from 'react';

interface LightingEffectHintProps {
  show: boolean;
  onClose: () => void;
}

const LightingEffectHint: React.FC<LightingEffectHintProps> = ({ show, onClose }) => {
  const [visible, setVisible] = useState(false);
  
  // 控制动画和显示
  useEffect(() => {
    if (show) {
      setVisible(true);
      
      // 5秒后自动关闭提示
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // 等待淡出动画后再完全移除
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  
  const handleClick = () => {
    setVisible(false);
    setTimeout(onClose, 500); // 等待淡出动画后再完全移除
  };
  
  if (!show) return null;
  
  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-lg rounded-xl">
        {/* 切换灯效动画 */}
        <div className="relative mb-4">
          {/* 中心圆点 - 代表当前灯效 */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 
                          shadow-lg shadow-purple-500/50 relative flex items-center justify-center z-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-pulse" />
          </div>
          
          {/* 左右滑动指示器 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-20 animate-swipe-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" 
                 stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 right-20 animate-swipe-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" 
                 stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          {/* 侧边灯效预设指示 */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-10 h-10 rounded-full 
                          bg-gradient-to-r from-blue-500 to-cyan-500 opacity-70"></div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-10 h-10 rounded-full 
                          bg-gradient-to-r from-orange-500 to-amber-500 opacity-70"></div>
          
          {/* 点击提示动画 */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" 
                 stroke="currentColor" className="text-white animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
        </div>
        
        {/* 说明文本 */}
        <div className="text-center">
          <p className="text-white font-medium mb-1">点击或滑动切换灯效</p>
          <p className="text-sm text-white/70">选择不同的灯光预设，创造完美氛围</p>
        </div>
      </div>
    </div>
  );
};

export default LightingEffectHint; 