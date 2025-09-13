import React, { Suspense } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Loader2 } from 'lucide-react'

// Lazy load the BarcodeScanner component to defer react-zxing dependency
const BarcodeScanner = React.lazy(() => import('./BarcodeScanner'))

interface LazyBarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onBarcodeScanned: (barcode: string) => void
  onManualEntry: () => void
}

// Loading fallback component for the barcode scanner
const ScannerLoadingFallback = () => (
  <Dialog open={true}>
    <DialogContent className="max-w-md mx-auto sm:max-w-lg w-[95vw]">
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-300">Loading barcode scanner...</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export default function LazyBarcodeScanner(props: LazyBarcodeScannerProps) {
  // Only render when actually opened to ensure the dynamic import only happens when needed
  if (!props.isOpen) {
    return null
  }

  return (
    <Suspense fallback={<ScannerLoadingFallback />}>
      <BarcodeScanner {...props} />
    </Suspense>
  )
}