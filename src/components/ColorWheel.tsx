import React, { useRef, useState, useEffect } from 'react';

interface ColorWheelProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ color, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState(color);
  
  // Draw color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = (angle + 1) * Math.PI / 180;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      const hue = angle;
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.5, `hsl(${hue}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue}, 100%, 10%)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Draw center white circle for saturation
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    
    // Position the selector based on the current color
    positionSelector(color);
    
  }, [canvasRef]);

  const getColorAtPosition = (x: number, y: number): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '#FFFFFF';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '#FFFFFF';

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  };
  
  // Position the selector based on the current color
  const positionSelector = (colorStr: string) => {
    // Parse the color
    let r = 0, g = 0, b = 0;
    
    if (colorStr.startsWith('#')) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorStr);
      if (result) {
        r = parseInt(result[1], 16);
        g = parseInt(result[2], 16);
        b = parseInt(result[3], 16);
      }
    } else if (colorStr.startsWith('rgb')) {
      const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+(?:\.\d+)?)?\)$/i.exec(colorStr);
      if (result) {
        r = parseInt(result[1]);
        g = parseInt(result[2]);
        b = parseInt(result[3]);
      }
    }
    
    // Convert RGB to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Convert HSL to position
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    
    // The hue determines the angle
    const angle = h * 360;
    const angleRad = angle * Math.PI / 180;
    
    // The saturation determines the distance from the center
    const distance = s * radius;
    
    const x = centerX + Math.cos(angleRad) * distance;
    const y = centerY - Math.sin(angleRad) * distance;
    
    setPosition({ x, y });
  };
  
  // Handle mouse/touch interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handlePointerMove(e);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get the color at the current position
    const newColor = getColorAtPosition(x, y);
    setCurrentColor(newColor);
    setPosition({ x, y });
    onChange(newColor);
  };
  
  const handlePointerUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointerleave', handlePointerUp);
    
    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerleave', handlePointerUp);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square max-w-[200px] mx-auto touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <canvas 
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-full rounded-full"
      />
      
      {/* Color selector indicator */}
      <div 
        className="absolute w-6 h-6 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-100"
        style={{ 
          left: position.x, 
          top: position.y,
          backgroundColor: currentColor,
          boxShadow: '0 0 5px rgba(0,0,0,0.5)'
        }}
      />
    </div>
  );
};

export default ColorWheel;