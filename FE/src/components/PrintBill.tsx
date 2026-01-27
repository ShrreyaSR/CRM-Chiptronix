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
        <div className="print-page bg-white p-4">
          {/* Compact Header */}
          <div className="flex justify-between items-start border-b border-gray-300 pb-3 mb-3">
            <div>
              <h2 className="text-xl font-semibold text-blue-600 leading-tight">CHIPTRONIX</h2>
              <p className="text-xs text-gray-600">Laptop Repair &amp; Service Center</p>
              <p className="text-[11px] text-gray-700">
                1st Floor, AGR Complex, Sathy Road, Near Bus Stand, Dhyanalinga Oils Upstairs<br />
                Erode - 638003 &nbsp;|&nbsp; 📞 9344563214 &nbsp;|&nbsp; ✉ chiptronixerode@gmail.com
              </p>
            </div>
            <div className="text-xs text-gray-700 text-right space-y-1">
              <div><span className="font-semibold">Job No:</span> {jobData.jobNo}</div>
              <div><span className="font-semibold">Date:</span> {jobData.date}</div>
              <div><span className="font-semibold">Status:</span> {jobData.status}</div>
            </div>
          </div>

          <div className="grid grid-rows-2 gap-3 text-xs">
            {/* Customer Copy - Top Half */}
            <section className="border border-gray-300 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-blue-600">Customer Copy</h3>
                <span className="text-[11px] text-gray-500 uppercase">Service Job Sheet</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="border border-gray-200 rounded p-2">
                  <p className="text-[11px] font-semibold text-gray-700 border-b pb-1 mb-1">
                    Job Details
                  </p>
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job No</span>
                      <span className="font-semibold">{jobData.jobNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold">{jobData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-semibold text-blue-600">{jobData.status}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded p-2">
                  <p className="text-[11px] font-semibold text-gray-700 border-b pb-1 mb-1">
                    Customer Details
                  </p>
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name</span>
                      <span className="font-semibold text-gray-800">
                        {jobData.customerName}
                      </span>
                    </div>
                    {jobData.customerAddress && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address</span>
                        <span className="font-semibold text-gray-800 text-right">
                          {jobData.customerAddress}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-semibold text-gray-800">
                        {jobData.customerPhone}
                      </span>
                    </div>
                    {jobData.customerEmail && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-semibold text-gray-800">
                          {jobData.customerEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded p-2 mb-2">
                <p className="text-[11px] font-semibold text-blue-600 mb-1">Device Details</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-gray-600 text-[11px]">Brand</span>
                    <div className="font-semibold text-gray-800 text-xs">{jobData.brand}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[11px]">Model</span>
                    <div className="font-semibold text-gray-800 text-xs">{jobData.model}</div>
                  </div>
                  {jobData.color && (
                    <div>
                      <span className="text-gray-600 text-[11px]">Color</span>
                      <div className="font-semibold text-gray-800 text-xs">
                        {jobData.color}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded p-2 mb-2">
                <p className="text-[11px] font-semibold text-blue-600 mb-1">Complaints</p>
                <p className="text-xs text-gray-800 whitespace-pre-wrap leading-snug">
                  {jobData.complaints}
                </p>
              </div>

              {jobData.problemIdentified && (
                <div className="border border-gray-200 rounded p-2 mb-2">
                  <p className="text-[11px] font-semibold text-blue-600 mb-1">
                    Problem Identified
                  </p>
                  <p className="text-xs text-gray-800 whitespace-pre-wrap leading-snug">
                    {jobData.problemIdentified}
                  </p>
                </div>
              )}

              {isPaid && jobData.advancePaid && (
                <div className="border border-green-400 rounded p-2 bg-green-50">
                  <p className="text-[11px] font-semibold text-green-700 mb-1">
                    Payment Details
                  </p>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Advance Paid</span>
                    <span className="font-semibold text-gray-800">
                      ₹{jobData.advancePaid}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-green-700 text-center">
                    ✓ Payment Completed
                  </p>
                </div>
              )}
            </section>

            {/* Service Copy - Bottom Half */}
            <section className="border border-gray-300 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-blue-600">Service Copy</h3>
                <span className="text-[11px] text-red-600 font-semibold uppercase">
                  Attach to Device
                </span>
              </div>

              <div className="border border-blue-200 rounded p-2 mb-2 bg-blue-50">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600 text-[11px]">Job No</span>
                    <div className="font-semibold text-blue-700">{jobData.jobNo}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[11px]">Date</span>
                    <div className="font-semibold text-gray-800">{jobData.date}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[11px]">Customer</span>
                    <div className="font-semibold text-gray-800">{jobData.customerName}</div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded p-2 mb-2">
                <p className="text-[11px] font-semibold text-blue-600 mb-1">Device</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600 text-[11px]">Brand</span>
                    <div className="font-semibold text-gray-800">{jobData.brand}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[11px]">Model</span>
                    <div className="font-semibold text-gray-800">{jobData.model}</div>
                  </div>
                  {jobData.color && (
                    <div>
                      <span className="text-gray-600 text-[11px]">Color</span>
                      <div className="font-semibold text-gray-800">{jobData.color}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded p-2 mb-2">
                <p className="text-[11px] font-semibold text-blue-600 mb-1">Complaints</p>
                <p className="text-xs text-gray-800 whitespace-pre-wrap leading-snug">
                  {jobData.complaints}
                </p>
              </div>

              {jobData.problemIdentified && (
                <div className="border border-gray-200 rounded p-2 mb-2">
                  <p className="text-[11px] font-semibold text-blue-600 mb-1">
                    Problem Identified
                  </p>
                  <p className="text-xs text-gray-800 whitespace-pre-wrap leading-snug">
                    {jobData.problemIdentified}
                  </p>
                </div>
              )}

              <div className="border border-blue-400 rounded p-2 mb-2 bg-blue-50">
                <p className="text-[11px] font-semibold text-blue-700 mb-1 text-center">
                  Device Serial Number
                </p>
                <div className="flex justify-center">
                  <Barcode
                    value={jobData.serialNumber}
                    width={1.5}
                    height={60}
                    displayValue={true}
                    fontSize={10}
                    background="#EFF6FF"
                    lineColor="#1E40AF"
                  />
                </div>
                <p className="text-center text-[10px] text-gray-600 mt-1">
                  Scan for quick device identification
                </p>
              </div>

              <p className="mt-1 text-center text-[10px] text-red-600 font-semibold border-t border-red-200 pt-1">
                ⚠ Internal Use Only &nbsp;•&nbsp; Keep with device until delivery
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}