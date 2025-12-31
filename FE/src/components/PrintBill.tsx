import React from 'react';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';
import Barcode from 'react-barcode';

interface PrintBillProps {
  jobData: {
    id: string;
    jobNo: string;
    serialNumber: string;
    date: string;
    customerName: string;
    customerAddress?: string;
    customerPhone: string;
    customerEmail?: string;
    model: string;
    brand: string;
    color?: string;
    complaints: string;
    problemIdentified?: string;
    status: string;
    advancePaid?: number;
  };
}

export function PrintBill({ jobData }: PrintBillProps) {
  const handlePrint = () => {
    window.print();
  };

  const isPaid = jobData.status === 'Paid' || jobData.status === 'Delivered';

  return (
    <>
      {/* Print Button - Hidden during print */}
      <div className="no-print mb-4">
        <Button
          onClick={handlePrint}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Bill
        </Button>
      </div>

      {/* Print Content */}
      <div className="print-content">
        {/* PAGE 1 - Customer Copy */}
        <div className="print-page page-1 bg-white p-6">
          {/* Header */}
          <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">CHIPTRONIX</h1>
            <p className="text-sm text-gray-600">Laptop Repair & Service Center</p>
            <div className="mt-3 text-xs text-gray-700 space-y-1">
              <p>1st Floor, AGR Complex, Sathy Road</p>
              <p>Nearby Busstand, Dhyanalinga Oils Upstairs</p>
              <p>Erode, Tamil Nadu - 638003</p>
              <p className="mt-2 font-semibold">📞 9344563214 | ✉ chiptronixerode@gmail.com</p>
            </div>
          </div>

          {/* Bill Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
              SERVICE JOB SHEET 
            </h2>
          </div>

          {/* Job and Customer Details in Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Job Details */}
            <div className="border border-gray-300 rounded-lg p-2">
              <h3 className="font-semibold text-sm text-blue-600 mb-3 border-b pb-2">
                JOB DETAILS
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job No:</span>
                  <span className="font-semibold text-gray-800">{jobData.jobNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-800">{jobData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-blue-600">{jobData.status}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border border-gray-300 rounded-lg p-2">
              <h3 className="font-semibold text-sm text-blue-600 mb-3 border-b pb-2">
                CUSTOMER DETAILS
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800">{jobData.customerName}</span>
                </div>
                {jobData.customerAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-semibold text-gray-800">{jobData.customerAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-800">{jobData.customerPhone}</span>
                </div>
                {jobData.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-800">{jobData.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Device Details */}
          <div className="border border-gray-300 rounded-lg p-2 mb-4">
            <h3 className="font-semibold text-sm text-blue-600 mb-3 border-b pb-2">
              DEVICE DETAILS
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Brand:</span>
                <span className="font-semibold text-gray-800">{jobData.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Model:</span>
                <span className="font-semibold text-gray-800">{jobData.model}</span>
              </div>
              {jobData.color && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold text-gray-800">{jobData.color}</span>
                </div>
              )}
            </div>
          </div>

          {/* Complaints */}
          <div className="border border-gray-300 rounded-lg p-2 mb-4">
            <h3 className="font-semibold text-sm text-blue-600 mb-3 border-b pb-2">
              COMPLAINTS
            </h3>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{jobData.complaints}</p>
          </div>

          {/* Problem Identified */}
          {jobData.problemIdentified && (
            <div className="border border-gray-300 rounded-lg p-2 mb-4">
              <h3 className="font-semibold text-sm text-blue-600 mb-3 border-b pb-2">
                PROBLEM IDENTIFIED
              </h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {jobData.problemIdentified}
              </p>
            </div>
          )}

          {/* Payment Details - Only if paid */}
          {isPaid && (jobData.advancePaid) && (
            <div className="border-2 border-green-500 rounded-lg p-2 mb-4 bg-green-50">
              <h3 className="font-semibold text-sm text-green-700 mb-3 border-b border-green-300 pb-2">
                PAYMENT DETAILS
              </h3>
              <div className="space-y-2 text-sm">
                {jobData.advancePaid && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Advance Paid:</span>
                    <span className="font-semibold text-gray-800">₹{jobData.advancePaid}</span>
                   </div>
                )}
              </div>
              <div className="mt-3 pt-3 ">
                <p className="text-xs font-semibold text-green-700 text-center">
                  ✓ PAYMENT COMPLETED
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
        

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Thank you for choosing Chiptronix! Visit us again.</p>
          </div>
        </div>

        {/* PAGE 2 - Service Copy (To keep with laptop) */}
        <div className="print-page page-2 bg-white p-8">
          {/* Header */}
          <div className="text-center border-b-2 border-blue-600 pb-4 mb-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">CHIPTRONIX</h1>
            <p className="text-sm text-gray-600">Internal Service Copy</p>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
              JOB SHEET - SERVICE COPY
            </h2>
            <p className="text-sm text-red-600 mt-2 font-semibold">
              ⚠ ATTACH TO DEVICE - DO NOT REMOVE
            </p>
          </div>

          {/* Job Details - Large and Prominent */}
          <div className="border-2 border-blue-600 rounded-lg p-6 mb-6 bg-blue-50">
            <div className="grid grid-cols-3 gap-between text-base">
              <div>
                <span className="text-gray-600">Job No:</span>
                <p className="text-semibold font-bold text-blue-600">{jobData.jobNo}</p>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <p className="font-semibold text-gray-800">{jobData.date}</p>
              </div>
              <div>
                <span className="text-gray-600">Customer:</span>
                <p className="font-semibold text-gray-800">{jobData.customerName}</p>
              </div>
            </div>
          </div>

          {/* Device Details */}
          <div className="border border-gray-300 rounded-lg p-2 mb-4">
            <h3 className="font-semibold text-sm text-blue-600 mb-3 border-b pb-2">
              DEVICE DETAILS
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Brand:</span>
                <span className="font-semibold text-gray-800">{jobData.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Model:</span>
                <span className="font-semibold text-gray-800">{jobData.model}</span>
              </div>
              {jobData.color && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold text-gray-800">{jobData.color}</span>
                </div>
              )}
            </div>
          </div>

          {/* Complaints */}
          <div className="border border-gray-300 rounded-lg p-2 mb-4">
            <h3 className="font-semibold text-base text-blue-600 mb-4 border-b pb-2">
              COMPLAINTS
            </h3>
            <p className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
              {jobData.complaints}
            </p>
          </div>

          {/* Problem Identified */}
          {jobData.problemIdentified && (
            <div className="border border-gray-300 rounded-lg p-2 mb-4">
              <h3 className="font-semibold text-base text-blue-600 mb-4 border-b pb-2">
                PROBLEM IDENTIFIED
              </h3>
              <p className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                {jobData.problemIdentified}
              </p>
            </div>
          )}

          {/* Serial Number Barcode - Service Copy */}
          <div className="border-2 border-blue-600 rounded-lg p-2 mb-4 bg-blue-50">
            <h3 className="font-semibold text-base text-blue-600 mb-3 border-b border-blue-300 pb-2 text-center">
              DEVICE SERIAL NUMBER
            </h3>
            <div className="flex justify-center items-center">
              <Barcode 
                value={jobData.serialNumber} 
                width={2}
                height={70}
                displayValue={true}
                fontSize={16}
                background="#EFF6FF"
                lineColor="#1E40AF"
              />
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">Scan for quick device identification</p>
          </div>


          <div className="mt-6 text-center text-xs text-red-600 font-semibold border-t-2 border-red-300 pt-3">
            <p>⚠ INTERNAL USE ONLY - KEEP WITH DEVICE UNTIL DELIVERY ⚠</p>
          </div>
        </div>
      </div>
    </>
  );
}