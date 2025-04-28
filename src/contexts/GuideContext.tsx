import React, { createContext, useContext, useState, useEffect } from 'react';

// 引导提示的本地存储键
export const LIGHTING_HINT_SHOWN_KEY = 'beauty-light-lighting-hint-shown';
export const PHOTOS_HINT_SHOWN_KEY = 'beauty-light-photos-hint-shown';
export const CAMERA_HINT_SHOWN_KEY = 'beauty-light-camera-hint-shown';
export const GUIDE_ENABLED_KEY = 'beauty-light-guide-enabled';

interface GuideContextType {
  isGuideEnabled: boolean;
  toggleGuide: (enabled: boolean) => void;
  clearGuideHistory: () => void;
  setGuideHistory: () => void;
  checkAllHintsShown: () => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const GuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGuideEnabled, setIsGuideEnabled] = useState(true);
  
  // 初始化读取引导状态
  useEffect(() => {
    const guideEnabled = localStorage.getItem(GUIDE_ENABLED_KEY) !== 'false';
    setIsGuideEnabled(guideEnabled);
  }, []);
  
  // 清除所有引导历史记录，使引导再次显示
  const clearGuideHistory = () => {
    localStorage.removeItem(LIGHTING_HINT_SHOWN_KEY);
    localStorage.removeItem(PHOTOS_HINT_SHOWN_KEY);
    localStorage.removeItem(CAMERA_HINT_SHOWN_KEY);
  };
  
  // 设置所有引导历史记录，使引导不再显示
  const setGuideHistory = () => {
    localStorage.setItem(LIGHTING_HINT_SHOWN_KEY, 'true');
    localStorage.setItem(PHOTOS_HINT_SHOWN_KEY, 'true');
    localStorage.setItem(CAMERA_HINT_SHOWN_KEY, 'true');
  };
  
  // 检查所有提示是否都已显示，如果都已显示则关闭引导开关
  const checkAllHintsShown = () => {
    const lightingHintShown = localStorage.getItem(LIGHTING_HINT_SHOWN_KEY) === 'true';
    const photosHintShown = localStorage.getItem(PHOTOS_HINT_SHOWN_KEY) === 'true';
    const cameraHintShown = localStorage.getItem(CAMERA_HINT_SHOWN_KEY) === 'true';
    
    // 如果所有提示都已显示且引导开关当前为开启状态，则自动关闭引导开关
    if (lightingHintShown && photosHintShown && cameraHintShown && isGuideEnabled) {
      setIsGuideEnabled(false);
      localStorage.setItem(GUIDE_ENABLED_KEY, 'false');
    }
  };
  
  // 切换引导状态
  const toggleGuide = (enabled: boolean) => {
    setIsGuideEnabled(enabled);
    localStorage.setItem(GUIDE_ENABLED_KEY, enabled ? 'true' : 'false');
    
    if (enabled) {
      // 启用引导 - 清除历史记录
      clearGuideHistory();
    } else {
      // 禁用引导 - 设置历史记录
      setGuideHistory();
    }
  };
  
  return (
    <GuideContext.Provider value={{ 
      isGuideEnabled, 
      toggleGuide,
      clearGuideHistory,
      setGuideHistory,
      checkAllHintsShown
    }}>
      {children}
    </GuideContext.Provider>
  );
};

// 自定义Hook，用于使用引导上下文
export const useGuide = () => {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}; 