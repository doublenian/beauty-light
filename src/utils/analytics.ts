export const trackEvent = (category: string, action: string, label?: string) => {
    try {
      if (window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label
        });
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };
  
  // Declare gtag for TypeScript
  declare global {
    interface Window {
      gtag: (...args: any[]) => void;
      dataLayer: any[];
    }
  }