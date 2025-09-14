import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthPrompt from '../components/AuthPrompt'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft, Download, FileText, Database, Calendar, Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { Link } from 'wouter'
import { useToast } from '../hooks/use-toast'

interface ExportOption {
  id: string
  name: string
  description: string
  icon: any
  dataTypes: string[]
  format: string
  estimated_size: string
}

const exportOptions: ExportOption[] = [
  {
    id: 'workout-data',
    name: 'Workout Data',
    description: 'All your exercise logs, sets, reps, and workout history',
    icon: Database,
    dataTypes: ['Exercise logs', 'Workout templates', 'Personal records', 'Training notes'],
    format: 'JSON/CSV',
    estimated_size: '~2-5 MB'
  },
  {
    id: 'nutrition-data',
    name: 'Nutrition Data',
    description: 'Food logs, calorie tracking, and nutrition goals',
    icon: FileText,
    dataTypes: ['Food diary entries', 'Calorie logs', 'Nutrition goals', 'Custom foods'],
    format: 'JSON/CSV',
    estimated_size: '~1-3 MB'
  },
  {
    id: 'progress-data',
    name: 'Progress Data',
    description: 'Body measurements, progress photos, and achievement data',
    icon: Calendar,
    dataTypes: ['Body measurements', 'Progress photos', 'Achievement milestones', 'Goal tracking'],
    format: 'JSON + Images',
    estimated_size: '~5-20 MB'
  }
]

export default function DataExportPage() {
  const { user, isGuestMode } = useAuth()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  if (!user && !isGuestMode) {
    return (
      <AuthPrompt 
        title="Export Your Data"
        description="Sign in to access and export your fitness data."
      />
    )
  }

  const handleExportData = async (optionId: string) => {
    setIsExporting(optionId)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast({
        title: "Export Complete!",
        description: `Your ${exportOptions.find(opt => opt.id === optionId)?.name} has been prepared for download.`
      })
      
      // In a real app, this would trigger a file download
      // For demo purposes, we'll just show a success message
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(null)
    }
  }

  const handleBulkExport = async () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "No Data Selected",
        description: "Please select at least one data type to export.",
        variant: "destructive"
      })
      return
    }

    setIsExporting('bulk')
    
    try {
      // Simulate bulk export process
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      toast({
        title: "Bulk Export Complete!",
        description: `${selectedOptions.length} data type(s) have been exported successfully.`
      })
      
      setSelectedOptions([])
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(null)
    }
  }

  const toggleSelection = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-2xl border border-[var(--color-action)]/20">
              <Download className="w-8 h-8 text-[var(--color-action)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]" data-testid="page-title">Export Your Data</h1>
          </div>
          <p className="text-[var(--color-text-secondary)] mt-2">Download your fitness data in standard formats</p>
        </div>

        {/* Important Notice */}
        <Card className="bg-gradient-to-br from-[var(--color-warning)]/15 to-[var(--color-warning)]/5 border-[var(--color-warning)]/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-[var(--color-warning)]/20 to-[var(--color-warning)]/10 rounded-lg border border-[var(--color-warning)]/20">
                <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-warning)] mb-1">
                  Data Portability Rights
                </h3>
                <p className="text-sm text-[var(--color-warning)]">
                  You have the right to export your personal data in a structured, machine-readable format. 
                  {isGuestMode && ' Guest mode data is stored locally on your device only.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="space-y-4">
          {exportOptions.map((option) => {
            const IconComponent = option.icon
            const isSelected = selectedOptions.includes(option.id)
            const isCurrentlyExporting = isExporting === option.id
            
            return (
              <Card 
                key={option.id}
                className={`bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-[var(--color-action)]/50 border-[var(--color-action)]/50 bg-gradient-to-br from-[var(--color-action)]/5 to-[var(--color-action)]/2' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/15 to-[var(--color-action)]/5 rounded-xl border border-[var(--color-action)]/20">
                        <IconComponent className="w-6 h-6 text-[var(--color-action)]" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[var(--color-text-primary)] flex items-center gap-2">
                          {option.name}
                          <span className="text-xs bg-[var(--color-surface)] text-[var(--color-text-secondary)] px-2 py-1 rounded">
                            {option.format}
                          </span>
                        </CardTitle>
                        <CardDescription className="text-[var(--color-text-secondary)] mt-1">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSelection(option.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-[var(--color-action)] border-[var(--color-action)]' 
                            : 'border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'
                        }`}
                        data-testid={`checkbox-${option.id}`}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4 text-[var(--color-action-text)]" />}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Includes:</h4>
                      <ul className="space-y-1">
                        {option.dataTypes.map((dataType, index) => (
                          <li key={index} className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[var(--color-action)] rounded-full"></div>
                            {dataType}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-secondary)]">Format:</span>
                        <span className="text-[var(--color-text-secondary)]">{option.format}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-secondary)]">Est. Size:</span>
                        <span className="text-[var(--color-text-secondary)]">{option.estimated_size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleExportData(option.id)}
                    disabled={isCurrentlyExporting || isExporting === 'bulk'}
                    className="w-full bg-gradient-to-r from-[var(--color-action)]/10 to-[var(--color-action)]/5 hover:from-[var(--color-action)]/20 hover:to-[var(--color-action)]/10 text-[var(--color-action)] border border-[var(--color-action)]/50 hover:border-[var(--color-action)] transition-all duration-300"
                    data-testid={`button-export-${option.id}`}
                  >
                    {isCurrentlyExporting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-[var(--color-text-primary)] border-t-transparent rounded-full animate-spin" />
                        Exporting...
                      </div>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export {option.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bulk Export */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-action)]/20 to-[var(--color-action)]/10 rounded-xl border border-[var(--color-action)]/20">
                <Database className="w-6 h-6 text-[var(--color-action)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Bulk Export</CardTitle>
                <CardDescription className="text-[var(--color-text-secondary)]">
                  Export multiple data types in a single download
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedOptions.map((optionId) => {
                const option = exportOptions.find(opt => opt.id === optionId)
                return (
                  <span 
                    key={optionId}
                    className="px-3 py-1 bg-[var(--color-action)]/20 text-[var(--color-action)] rounded-full text-sm border border-[var(--color-action)]/30"
                  >
                    {option?.name}
                  </span>
                )
              })}
            </div>
            
            <Button
              onClick={handleBulkExport}
              disabled={selectedOptions.length === 0 || isExporting !== null}
              className="w-full bg-gradient-to-r from-[var(--color-action)] to-[var(--color-action)]/90 hover:from-[var(--color-action)]/90 hover:to-[var(--color-action)]/80 text-[var(--color-action-text)] font-bold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-bulk-export"
            >
              {isExporting === 'bulk' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[var(--color-action-text)] border-t-transparent rounded-full animate-spin" />
                  Preparing Export...
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected Data ({selectedOptions.length})
                </>
              )}
            </Button>
            
            <p className="text-xs text-[var(--color-text-secondary)] text-center">
              Bulk exports are packaged as ZIP files containing all selected data types
            </p>
          </CardContent>
        </Card>

        {/* Data Rights & Information */}
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface)]/80 border-[var(--color-border)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--color-success)]/20 to-[var(--color-success)]/10 rounded-xl border border-[var(--color-success)]/20">
                <Shield className="w-6 h-6 text-[var(--color-success)]" />
              </div>
              <div>
                <CardTitle className="text-[var(--color-text-primary)] text-xl font-bold">Your Data Rights</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-[var(--color-text-primary)]">What You Can Export:</h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                    All personal fitness data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                    Account information & preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                    Custom workouts & templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                    Progress photos & measurements
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-[var(--color-text-primary)]">Export Formats:</h3>
                <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li><strong>JSON:</strong> Machine-readable, import to other apps</li>
                  <li><strong>CSV:</strong> Spreadsheet-compatible format</li>
                  <li><strong>Images:</strong> Original quality progress photos</li>
                  <li><strong>ZIP:</strong> Compressed bulk downloads</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-[var(--color-surface)]/60 rounded-lg border border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-secondary)]">
                <strong>Privacy Notice:</strong> Exported data contains your personal information. 
                Keep downloads secure and only share with trusted applications or services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}