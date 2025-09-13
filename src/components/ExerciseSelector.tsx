import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Plus, Search, Clock, TrendingUp } from 'lucide-react'
import { getUniqueExerciseNames, getExerciseHistory } from '../utils/guestStorage'

interface ExerciseSelectorProps {
  onSelectExercise: (exerciseName: string) => void
  onClose: () => void
}

export default function ExerciseSelector({ onSelectExercise, onClose }: ExerciseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [newExerciseName, setNewExerciseName] = useState('')
  const [showAddNew, setShowAddNew] = useState(false)

  const exerciseNames = getUniqueExerciseNames()
  
  // Filter exercises based on search query
  const filteredExercises = exerciseNames.filter(exercise =>
    exercise.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectExercise = (exerciseName: string) => {
    onSelectExercise(exerciseName)
  }

  const handleAddNewExercise = () => {
    if (newExerciseName.trim()) {
      onSelectExercise(newExerciseName.trim())
    }
  }

  const formatLastWorkout = (date: string) => {
    const workoutDate = new Date(date)
    const today = new Date()
    const diffTime = today.getTime() - workoutDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    return workoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-white">Select Exercise</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-600 dark:text-slate-300"
              data-testid="button-close-exercise-selector"
            >
              ×
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
              data-testid="input-search-exercise"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3 overflow-y-auto max-h-96">
          {/* Add New Exercise Button */}
          {!showAddNew ? (
            <Button
              onClick={() => setShowAddNew(true)}
              variant="outline"
              className="w-full justify-start border-dashed border-2 border-cyan-400/50 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
              data-testid="button-show-add-exercise"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Exercise
            </Button>
          ) : (
            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border-2 border-cyan-400/50">
              <Input
                placeholder="Enter exercise name (e.g., Bench Press)"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                className="bg-white dark:bg-slate-800"
                autoFocus
                data-testid="input-new-exercise-name"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddNewExercise}
                  disabled={!newExerciseName.trim()}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  data-testid="button-add-new-exercise"
                >
                  Add Exercise
                </Button>
                <Button
                  onClick={() => {
                    setShowAddNew(false)
                    setNewExerciseName('')
                  }}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-cancel-add-exercise"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Previous Exercises */}
          {filteredExercises.length > 0 ? (
            <div className="space-y-2">
              {filteredExercises.map((exerciseName) => {
                const history = getExerciseHistory(exerciseName)
                return (
                  <Button
                    key={exerciseName}
                    onClick={() => handleSelectExercise(exerciseName)}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 text-left bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-600"
                    data-testid={`button-select-exercise-${exerciseName.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white mb-1">
                        {exerciseName}
                      </div>
                      {history && (
                        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 space-x-3">
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {history.lastWeight}lbs × {history.lastReps}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatLastWorkout(history.lastWorkoutDate!)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No exercises found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : exerciseNames.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No previous exercises</p>
              <p className="text-xs mt-1">Add your first exercise to get started</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}