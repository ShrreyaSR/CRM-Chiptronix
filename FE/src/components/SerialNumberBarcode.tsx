import { forwardRef, useEffect, useRef } from "react";
import React from "react";

interface SerialNumberBarcodeProps {
  serialNumber: string;
  jobId: string;
  isPreview?: boolean;
}

// Barcode generator component using Canvas
const BarcodeCanvas = ({ value }: { value: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate barcode pattern
    const barcodeData = value.toUpperCase();
    const barWidth = 4;
    const barHeight = 120;
    let x = 40;

    // Draw bars for each character
    ctx.fillStyle = '#000000';
    
    for (let i = 0; i < barcodeData.length; i++) {
      const charCode = barcodeData.charCodeAt(i);
      const pattern = charCode % 2 === 0 ? [1, 0, 1, 0, 1] : [1, 1, 0, 1, 0];
      
      pattern.forEach((bit) => {
        if (bit === 1) {
          ctx.fillRect(x, 30, barWidth, barHeight);
        }
        x += barWidth;
      });
      x += 3; // Space between characters
    }

    // Add text below barcode
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(value, canvas.width / 2, barHeight + 60);

  }, [value]);

  return <canvas ref={canvasRef} width={500} height={200} className="mx-auto" />;
};

export const SerialNumberBarcode = forwardRef<HTMLDivElement, SerialNumberBarcodeProps>(
  ({ serialNumber, jobId, isPreview = false }, ref) => {
    return (
      <div ref={ref} className={isPreview ? "barcode-preview" : "barcode-preview hidden"}>
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .barcode-preview, .barcode-preview * {
                visibility: visible;
              }
              .barcode-preview {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                display: block !important;
              }
              @page {
                size: 4in 2in;
                margin: 0;
              }
            }
          `}
        </style>
        
        {/* Barcode Sticker Design - 4x2 inch label */}
        <div className="w-[4in] h-[2in] bg-white p-4 border-4 border-blue-600 relative overflow-hidden flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="text-blue-700 tracking-wider mb-1" style={{ fontSize: '20px', fontWeight: '800' }}>
              CHIPTRONIX
            </h1>
            <p className="text-gray-600 text-xs uppercase tracking-wide">Serial Number Tracking</p>
            <p className="text-blue-600 text-sm font-semibold mt-1">Job ID: {jobId}</p>
          </div>

          {/* Barcode */}
          <div className="flex-1 flex items-center justify-center">
            <BarcodeCanvas value={serialNumber} />
          </div>

          {/* Footer */}
          <div className="mt-2 text-center">
            <p className="text-[8px] text-gray-500 uppercase tracking-wide">
              Scan for device identification
            </p>
          </div>
        </div>
      </div>
    );
  }
);

SerialNumberBarcode.displayName = "SerialNumberBarcode";
