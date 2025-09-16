import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X, Zap, Clock, Target } from 'lucide-react'

interface WorkoutTemplate {
  id: string
  name: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  exercises: string[]
}

interface WorkoutTemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: WorkoutTemplate) => void
}

const sampleTemplates: WorkoutTemplate[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps focused workout',
    duration: '45-60 min',
    difficulty: 'intermediate',
    exercises: ['Bench Press', 'Overhead Press', 'Dips', 'Push-ups']
  },
  {
    id: 'pull-day',
    name: 'Pull Day', 
    description: 'Back and biceps focused workout',
    duration: '45-60 min',
    difficulty: 'intermediate',
    exercises: ['Pull-ups', 'Rows', 'Lat Pulldown', 'Bicep Curls']
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    description: 'Lower body strength and power',
    duration: '60-75 min',
    difficulty: 'advanced',
    exercises: ['Squats', 'Deadlifts', 'Lunges', 'Calf Raises']
  }
]

export default function WorkoutTemplateSelector({ 
  isOpen, 
  onClose, 
  onSelectTemplate 
}: WorkoutTemplateSelectorProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-success'
      case 'intermediate': return 'text-warning'
      case 'advanced': return 'text-error'
      default: return 'text-secondary'
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'badge-success'
      case 'intermediate': return 'badge-warning'
      case 'advanced': return 'badge-destructive'
      default: return 'badge-secondary'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-base max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="card-header">
          <div className="flex items-center justify-between">
            <DialogTitle className="card-title flex items-center gap-2">
              <Zap className="w-5 h-5 text-activity" />
              Choose Workout Template
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
        
        <div className="card-content">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sampleTemplates.map((template) => (
              <Card
                key={template.id}
                className="card-base cursor-pointer hover:shadow-md transition-all"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="card-header pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="card-title text-base">
                      {template.name}
                    </CardTitle>
                    <span className={`badge-base ${getDifficultyBadge(template.difficulty)} text-xs`}>
                      {template.difficulty}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="card-content">
                  <p className="text-secondary text-sm mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-tertiary mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {template.exercises.length} exercises
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-secondary">Exercises:</p>
                    <div className="text-xs text-tertiary">
                      {template.exercises.slice(0, 3).join(', ')}
                      {template.exercises.length > 3 && '...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              onClick={() => onSelectTemplate(sampleTemplates[0])}
              className="button-base button-default w-full"
            >
              Use Recommended Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}