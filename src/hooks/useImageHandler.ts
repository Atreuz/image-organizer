import { useState } from 'react';

type ImageType = { url: string; type: string };

export const useImageHandler = () => {
  const [images, setImages] = useState<ImageType[]>([]);

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const fileArray = Array.from(files).filter(file => allowedTypes.includes(file.type));
    if (fileArray.length < files.length) {
      alert('Solo se permiten imágenes JPG y PNG para el PDF.');
    }

    const imageObjs = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type
    }));

    setImages(prev => [...prev, ...imageObjs]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => setImages([]);

  return {
    images,
    handleFileChange,
    removeImage,
    clearImages,
  };
};
