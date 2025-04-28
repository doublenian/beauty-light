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
      <div className="flex flex-col items-center p-5 rounded-xl backdrop-blur-lg bg-white/10">
        {/* 相机放大动画示意 */}
        <div className="flex relative justify-center items-center mb-4">
          {/* 小相机视图 */}
          <div className="flex overflow-hidden justify-center items-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-white/20">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500/30 to-purple-600/30"></div>
          </div>
          
          {/* 扩大指示箭头 */}
          <div className="mx-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" 
                stroke="currentColor" className="text-white animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* 放大后的相机视图 */}
          <div className="flex overflow-hidden relative justify-center items-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-white/20 animate-slow-pulse">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500/30 to-purple-600/30"></div>
            
            {/* 点击手势图标 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" 
                  stroke="currentColor" className="text-white animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* 说明文本 */}
        <div className="text-center">
          <p className="mb-1 font-medium text-white">点击相机视图</p>
          <p className="text-sm text-white/70">可以放大或缩小查看</p>
        </div>
      </div>
    </div>
  );
};

export default CameraViewHint; 