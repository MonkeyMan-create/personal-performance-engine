import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { X, Scan } from 'lucide-react'

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onBarcodeScanned: (barcode: string) => void
  onManualEntry?: () => void
}

export default function BarcodeScanner({ 
  isOpen, 
  onClose, 
  onBarcodeScanned, 
  onManualEntry 
}: BarcodeScannerProps) {
  const [manualBarcode, setManualBarcode] = useState('')

  const handleSubmit = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim())
      setManualBarcode('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-base max-w-md mx-auto">
        <DialogHeader className="card-header">
          <div className="flex items-center justify-between">
            <DialogTitle className="card-title flex items-center gap-2">
              <Scan className="w-5 h-5 text-action" />
              Barcode Scanner
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="button-ghost"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="card-content space-y-4">
          <div className="text-center space-y-4">
            <div className="w-48 h-32 mx-auto bg-surface border-2 border-dashed border-border rounded-lg flex items-center justify-center">
              <Scan className="w-12 h-12 text-tertiary" />
            </div>
            <p className="text-secondary text-sm">
              Camera scanning not available. Enter barcode manually below.
            </p>
          </div>
          
          <div className="space-y-3">
            <Input
              placeholder="Enter barcode manually..."
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="input-base"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!manualBarcode.trim()}
                className="button-base button-default flex-1"
              >
                Submit
              </Button>
              {onManualEntry && (
                <Button
                  onClick={onManualEntry}
                  variant="outline"
                  className="button-base button-outline"
                >
                  Manual Entry
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}