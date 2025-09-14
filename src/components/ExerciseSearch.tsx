import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Dumbbell,
  Target,
  Users,
  Zap,
  Heart,
  Play,
  CheckCircle,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react'
import { 
  searchExercises, 
  getAllMuscleGroups, 
  getAllEquipment, 
  getAllCategories,
  Exercise 
} from '../data/exerciseDatabase'
import { getExerciseHistory } from '../utils/guestStorage'

interface ExerciseSearchProps {
  onSelectExercise: (exerciseName: string) => void
  onClose: () => void
  isOpen: boolean
}

export default function ExerciseSearch({ onSelectExercise, onClose, isOpen }: ExerciseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Get filter options
  const muscleGroups = getAllMuscleGroups()
  const equipment = getAllEquipment()
  const categories = getAllCategories()
  const difficulties = ['beginner', 'intermediate', 'advanced']

  // Initial load and search
  useEffect(() => {
    if (isOpen) {
      // Show popular exercises on initial load
      if (!searchQuery.trim() && selectedMuscleGroups.length === 0 && selectedEquipment.length === 0) {
        const popularExercises = searchExercises('').slice(0, 20) // Show first 20 exercises
        setSearchResults(popularExercises)
      } else {
        performSearch()
      }
    }
  }, [searchQuery, selectedMuscleGroups, selectedEquipment, selectedDifficulty, selectedCategories, isOpen])

  const performSearch = () => {
    const results = searchExercises(
      searchQuery,
      selectedMuscleGroups.length > 0 ? selectedMuscleGroups : undefined,
      selectedEquipment.length > 0 ? selectedEquipment : undefined,
      selectedDifficulty.length > 0 ? selectedDifficulty : undefined,
      selectedCategories.length > 0 ? selectedCategories : undefined
    )
    setSearchResults(results)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const toggleMuscleGroup = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(muscleGroup) 
        ? prev.filter(mg => mg !== muscleGroup)
        : [...prev, muscleGroup]
    )
  }

  const toggleEquipment = (eq: string) => {
    setSelectedEquipment(prev => 
      prev.includes(eq) 
        ? prev.filter(e => e !== eq)
        : [...prev, eq]
    )
  }

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearAllFilters = () => {
    setSelectedMuscleGroups([])
    setSelectedEquipment([])
    setSelectedDifficulty([])
    setSelectedCategories([])
    setSearchQuery('')
  }

  const activeFiltersCount = selectedMuscleGroups.length + selectedEquipment.length + selectedDifficulty.length + selectedCategories.length

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="w-3 h-3" />
      case 'cardio': return <Heart className="w-3 h-3" />
      case 'flexibility': return <Target className="w-3 h-3" />
      default: return <Zap className="w-3 h-3" />
    }
  }

  const handleExerciseSelect = (exercise: Exercise) => {
    onSelectExercise(exercise.name)
  }

  const handleShowDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setShowExerciseModal(true)
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

  if (!isOpen) return null

  return (
    <>
      {/* Main Exercise Search Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">Exercise Database</CardTitle>
                <CardDescription>Search from 100+ professional exercises</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-600 dark:text-slate-300"
                data-testid="button-close-exercise-search"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search exercises by name, muscle group, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                data-testid="input-search-exercises"
              />
            </form>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`${activeFiltersCount > 0 ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : ''}`}
                data-testid="button-toggle-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
                {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  data-testid="button-clear-filters"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                {/* Muscle Groups */}
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Muscle Groups</h4>
                  <div className="flex flex-wrap gap-2">
                    {muscleGroups.map(mg => (
                      <Button
                        key={mg}
                        variant={selectedMuscleGroups.includes(mg) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMuscleGroup(mg)}
                        className={`capitalize ${
                          selectedMuscleGroups.includes(mg) 
                            ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                        data-testid={`filter-muscle-${mg}`}
                      >
                        {mg}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Equipment</h4>
                  <div className="flex flex-wrap gap-2">
                    {equipment.map(eq => (
                      <Button
                        key={eq}
                        variant={selectedEquipment.includes(eq) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleEquipment(eq)}
                        className={`capitalize ${
                          selectedEquipment.includes(eq) 
                            ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                        data-testid={`filter-equipment-${eq}`}
                      >
                        {eq}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Difficulty & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Difficulty</h4>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map(diff => (
                        <Button
                          key={diff}
                          variant={selectedDifficulty.includes(diff) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDifficulty(diff)}
                          className={`capitalize ${
                            selectedDifficulty.includes(diff) 
                              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                          data-testid={`filter-difficulty-${diff}`}
                        >
                          {diff}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <Button
                          key={cat}
                          variant={selectedCategories.includes(cat) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCategory(cat)}
                          className={`capitalize ${
                            selectedCategories.includes(cat) 
                              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                          data-testid={`filter-category-${cat}`}
                        >
                          {getCategoryIcon(cat)}
                          <span className="ml-1">{cat}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-3 overflow-y-auto max-h-96">
            {/* Results */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map((exercise) => {
                  const history = getExerciseHistory(exercise.name)
                  return (
                    <Card 
                      key={exercise.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200 dark:border-slate-600"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                              {exercise.name}
                            </h3>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {exercise.muscle_groups.slice(0, 3).map(mg => (
                                <Badge 
                                  key={mg} 
                                  variant="secondary" 
                                  className="text-xs capitalize bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                >
                                  {mg}
                                </Badge>
                              ))}
                              {exercise.muscle_groups.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{exercise.muscle_groups.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={getDifficultyColor(exercise.difficulty)}>
                            {exercise.difficulty}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center">
                              {getCategoryIcon(exercise.category)}
                              <span className="ml-1 capitalize">{exercise.category}</span>
                            </span>
                            <span className="capitalize">
                              {exercise.equipment.join(', ')}
                            </span>
                          </div>
                        </div>

                        {/* Exercise History */}
                        {history && (
                          <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mb-3 gap-3">
                            <span className="flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Last: {history.lastWeight}lbs × {history.lastReps}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatLastWorkout(history.lastWorkoutDate!)}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleExerciseSelect(exercise)}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                            data-testid={`button-select-exercise-${exercise.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Select Exercise
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShowDetails(exercise)}
                            className="text-slate-600 dark:text-slate-300"
                            data-testid={`button-view-details-${exercise.id}`}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No exercises found</p>
                <p className="text-sm mt-1">
                  {searchQuery || activeFiltersCount > 0 
                    ? "Try adjusting your search or filters" 
                    : "Start typing to search exercises"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exercise Details Modal */}
      {showExerciseModal && selectedExercise && (
        <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedExercise.category)}
                {selectedExercise.name}
                <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                  {selectedExercise.difficulty}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Muscle Groups and Equipment */}
              <div className="flex flex-wrap gap-2">
                {selectedExercise.muscle_groups.map(mg => (
                  <Badge key={mg} variant="secondary" className="capitalize">
                    {mg}
                  </Badge>
                ))}
              </div>
              
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Equipment:</strong> {selectedExercise.equipment.join(', ')}
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Tips & Safety</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    handleExerciseSelect(selectedExercise)
                    setShowExerciseModal(false)
                  }}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  data-testid="button-select-exercise-from-modal"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Select This Exercise
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExerciseModal(false)}
                  data-testid="button-close-exercise-modal"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}