import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Zap, 
  Clock, 
  Target, 
  Users, 
  ChevronRight, 
  Dumbbell,
  Heart,
  Activity
} from 'lucide-react'
import { WorkoutTemplate, WORKOUT_TEMPLATES, convertTemplateToWorkoutForm } from '../utils/workoutTemplates'

interface WorkoutTemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (workoutForm: any) => void
}

export default function WorkoutTemplateSelector({ 
  isOpen, 
  onClose, 
  onSelectTemplate 
}: WorkoutTemplateSelectorProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const filteredTemplates = WORKOUT_TEMPLATES.filter(template => 
    selectedFilter === 'all' || template.difficulty === selectedFilter
  )

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    const workoutForm = convertTemplateToWorkoutForm(template)
    onSelectTemplate(workoutForm)
    onClose()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': 
        return 'bg-[var(--color-difficulty-beginner)] text-white'
      case 'intermediate': 
        return 'bg-[var(--color-difficulty-intermediate)] text-white'
      case 'advanced': 
        return 'bg-[var(--color-difficulty-advanced)] text-white'
      default: 
        return 'bg-[var(--color-text-secondary)] text-white'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="w-4 h-4" />
      case 'cardio': return <Heart className="w-4 h-4" />
      case 'hybrid': return <Activity className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[var(--color-background)]/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary dark:text-primary" />
            Choose Your Workout
          </DialogTitle>
          <DialogDescription className="text-[var(--color-text-secondary)]">
            Select a pre-designed workout template to get started quickly. You can customize any template after selection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter Tabs */}
          <Tabs value={selectedFilter} onValueChange={(value: any) => setSelectedFilter(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[var(--color-surface)]">
              <TabsTrigger value="all" className="data-[state=active]:bg-[var(--color-background)]">
                All Levels
              </TabsTrigger>
              <TabsTrigger value="beginner" className="data-[state=active]:bg-[var(--color-background)]">
                Beginner
              </TabsTrigger>
              <TabsTrigger value="intermediate" className="data-[state=active]:bg-[var(--color-background)]">
                Intermediate
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-[var(--color-background)]">
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedFilter} className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="bg-[var(--color-surface)]/70 border-[var(--color-border)]/50 backdrop-blur-xl hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => handleSelectTemplate(template)}
                    data-testid={`template-card-${template.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2 group-hover:text-primary transition-colors">
                            {getCategoryIcon(template.category)}
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-300 mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary dark:group-hover:text-primary transition-colors" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                          {template.category}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{template.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{template.exercises.length} exercises</span>
                          </div>
                        </div>

                        {/* Target Muscles */}
                        <div>
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Target Areas:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.targetMuscles.slice(0, 3).map((muscle, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded"
                              >
                                {muscle}
                              </span>
                            ))}
                            {template.targetMuscles.length > 3 && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                +{template.targetMuscles.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Exercise Preview */}
                        <div>
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Exercises:</p>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {template.exercises.slice(0, 2).map(exercise => exercise.name).join(', ')}
                            {template.exercises.length > 2 && ` +${template.exercises.length - 2} more`}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          className="w-full mt-3 bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] text-white border-2 border-primary/50 hover:border-primary hover:ring-4 hover:ring-primary/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectTemplate(template)
                          }}
                          data-testid={`button-select-${template.id}`}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Use This Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                    No templates found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Try selecting a different difficulty level.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Tips */}
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 border border-primary/20 dark:border-primary/30">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-primary/20 dark:bg-primary/30 rounded-lg flex-shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-primary mb-1">Pro Tips</h4>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>• Templates provide suggested weights and reps - adjust based on your fitness level</li>
                  <li>• RIR (Reps in Reserve) helps you train with proper intensity</li>
                  <li>• You can modify any template after selection to match your needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
            data-testid="button-close-template-selector"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}