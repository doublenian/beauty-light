import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface CameraContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  isLoading: boolean;
  error: string | null;
  capturePhoto: () => Promise<string>;
  captureMultiple: (count: number) => Promise<string[]>;
  capturedPhotos: string[];
  previewPhoto: string | null;
  setPreviewPhoto: (photo: string | null) => void;
  deletePhoto: (photoIndex: number) => void;
  deleteMultiplePhotos: (photoIndexes: number[]) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  
  useEffect(() => {
    const initCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const constraints = {
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        setStream(mediaStream);
        setIsLoading(false);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access camera. Please check permissions and try again.');
        setIsLoading(false);
      }
    };
    
    initCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const capturePhoto = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (!videoRef.current || !stream) {
          reject('Camera not available');
          return;
        }
        
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Could not create canvas context');
          return;
        }
        
        // Flip the canvas horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        // Add to captured photos
        setCapturedPhotos(prev => [dataUrl, ...prev]);
        
        // Show success toast
        toast.success('Photo captured!', {
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#000',
          },
        });
        
        resolve(dataUrl);
      } catch (err) {
        console.error('Error capturing photo:', err);
        reject('Failed to capture photo');
      }
    });
  };
  
  const captureMultiple = async (count: number): Promise<string[]> => {
    const photos: string[] = [];
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < count; i++) {
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      try {
        const photo = await capturePhoto();
        photos.push(photo);
      } catch (err) {
        console.error('Error in burst mode:', err);
      }
    }
    
    return photos;
  };
  
  const deletePhoto = useCallback((photoIndex: number) => {
    // 获取要删除的照片
    const photoToDelete = capturedPhotos[photoIndex];
    
    // 先检查是否需要关闭预览，并在状态更新前关闭
    if (previewPhoto === photoToDelete) {
      setPreviewPhoto(null);
    }
    
    // 更新照片数组
    setCapturedPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos.splice(photoIndex, 1);
      
      // 仅在这里显示一次成功提示
      setTimeout(() => {
        toast.success('照片已删除', {
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#000',
          },
        });
      }, 0);
      
      return newPhotos;
    });
  }, [capturedPhotos, previewPhoto]);
  
  const deleteMultiplePhotos = useCallback((photoIndexes: number[]) => {
    // 对索引进行排序并从大到小删除，避免删除时索引变化的问题
    const sortedIndexes = [...photoIndexes].sort((a, b) => b - a);
    
    // 检查是否需要关闭预览
    const photosToDelete = sortedIndexes.map(index => capturedPhotos[index]);
    
    if (previewPhoto && photosToDelete.includes(previewPhoto)) {
      setPreviewPhoto(null);
    }
    
    // 更新照片数组
    setCapturedPhotos(prev => {
      const newPhotos = [...prev];
      
      // 依次删除照片
      sortedIndexes.forEach(index => {
        newPhotos.splice(index, 1);
      });
      
      // 仅在这里显示一次成功提示
      setTimeout(() => {
        toast.success(`已删除 ${photoIndexes.length} 张照片`, {
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#000',
          },
        });
      }, 0);
      
      return newPhotos;
    });
  }, [capturedPhotos, previewPhoto]);
  
  const value = {
    videoRef,
    isLoading,
    error,
    capturePhoto,
    captureMultiple,
    capturedPhotos,
    previewPhoto,
    setPreviewPhoto,
    deletePhoto,
    deleteMultiplePhotos
  };
  
  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};