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
  TrendingUp,
  PlayCircle,
  Image as ImageIcon
} from 'lucide-react'
// Dynamic import type for the exercise database module
interface ExerciseDatabase {
  searchExercises: (
    query: string,
    muscleGroups?: string[],
    equipment?: string[],
    difficulty?: string[],
    categories?: string[]
  ) => Exercise[]
  getAllMuscleGroups: () => string[]
  getAllEquipment: () => string[]
  getAllCategories: () => string[]
  Exercise: any
}

// Type imports only (no runtime cost)
import type { Exercise } from '../data/exerciseDatabase'
import { getExerciseHistory } from '../utils/guestStorage'
import { ExerciseThumbnail, ExerciseHero } from './ExerciseImage'
import { VideoThumbnail, VideoPlayer } from './ExerciseVideo'

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

  // Database loading state
  const [exerciseDb, setExerciseDb] = useState<ExerciseDatabase | null>(null)
  const [isDbLoading, setIsDbLoading] = useState(false)

  // Lazy load exercise database when component mounts
  useEffect(() => {
    let isCancelled = false
    
    const loadExerciseDatabase = async () => {
      if (exerciseDb || isDbLoading) return
      
      setIsDbLoading(true)
      try {
        const module = await import('../data/exerciseDatabase')
        if (!isCancelled) {
          setExerciseDb(module)
        }
      } catch {
        // Silently handle database loading errors
      } finally {
        if (!isCancelled) {
          setIsDbLoading(false)
        }
      }
    }

    if (isOpen) {
      loadExerciseDatabase()
    }

    return () => {
      isCancelled = true
    }
  }, [isOpen, exerciseDb, isDbLoading])

  // Get filter options (only when database is loaded)
  const muscleGroups = exerciseDb?.getAllMuscleGroups() || []
  const equipment = exerciseDb?.getAllEquipment() || []
  const categories = exerciseDb?.getAllCategories() || []
  const difficulties = ['beginner', 'intermediate', 'advanced']

  // Initial load and search
  useEffect(() => {
    if (isOpen && exerciseDb) {
      // Show popular exercises on initial load
      if (!searchQuery.trim() && selectedMuscleGroups.length === 0 && selectedEquipment.length === 0) {
        const popularExercises = exerciseDb.searchExercises('').slice(0, 20) // Show first 20 exercises
        setSearchResults(popularExercises)
      } else {
        performSearch()
      }
    }
  }, [searchQuery, selectedMuscleGroups, selectedEquipment, selectedDifficulty, selectedCategories, isOpen, exerciseDb])

  const performSearch = () => {
    if (!exerciseDb) return
    
    const results = exerciseDb.searchExercises(
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
      case 'beginner': 
        return 'bg-[var(--color-difficulty-beginner)] text-[var(--color-text-on-difficulty-beginner)]'
      case 'intermediate': 
        return 'bg-[var(--color-difficulty-intermediate)] text-[var(--color-text-on-difficulty-intermediate)]'
      case 'advanced': 
        return 'bg-[var(--color-difficulty-advanced)] text-[var(--color-text-on-difficulty-advanced)]'
      default: 
        return 'bg-[var(--color-text-secondary)] text-white'
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
        <Card className="w-full max-w-4xl max-h-[90vh] bg-[var(--color-background)] border-[var(--color-border)]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[var(--color-text-primary)]">Exercise Database</CardTitle>
                <CardDescription>Search from 100+ professional exercises</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-secondary"
                data-testid="button-close-exercise-search"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-tertiary" />
              <Input
                placeholder="Search exercises by name, muscle group, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--color-surface)] border-[var(--color-border)]"
                data-testid="input-search-exercises"
              />
            </form>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`${activeFiltersCount > 0 ? 'border-primary text-primary dark:text-primary' : ''}`}
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
                  className="text-slate-500 hover:text-slate-700 dark:text-tertiary dark:hover:text-slate-200"
                  data-testid="button-clear-filters"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="space-y-4 p-4 bg-[var(--color-surface)]/50 rounded-lg">
                {/* Muscle Groups */}
                <div>
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Muscle Groups</h4>
                  <div className="flex flex-wrap gap-2">
                    {muscleGroups.map(mg => (
                      <Button
                        key={mg}
                        variant={selectedMuscleGroups.includes(mg) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMuscleGroup(mg)}
                        className={`capitalize ${
                          selectedMuscleGroups.includes(mg) 
                            ? 'bg-primary hover:bg-primary/90 text-white' 
                            : 'text-secondary'
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
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Equipment</h4>
                  <div className="flex flex-wrap gap-2">
                    {equipment.map(eq => (
                      <Button
                        key={eq}
                        variant={selectedEquipment.includes(eq) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleEquipment(eq)}
                        className={`capitalize ${
                          selectedEquipment.includes(eq) 
                            ? 'bg-primary hover:bg-primary/90 text-white' 
                            : 'text-secondary'
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
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Difficulty</h4>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map(diff => (
                        <Button
                          key={diff}
                          variant={selectedDifficulty.includes(diff) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDifficulty(diff)}
                          className={`capitalize ${
                            selectedDifficulty.includes(diff) 
                              ? 'bg-primary hover:bg-primary/90 text-white' 
                              : 'text-secondary'
                          }`}
                          data-testid={`filter-difficulty-${diff}`}
                        >
                          {diff}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <Button
                          key={cat}
                          variant={selectedCategories.includes(cat) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleCategory(cat)}
                          className={`capitalize ${
                            selectedCategories.includes(cat) 
                              ? 'bg-primary hover:bg-primary/90 text-white' 
                              : 'text-secondary'
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
            {/* Loading State */}
            {isDbLoading && (
              <div className="text-center py-8 text-slate-500 dark:text-tertiary">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-lg font-medium">Loading exercise database...</p>
                <p className="text-sm mt-1">This will only happen once</p>
              </div>
            )}
            
            {/* Results */}
            {!isDbLoading && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map((exercise) => {
                  const history = getExerciseHistory(exercise.name)
                  return (
                    <Card 
                      key={exercise.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer border-[var(--color-border)]"
                      onClick={() => handleShowDetails(exercise)}>
                      <CardContent className="p-4">
                        <div className="flex gap-3 mb-3">
                          {/* Exercise Thumbnail */}
                          <div className="flex-shrink-0">
                            {exercise.video_url ? (
                              <VideoThumbnail
                                src={exercise.video_url}
                                poster={exercise.image_url}
                                exerciseName={exercise.name}
                                onVideoClick={() => handleShowDetails(exercise)}
                                className="border-2 border-[var(--color-border)]"
                              />
                            ) : (
                              <ExerciseThumbnail
                                src={exercise.image_url}
                                alt={`${exercise.name} demonstration`}
                                exerciseName={exercise.name}
                                onImageClick={() => handleShowDetails(exercise)}
                                className="border-2 border-[var(--color-border)]"
                              />
                            )}
                          </div>
                          
                          {/* Exercise Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-[var(--color-text-primary)] mb-1 truncate">
                                {exercise.name}
                              </h3>
                              <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                                {exercise.difficulty}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {exercise.muscle_groups.slice(0, 2).map(mg => (
                                <Badge 
                                  key={mg} 
                                  variant="secondary" 
                                  className="text-xs capitalize bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                                >
                                  {mg}
                                </Badge>
                              ))}
                              {exercise.muscle_groups.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{exercise.muscle_groups.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-tertiary mb-3">
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
                          <div className="flex items-center text-xs text-slate-600 dark:text-tertiary mb-3 gap-3">
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
                            className="flex-1 bg-primary hover:bg-primary/90 text-white"
                            data-testid={`button-select-exercise-${exercise.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Select Exercise
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleShowDetails(exercise)}
                            className="text-secondary"
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
            ) : !isDbLoading && (
              <div className="text-center py-8 text-slate-500 dark:text-tertiary">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No exercises found</p>
                <p className="text-sm mt-1">
                  {!exerciseDb 
                    ? "Loading exercise database..." 
                    : searchQuery || activeFiltersCount > 0 
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
            
            <div className="space-y-6">
              {/* Exercise Visual Content */}
              {(selectedExercise.image_url || selectedExercise.video_url) && (
                <div className="space-y-4">
                  {selectedExercise.video_url && (
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-primary" />
                        Exercise Demonstration
                      </h3>
                      <VideoPlayer
                        src={selectedExercise.video_url}
                        poster={selectedExercise.image_url}
                        exerciseName={selectedExercise.name}
                        controls
                        className="rounded-lg overflow-hidden"
                      />
                    </div>
                  )}
                  
                  {selectedExercise.image_url && !selectedExercise.video_url && (
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Exercise Reference
                      </h3>
                      <ExerciseHero
                        src={selectedExercise.image_url}
                        alt={`${selectedExercise.name} demonstration`}
                        exerciseName={selectedExercise.name}
                        className="rounded-lg overflow-hidden"
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Muscle Groups and Equipment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Target Muscles</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.muscle_groups.map(mg => (
                      <Badge key={mg} variant="secondary" className="capitalize">
                        {mg}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Equipment Needed</h4>
                  <div className="text-sm text-slate-600 dark:text-tertiary">
                    {selectedExercise.equipment.join(', ')}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">Step-by-Step Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index} className="leading-relaxed">{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">Tips & Safety</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="leading-relaxed">{tip}</li>
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
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
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