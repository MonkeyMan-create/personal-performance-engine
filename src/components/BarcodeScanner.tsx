import React, { useState, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Camera, CameraOff, AlertCircle } from 'lucide-react'
import { useZxing } from 'react-zxing'
import { toast } from '../hooks/use-toast'

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onBarcodeScanned: (barcode: string) => void
  onManualEntry: () => void
}

export default function BarcodeScanner({ 
  isOpen, 
  onClose, 
  onBarcodeScanned, 
  onManualEntry 
}: BarcodeScannerProps) {
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const isScanningRef = useRef(false)
  const videoStreamRef = useRef<MediaStream | null>(null)

  // Camera barcode scanning with react-zxing
  const { ref: cameraRef } = useZxing({
    onDecodeResult: useCallback((result) => {
      const barcode = result.getText()
      if (barcode && !isScanningRef.current) {
        isScanningRef.current = true
        onBarcodeScanned(barcode)
        onClose()
        toast({
          title: 'Barcode detected!',
          description: `Scanning product: ${barcode}`
        })
      }
    }, [onBarcodeScanned, onClose]),
    onDecodeError: useCallback((error) => {
      // Silently handle decode errors - this is normal during scanning
      console.debug('Barcode decode error:', error)
    }, []),
    constraints: {
      video: {
        facingMode: 'environment', // Use back camera on mobile
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    },
    timeBetweenDecodingAttempts: 300
  })

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      // Opening - initialize camera
      initializeCamera()
    } else {
      // Closing - cleanup camera
      closeCameraScanner()
    }
  }

  const initializeCamera = async () => {
    setCameraError(null)
    setIsCameraReady(false)
    isScanningRef.current = false
    
    // Check for camera permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
      videoStreamRef.current = stream
      stream.getTracks().forEach(track => track.stop()) // Stop test stream
      
      // Give camera time to initialize
      setTimeout(() => {
        setIsCameraReady(true)
      }, 1000)
    } catch (error) {
      console.error('Camera access error:', error)
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera access denied. Please allow camera access and try again.')
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device.')
        } else {
          setCameraError('Unable to access camera. Please check your device settings.')
        }
      } else {
        setCameraError('Unable to access camera.')
      }
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. You can still enter barcodes manually.',
        variant: 'destructive'
      })
    }
  }

  const closeCameraScanner = () => {
    // Clean up camera stream
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      videoStreamRef.current = null
    }
    
    // Reset scanning state
    isScanningRef.current = false
    setIsCameraReady(false)
    setCameraError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-md mx-auto sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Scan Barcode
          </DialogTitle>
          <DialogDescription>
            Point your camera at a barcode to scan the product
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {cameraError ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Camera Error</span>
              </div>
              <p className="text-red-600 dark:text-red-300 mt-1 text-sm">
                {cameraError}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onManualEntry}
                className="mt-3"
                data-testid="button-manual-entry"
              >
                Enter barcode manually instead
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  ref={cameraRef as React.RefObject<HTMLVideoElement>}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  webkit-playsinline="true"
                  data-testid="video-scanner"
                />
                
                {/* Scanning overlay - responsive for mobile */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white rounded-lg w-48 h-16 sm:w-64 sm:h-24 relative">
                    <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-emerald-400"></div>
                    
                    {/* Scanning line animation */}
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-emerald-400 opacity-80 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Loading indicator */}
                {!isCameraReady && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <CameraOff className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm">Initializing camera...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-3">
                Position the barcode within the frame to scan
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={closeCameraScanner}
              className="flex-1"
              data-testid="button-close-scanner"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                closeCameraScanner()
                onManualEntry()
              }}
              className="flex-1"
              data-testid="button-manual-barcode"
            >
              Enter manually
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}