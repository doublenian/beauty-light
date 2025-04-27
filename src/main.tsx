import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 检查是否在微信浏览器中
function isWeChatBrowser(): boolean {
  return /MicroMessenger/i.test(navigator.userAgent);
}

// 根据浏览器类型决定渲染内容
const rootElement = document.getElementById('root');
if (rootElement) {
  if (isWeChatBrowser()) {
    rootElement.innerHTML = '<div style="text-align:center;padding:20px;">请在外部浏览器中打开</div>';
  } else {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}
