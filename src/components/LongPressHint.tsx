import React, { useState, useEffect } from 'react';

interface LongPressHintProps {
  show: boolean;
  onClose: () => void;
}

const LongPressHint: React.FC<LongPressHintProps> = ({ show, onClose }) => {
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
      <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl">
        {/* 手指长按动画 */}
        <div className="relative mb-3">
          {/* 手指长按图标 */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white"
          >
            {/* 手 */}
            <path d="M11 11.5v-1a1.5 1.5 0 0 1 3 0V12" />
            <path d="M14 10.5a1.5 1.5 0 0 1 3 0V12" />
            <path d="M17 10.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-2 .208A6 6 0 0 1 7 17v-1a5 5 0 0 1 5-5" />
            <path d="M5 10.5a1.5 1.5 0 0 1 3 0V12" />
            <path d="M8 8.5a1.5 1.5 0 0 1 3 0v3" />
            {/* 向下的箭头表示按压 */}
            <line x1="11" y1="3" x2="11" y2="6" strokeWidth="2.5" className="animate-pulse" />
            <polyline points="9 5 11 7 13 5" strokeWidth="2.5" className="animate-pulse" />
          </svg>
          
          {/* 波纹动画 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/30 animate-ping" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/50 animate-ping animation-delay-300" />
        </div>
        
        {/* 保存图标和文本 */}
        <div className="flex items-center gap-2 animate-pulse">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          <span className="text-sm text-white">长按图片可保存到相册</span>
        </div>
      </div>
    </div>
  );
};

export default LongPressHint; 