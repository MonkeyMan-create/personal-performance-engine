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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white" data-testid="page-title">Export Your Data</h1>
          <p className="text-slate-300 mt-2">Download your fitness data in standard formats</p>
        </div>

        {/* Important Notice */}
        <Card className="bg-amber-50/10 dark:bg-amber-900/20 border-amber-200/30 dark:border-amber-800/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-200 mb-1">
                  Data Portability Rights
                </h3>
                <p className="text-sm text-amber-300">
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
                className={`bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-primary/50 border-primary/50' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-700/50 rounded-xl">
                        <IconComponent className="w-6 h-6 text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {option.name}
                          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                            {option.format}
                          </span>
                        </CardTitle>
                        <CardDescription className="text-slate-300 mt-1">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSelection(option.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-primary border-primary' 
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                        data-testid={`checkbox-${option.id}`}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Includes:</h4>
                      <ul className="space-y-1">
                        {option.dataTypes.map((dataType, index) => (
                          <li key={index} className="text-sm text-slate-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {dataType}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Format:</span>
                        <span className="text-slate-400">{option.format}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Est. Size:</span>
                        <span className="text-slate-400">{option.estimated_size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleExportData(option.id)}
                    disabled={isCurrentlyExporting || isExporting === 'bulk'}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-primary/50 hover:border-primary"
                    data-testid={`button-export-${option.id}`}
                  >
                    {isCurrentlyExporting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Bulk Export
            </CardTitle>
            <CardDescription className="text-slate-300">
              Export multiple data types in a single download
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedOptions.map((optionId) => {
                const option = exportOptions.find(opt => opt.id === optionId)
                return (
                  <span 
                    key={optionId}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30"
                  >
                    {option?.name}
                  </span>
                )
              })}
            </div>
            
            <Button
              onClick={handleBulkExport}
              disabled={selectedOptions.length === 0 || isExporting !== null}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold h-12 rounded-xl shadow-xl shadow-purple-500/25"
              data-testid="button-bulk-export"
            >
              {isExporting === 'bulk' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Preparing Export...
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected Data ({selectedOptions.length})
                </>
              )}
            </Button>
            
            <p className="text-xs text-slate-500 text-center">
              Bulk exports are packaged as ZIP files containing all selected data types
            </p>
          </CardContent>
        </Card>

        {/* Data Rights & Information */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              Your Data Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-white">What You Can Export:</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    All personal fitness data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Account information & preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Custom workouts & templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Progress photos & measurements
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-white">Export Formats:</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><strong>JSON:</strong> Machine-readable, import to other apps</li>
                  <li><strong>CSV:</strong> Spreadsheet-compatible format</li>
                  <li><strong>Images:</strong> Original quality progress photos</li>
                  <li><strong>ZIP:</strong> Compressed bulk downloads</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">
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