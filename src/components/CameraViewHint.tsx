import React, { useState, useEffect } from 'react';

interface CameraViewHintProps {
  show: boolean;
  onClose: () => void;
}

const CameraViewHint: React.FC<CameraViewHintProps> = ({ show, onClose }) => {
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
        {/* 相机点击放大动画 */}
        <div className="relative mb-3">
          {/* 相机小窗图标 */}
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 
                          border-2 border-white/20 flex items-center justify-center">
            {/* 相机镜头 */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 
                            border-2 border-gray-900/50"></div>
          </div>
          
          {/* 放大箭头动画 */}
          <div className="absolute -right-2 -bottom-2 animate-pulse">
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
              <polygon points="15 3 21 3 21 9"></polygon>
              <path d="M21 3l-7 7"></path>
            </svg>
          </div>
          
          {/* 点击手势图标 */}
          <div className="absolute -left-2 -bottom-2">
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
              className="text-white animate-bounce"
            >
              <path d="M8 13v4"></path>
              <path d="M8 17h7a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-3"></path>
              <path d="M12 15V3"></path>
              <path d="M12 3l4 4"></path>
              <path d="M12 3l-4 4"></path>
            </svg>
          </div>
          
          {/* 放大后的相机视图（半透明）*/}
          <div className="absolute top-7 left-7 w-24 h-24 rounded-lg bg-gradient-to-br from-gray-700/30 to-gray-600/30 
                          border-2 border-white/10 -z-10 animate-slow-pulse"></div>
        </div>
        
        {/* 提示文本 */}
        <div className="text-center">
          <p className="text-sm text-white">点击相机视图可放大</p>
        </div>
      </div>
    </div>
  );
};

export default CameraViewHint; 