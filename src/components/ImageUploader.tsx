// ImageUploader.tsx
'use client';

const isMobile = () => {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

import React, { useState } from 'react';
import { Upload, FileText, LayoutGrid, Trash2, Scissors } from 'lucide-react';
import Image from 'next/image';
import { useImageHandler } from '@/hooks/useImageHandler';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import ImageCropperModal from './ImageCropperModal';

export default function ImageUploader() {
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const [imagesPerPage, setImagesPerPage] = useState(4);
  const [columns, setColumns] = useState(2);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageIndex, setCropImageIndex] = useState<number | null>(null);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  
  const { images, handleFileChange, removeImage, clearImages } = useImageHandler();
  const { pdfUrl, showModal, handleGeneratePdf, closeModal } = usePdfGenerator();

  const handleGenerate = async () => {
    await handleGeneratePdf(images, pageSize, imagesPerPage, columns);
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.focus();
          printWindow.print();
        });
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
    e.target.value = ""; // Resetear el input para permitir subir los mismos archivos de nuevo
  };

  const handleOpenCropModal = (index: number) => {
    setCropImageIndex(index);
    setCropImageUrl(images[index].url);
    setCropModalOpen(true);
  };

  const handleCloseCropModal = () => {
    setCropModalOpen(false);
    setCropImageIndex(null);
    setCropImageUrl(null);
  };

const handleCropImage = (croppedDataUrl: string) => {
  if (cropImageIndex !== null) {
    images[cropImageIndex].url = croppedDataUrl;
    images[cropImageIndex].type = 'image/png'; // Asegura el tipo correcto
    // Si usas setImages, hazlo aquí
  }
};

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
      <label htmlFor="file-upload" className="block cursor-pointer border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 p-6 sm:p-8 transition hover:bg-blue-100 focus-within:ring-2 focus-within:ring-blue-400">
        <div className="flex flex-col items-center justify-center gap-2 text-center min-h-[120px]">
          <Upload className="w-8 h-8 text-blue-600 mb-1" />
          <span className="font-semibold text-blue-700 text-base sm:text-lg">Sube tus imágenes</span>
          <span className="text-xs text-blue-500">JPG, PNG. Puedes seleccionar varias.</span>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </label>

      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6 w-full max-w-3xl">
          <div className="w-full">
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
              <FileText className="w-4 h-4" /> Tamaño de hoja
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter')}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="A4">A4</option>
              <option value="Letter">Carta</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
              <LayoutGrid className="w-4 h-4" /> Imágenes por hoja
            </label>
            <select
              value={imagesPerPage}
              onChange={(e) => setImagesPerPage(parseInt(e.target.value))}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {[1, 2, 4, 6, 9, 12].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
              <LayoutGrid className="w-4 h-4" /> Columnas por página
            </label>
            <select
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value))}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {[1, 2, 3, 4].map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-center w-full">
            <button
              onClick={handleGenerate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl shadow transition w-full text-base sm:text-lg"
            >
              Generar documento
            </button>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-8 sm:mt-10 relative max-w-6xl mx-auto border border-blue-200 bg-blue-50 rounded-2xl p-3 sm:p-6 shadow-lg">
          <button
            onClick={clearImages}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-blue-500 hover:text-red-600 text-lg sm:text-xl font-bold bg-white/70 rounded-full px-2 py-1 sm:px-3 shadow"
            title="Cerrar vista previa de imágenes"
          >
            ×
          </button>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">Vista previa de imágenes:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative group border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition bg-white">
                <Image
                  src={img.url}
                  alt={`img-${index}`}
                  width={300}
                  height={160}
                  className="w-full h-28 sm:h-40 object-cover"
                />
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCropModal(index)}
                    className="bg-white hover:bg-gray-300 text-white rounded-full p-1 text-xs sm:text-sm shadow-md"
                    title="Recortar imagen"
                  >
                     <Scissors className="w-4 h-4 text-black" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1 text-xs sm:text-sm shadow-md transition"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de recorte */}
      <ImageCropperModal
        open={cropModalOpen && !!cropImageUrl}
        imageUrl={cropImageUrl || ''}
        onClose={handleCloseCropModal}
        onCrop={handleCropImage}
      />

      {showModal && pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 px-2">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg sm:max-w-2xl md:max-w-3xl w-full p-2 sm:p-6 relative flex flex-col">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-800 text-xl sm:text-2xl font-bold"
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">Vista previa del PDF</h2>
            <div className="w-full h-[50vh] sm:h-[65vh] border rounded-xl overflow-hidden mb-3 sm:mb-4">
              <iframe
                src={pdfUrl}
                title="Vista previa PDF"
                className="w-full h-full"
              />
            </div>
            {isMobile() ? (
              <a
                href={pdfUrl}
                download="documento.pdf"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl shadow transition self-center text-base sm:text-lg text-center"
              >
                Descargar PDF
              </a>
            ) : (
              <button
                onClick={handlePrint}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-xl shadow transition self-center text-base sm:text-lg"
              >
                Imprimir PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
