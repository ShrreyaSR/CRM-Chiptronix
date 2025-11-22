import React from "react";
import { forwardRef, useEffect, useRef } from "react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface JobSheetBillProps {
  job: {
    id: string;
    client: string;
    contactNumber?: string;
    brand: string;
    model: string;
    serialNumber: string;
    color: string;
    complaints: string;
    accessories?: string;
    problemsIdentified?: string;
    trayNumber: string;
    receivedBy: string;
    dateReceived: string;
    status: string;
  };
  isPreview?: boolean;
}

// Simple barcode generator component using SVG
const Barcode = ({ value }: { value: string }) => {
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

    // Generate simple barcode pattern (Code 39 style)
    const barcodeData = value.toUpperCase();
    const barWidth = 3;
    const barHeight = 60;
    let x = 10;

    // Start pattern
    ctx.fillStyle = '#000000';
    
    // Draw bars for each character
    for (let i = 0; i < barcodeData.length; i++) {
      const charCode = barcodeData.charCodeAt(i);
      const pattern = charCode % 2 === 0 ? [1, 0, 1, 0, 1] : [1, 1, 0, 1, 0];
      
      pattern.forEach((bit) => {
        if (bit === 1) {
          ctx.fillRect(x, 5, barWidth, barHeight);
        }
        x += barWidth;
      });
      x += 2; // Space between characters
    }

    // Add text below barcode
    ctx.fillStyle = '#000000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(value, canvas.width / 2, barHeight + 20);

  }, [value]);

  return <canvas ref={canvasRef} width={300} height={90} className="mx-auto" />;
};

export const JobSheetBill = forwardRef<HTMLDivElement, JobSheetBillProps>(
  ({ job, isPreview = false }, ref) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'Delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    return (
      <div ref={ref} className={isPreview ? "print-bill" : "print-bill hidden"}>
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-bill, .print-bill * {
                visibility: visible;
              }
              .print-bill {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                display: block !important;
              }
              @page {
                size: 4in 3in;
                margin: 0;
              }
            }
          `}
        </style>
        
        {/* Sticker/Bill Design - 4x3 inch label */}
        <div className="w-[4in] h-[3in] bg-white p-3 border-4 border-blue-600 relative overflow-hidden">
          {/* Corner Decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600 opacity-10 transform rotate-45 translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-600 opacity-10 transform rotate-45 -translate-x-8 translate-y-8"></div>
          
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-blue-700 tracking-wider mb-0.5" style={{ fontSize: '18px', fontWeight: '800' }}>
              CHIPTRONIX
            </h1>
            <p className="text-gray-600 text-[8px] uppercase tracking-wide">Laptop Repair Service</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge className={`${getStatusColor(job.status)} border text-[8px] px-2 py-0.5`}>
                {job.status}
              </Badge>
              <div className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                {job.id}
              </div>
            </div>
          </div>

          <Separator className="my-1.5 bg-blue-200" />

          {/* Job Details - Two Column Layout */}
          <div className="space-y-1">
            {/* Client Info */}
            <div>
              <p className="text-[7px] text-gray-500 uppercase">Client Name</p>
              <p className="text-[11px] text-gray-900 font-semibold">{job.client}</p>
            </div>

            {/* Device Info */}
            <div className="bg-blue-50 p-1.5 rounded border border-blue-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[7px] text-blue-600 uppercase">Brand/Model</p>
                  <p className="text-[9px] text-gray-900 truncate">{job.brand} {job.model}</p>
                </div>
                <div>
                  <p className="text-[7px] text-blue-600 uppercase">Color</p>
                  <p className="text-[9px] text-gray-900">{job.color}</p>
                </div>
              </div>
            </div>

            {/* Serial Number Barcode */}
            <div className="bg-white border-2 border-blue-300 p-1.5 rounded">
              <p className="text-[7px] text-blue-600 uppercase text-center mb-1">Serial Number</p>
              <Barcode value={job.serialNumber} />
            </div>

            {/* Tray Number - Prominent */}
            <div className="bg-yellow-50 border-2 border-yellow-400 p-1.5 rounded">
              <p className="text-[7px] text-yellow-700 uppercase text-center">Tray Location</p>
              <p className="text-[16px] text-yellow-900 font-bold text-center tracking-wider">{job.trayNumber}</p>
            </div>

            {/* Issues Reported */}
            <div>
              <p className="text-[7px] text-gray-500 uppercase">Customer Complaint</p>
              <p className="text-[9px] text-gray-900 leading-tight">{job.complaints}</p>
            </div>

            {/* Problems Identified */}
            {job.problemsIdentified && (
              <div>
                <p className="text-[7px] text-red-600 uppercase">Problems Identified</p>
                <p className="text-[9px] text-gray-900 leading-tight">{job.problemsIdentified}</p>
              </div>
            )}

            {/* Accessories */}
            <div>
              <p className="text-[7px] text-gray-500 uppercase">Accessories Received</p>
              <p className="text-[9px] text-gray-900 leading-tight">{job.accessories || 'None'}</p>
            </div>

            <Separator className="my-1 bg-gray-200" />

            {/* Footer */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[7px] text-gray-500 uppercase">Received By</p>
                <p className="text-[8px] text-gray-900">{job.receivedBy}</p>
              </div>
              <div>
                <p className="text-[7px] text-gray-500 uppercase">Date Received</p>
                <p className="text-[8px] text-gray-900">{job.dateReceived}</p>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="mt-1 bg-yellow-50 border border-yellow-300 rounded p-1">
            <p className="text-[6px] text-yellow-800 text-center leading-tight">
              ⚠️ DO NOT REMOVE • INTERNAL USE ONLY • HANDLE WITH CARE
            </p>
          </div>
        </div>
      </div>
    );
  }
);

JobSheetBill.displayName = "JobSheetBill";
