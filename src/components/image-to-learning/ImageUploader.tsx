import React, { useState, useRef } from 'react';
import { Upload, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ImageUploaderProps {
  onImageSelected: (imageData: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Create URL for preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    onImageSelected(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelected(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          } transition-colors`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="relative">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-[300px] object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImagePlus className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('imageUploader.title')}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {t('imageUploader.dragDropText')}
              </p>
              <Button onClick={openFileDialog} className="gap-2">
                <Upload className="h-4 w-4" />
                {t('imageUploader.browseFiles')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader; 