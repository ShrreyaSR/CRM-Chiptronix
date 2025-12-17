
  // Print bill function
  const handlePrintBill = (job: JobSheetDto) => {
    setSelectedJobForBill(job);
    setShowBillPreview(true);
  };

  const handlePrintBarcode = (job: JobSheetDto) => {
    setSelectedJobForBill(job);
    setShowBarcodePreview(true);
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };