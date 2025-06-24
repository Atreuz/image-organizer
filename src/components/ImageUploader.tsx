// ImageUploader.tsx
'use client';

import React, { useState } from 'react';
import { generatePdf } from '@/utils/generatePdf';
import { Upload, FileText, LayoutGrid, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function ImageUploader() {
  const [images, setImages] = useState<{ url: string; type: string }[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const [imagesPerPage, setImagesPerPage] = useState(4);
  const [columns, setColumns] = useState(2);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Nuevo estado para la URL del PDF

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const fileArray = Array.from(files).filter(file => allowedTypes.includes(file.type));
    if (fileArray.length < files.length) {
      alert('Solo se permiten imágenes JPG y PNG para el PDF.');
    }

    const imageObjs = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setImages(prev => [...prev, ...imageObjs]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      alert('No hay imágenes para generar el PDF.');
      return;
    }

    try {
      const blob = await generatePdf(images, pageSize, imagesPerPage, columns);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url); // Guardar la URL para vista previa
      // Eliminar descarga automática
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'documento.pdf';
      // link.click();
    } catch (err) {
      alert('Error al generar el PDF. Intenta nuevamente.');
      console.error(err);
    }
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

  return (
    <div className="space-y-6">
      <div className="border border-dashed border-blue-400 p-6 rounded-xl bg-blue-50">
        <label className="block mb-2 font-semibold text-blue-700 flex items-center gap-2">
          <Upload className="w-5 h-5" /> Sube tus imágenes
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="w-full bg-white border border-gray-300 rounded px-3 py-2 shadow-sm"
        />
      </div>

      {images.length === 0 ? (
        // Layout original centrado cuando no hay imágenes
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
            <div>
              <label className="block mb-1 font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Tamaño de hoja
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter')}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A4">A4</option>
                <option value="Letter">Carta</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> Imágenes por hoja
              </label>
              <select
                value={imagesPerPage}
                onChange={(e) => setImagesPerPage(parseInt(e.target.value))}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 4, 6, 9, 12].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> Columnas por página
              </label>
              <select
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4].map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 flex justify-center">
              <button
                onClick={handleGenerate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition"
              >
                Generar documento
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Layout de dos columnas cuando hay imágenes
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bloque de vista previa de imágenes a la izquierda */}
          <div>
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Vista previa de imágenes:</h2>
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                    <Image
                      src={img.url}
                      alt={`img-${index}`}
                      width={300}
                      height={160}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 text-xs shadow-md"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloque de controles y PDF a la derecha */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Tamaño de hoja
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter')}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Carta</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" /> Imágenes por hoja
                </label>
                <select
                  value={imagesPerPage}
                  onChange={(e) => setImagesPerPage(parseInt(e.target.value))}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 4, 6, 9, 12].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" /> Columnas por página
                </label>
                <select
                  value={columns}
                  onChange={(e) => setColumns(parseInt(e.target.value))}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4].map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-3 flex justify-center">
                <button
                  onClick={handleGenerate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition"
                >
                  Generar documento
                </button>
              </div>
            </div>

            {pdfUrl && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Vista previa del PDF:</h2>
                <div className="w-full h-[60vh] border rounded-xl overflow-hidden mb-4">
                  <iframe
                    src={pdfUrl}
                    title="Vista previa PDF"
                    className="w-full h-full"
                  />
                </div>
                {/* <button
                  onClick={handlePrint}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition"
                >
                  Imprimir PDF
                </button> */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
