import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageSelected: (imageDataUrl: string) => void;
  isSubmitting?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelected,
  isSubmitting = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Process the selected file
  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      onImageSelected(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Clear selected image
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Activate device camera
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setCameraStream(stream);
      setIsCameraActive(true);
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access your camera. Please check permissions.");
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (webcamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewUrl(dataUrl);
        onImageSelected(dataUrl);
        stopCamera();
      }
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  return (
    <div className="w-full h-full">
      {isCameraActive ? (
        <div className="relative h-full bg-black flex flex-col">
          <video 
            ref={webcamRef} 
            className="w-full h-full object-contain"
            autoPlay 
            playsInline
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            <Button 
              onClick={capturePhoto}
              size="lg"
              className="rounded-full w-16 h-16 bg-white text-primary hover:bg-gray-100"
            >
              <Camera className="h-8 w-8" />
            </Button>
            <Button 
              onClick={stopCamera}
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : previewUrl ? (
        <div className="relative w-full h-full">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain bg-white p-2"
          />
          <Button 
            onClick={clearImage}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded-full"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive ? 'bg-primary/10 border-primary' : 'bg-gray-50 border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
          
          <h3 className="text-lg font-medium text-gray-700 mb-2">Upload a photo of your solution</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Take a picture of your math solution using real objects
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleButtonClick}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
            
            <Button 
              onClick={activateCamera}
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 