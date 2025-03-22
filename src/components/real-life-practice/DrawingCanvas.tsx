import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect, useCallback } from 'react';
import { Pencil, Eraser, RefreshCw } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';

export interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onDrawingComplete?: (dataUrl: string) => void;
}

export interface DrawingCanvasRef {
  toDataURL: (type?: string, quality?: number) => string;
  clearCanvas: () => void;
  isEmpty: () => boolean;
}

type Tool = 'pencil' | 'eraser';

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ width, height, onDrawingComplete }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  // Add a drawing timeout ref to debounce notifications
  const drawingTimeoutRef = useRef<number | null>(null);

  // Function to notify parent of drawing (debounced)
  const notifyDrawingComplete = useCallback(() => {
    if (!canvasRef.current || !onDrawingComplete) return;
    
    // Clear any existing timeout
    if (drawingTimeoutRef.current) {
      window.clearTimeout(drawingTimeoutRef.current);
    }
    
    // Set a new timeout
    drawingTimeoutRef.current = window.setTimeout(() => {
      onDrawingComplete(canvasRef.current!.toDataURL());
    }, 300); // Debounce for 300ms
  }, [onDrawingComplete]);

  // Setup canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set willReadFrequently to true to optimize for multiple getImageData calls
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    
    setContext(ctx);

    // Initial canvas size
    updateCanvasSize();
    
    // Event listener for window resize
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Update canvas drawing properties when they change
  useEffect(() => {
    if (!context) return;
    
    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    context.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
  }, [context, color, brushSize, tool]);

  // Method to check if the canvas is empty
  const isEmpty = (): boolean => {
    if (!canvasRef.current || !context) return true;
    
    // Get image data from the entire canvas
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const data = imageData.data;
    
    // Check if any pixel has a non-zero alpha value (meaning something was drawn)
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) {
        return false; // Canvas has content
      }
    }
    
    return true; // Canvas is empty
  };

  // Method to export the canvas as a data URL
  const toDataURL = (type = 'image/png', quality = 0.8): string => {
    if (!canvasRef.current) return '';
    
    // Get current drawing
    const currentCanvas = canvasRef.current;
    
    // Create a temporary canvas at full resolution to avoid quality loss
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = currentCanvas.width;
    tempCanvas.height = currentCanvas.height;
    
    // Copy content to temp canvas
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(currentCanvas, 0, 0);
    }
    
    // Return data URL from temp canvas
    return tempCanvas.toDataURL(type, quality);
  };

  // Method to handle window resize
  const handleResize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !context) return;
    
    // Store current drawing
    const currentDrawing = canvasRef.current.toDataURL();
    
    // Call the updateCanvasSize function instead of undefined resizeCanvas
    updateCanvasSize();
    
    // If there was a drawing, restore it
    if (currentDrawing && currentDrawing !== 'data:,') {
      const img = new Image();
      img.onload = () => {
        if (context && canvasRef.current) {
          context.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      };
      img.src = currentDrawing;
    }
  }, [context]);

  // Add resize event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Method to clear the canvas
  const clearCanvas = (): void => {
    if (!canvasRef.current || !context) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // If there's a callback for drawing completion, notify that the canvas is now empty
    if (onDrawingComplete) {
      onDrawingComplete('data:,');
    }
  };

  // Update drawing state when isDrawing changes
  useEffect(() => {
    // When drawing stops, notify parent component
    if (!isDrawing && canvasRef.current && onDrawingComplete) {
      // Small timeout to ensure the final stroke is rendered
      setTimeout(() => {
        if (canvasRef.current && !isEmpty()) {
          onDrawingComplete(canvasRef.current.toDataURL());
        }
      }, 50);
    }
  }, [isDrawing, onDrawingComplete]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    toDataURL,
    clearCanvas,
    isEmpty
  }));

  const updateCanvasSize = () => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match container
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    setCanvasWidth(newWidth);
    setCanvasHeight(newHeight);
    
    // Redraw if context exists
    if (context) {
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    setIsDrawing(true);
    
    // Get position
    const position = getPointerPosition(e);
    if (!position) return;
    
    // Move to position and start new path
    context.beginPath();
    context.moveTo(position.x, position.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    // Prevent scrolling on touch devices - using passive: false to avoid console errors
    if (e.type === 'touchmove') {
      // Modern browsers ignore e.preventDefault() in passive listeners
      // Don't call it here, we'll handle this differently
    }
    
    // Get current position
    const position = getPointerPosition(e);
    if (!position) return;
    
    // Draw line to current position
    context.lineTo(position.x, position.y);
    context.stroke();
    
    // Notify parent that drawing has occurred (debounced)
    notifyDrawingComplete();
  };

  const stopDrawing = () => {
    if (!context) return;
    
    setIsDrawing(false);
    context.closePath();
    
    // Notify parent when drawing is complete
    if (canvasRef.current && !isEmpty() && onDrawingComplete) {
      onDrawingComplete(canvasRef.current.toDataURL());
    }
  };

  const getPointerPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Color options
  const colorOptions = [
    '#000000', // Black
    '#FF0000', // Red
    '#0000FF', // Blue
    '#008000', // Green
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB', // Pink
    '#A52A2A', // Brown
  ];

  return (
    <div className="drawing-canvas-wrapper h-full flex flex-col">
      {/* Canvas toolbar */}
      <div className="p-2 border-b border-amber-100 bg-white flex flex-wrap gap-2 items-center">
        {/* Drawing tools */}
        <ToggleGroup type="single" value={tool} onValueChange={(value) => value && setTool(value as Tool)}>
          <ToggleGroupItem value="pencil" aria-label="Pencil">
            <Pencil className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="eraser" aria-label="Eraser">
            <Eraser className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        {/* Color picker */}
        <div className="flex gap-1 ml-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-offset-1 ring-black' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        
        {/* Brush size */}
        <div className="ml-4 flex items-center gap-2">
          <span className="text-xs text-gray-600">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
      
      {/* Canvas container */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-hidden bg-white touch-none"
      >
        <canvas
          ref={canvasRef}
          className="touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          // Fix the touch event handling
          onTouchMove={(e) => {
            e.stopPropagation();
            // In React, calling preventDefault() in passive events throws warnings
            // We handle this by adding the style touchAction: 'none' instead
            draw(e);
          }}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }} /* This is better than preventDefault for touch events */
        />
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas; 