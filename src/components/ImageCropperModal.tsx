import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Scissors, Trash2, X} from 'lucide-react';

interface ImageCropperModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onCrop: (croppedDataUrl: string) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ open, imageUrl, onClose, onCrop }) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(false);

  const handleCrop = () => {
    setLoading(true);
    const cropper = (cropperRef.current as any)?.cropper as Cropper;
    if (cropper) {
      const croppedDataUrl = cropper.getCroppedCanvas().toDataURL('image/png');
      onCrop(croppedDataUrl);
      onClose();
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 px-1 sm:px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] sm:h-[90vh] p-2 sm:p-6 relative flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full p-2 shadow text-black text-2xl font-bold z-10 transition"
          title="Cerrar"
        >
          <X className="w-6 h-6 text-black" />
        </button>
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-700 flex items-center gap-2">
          <Scissors className="w-6 h-6 text-black" /> Recortar imagen
        </h2>
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="w-full h-[60vh] sm:h-[70vh] flex items-center justify-center">
            <Cropper
              src={imageUrl}
              style={{ height: '100%', width: '100%', maxHeight: '70vh', maxWidth: '100%' }}
              initialAspectRatio={NaN}
              aspectRatio={undefined}
              guides={true}
              viewMode={1}
              dragMode="move"
              cropBoxResizable={true}
              cropBoxMovable={true}
              responsive={true}
              background={false}
              ref={cropperRef}
              minCropBoxWidth={20}
              minCropBoxHeight={20}
              checkOrientation={false}
              autoCropArea={1}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded shadow flex items-center gap-2 border border-gray-200 transition"
            disabled={loading}
          >
            <Trash2 className="w-5 h-5 text-black" /> Cancelar
          </button>
          <button
            onClick={handleCrop}
            className="bg-blue-300 hover:bg-blue-400 text-black font-semibold py-2 px-4 rounded shadow flex items-center gap-2 border border-gray-200 transition"
            disabled={loading}
          >
            <Scissors className="w-5 h-5 text-black" /> {loading ? 'Guardando...' : 'Guardar recorte'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
