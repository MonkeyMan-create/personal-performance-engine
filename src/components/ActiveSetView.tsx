import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ArrowLeft, Dumbbell, Plus, Minus } from 'lucide-react'

interface ActiveSetViewProps {
  exerciseName: string
  onFinishExercise: () => void
  onBackToSelection: () => void
}

export default function ActiveSetView({ 
  exerciseName, 
  onFinishExercise, 
  onBackToSelection 
}: ActiveSetViewProps) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [rir, setRir] = useState('2')

  const handleLogSet = () => {
    // Minimal set logging functionality
    console.log('Set logged:', { exerciseName, weight, reps, rir })
    // Reset form
    setWeight('')
    setReps('')
    setRir('2')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center p-4">
      <Card className="card-base w-full max-w-md">
        <CardHeader className="card-header">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToSelection}
              className="button-ghost"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="card-title flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-activity" />
              {exerciseName}
            </CardTitle>
            <div className="w-8" />
          </div>
        </CardHeader>
        
        <CardContent className="card-content space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary mb-2">Log Your Set</h3>
            <p className="text-secondary text-sm">Enter your workout details below</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">
                Weight (lbs)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-base"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">
                Reps
              </label>
              <Input
                type="number"
                placeholder="0"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="input-base"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">
                RIR (Reps in Reserve)
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRir(Math.max(0, parseInt(rir) - 1).toString())}
                  className="button-outline"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={rir}
                  onChange={(e) => setRir(e.target.value)}
                  className="input-base text-center"
                  min="0"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRir(Math.min(10, parseInt(rir) + 1).toString())}
                  className="button-outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleLogSet}
              disabled={!weight || !reps}
              className="button-base button-default flex-1"
            >
              Log Set ✓
            </Button>
            <Button
              onClick={onFinishExercise}
              variant="outline"
              className="button-base button-outline"
            >
              Finish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}