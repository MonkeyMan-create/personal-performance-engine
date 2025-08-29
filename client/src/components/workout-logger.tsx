import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Info, Check, SkipForward } from "lucide-react";
import { LocalStorageService, WorkoutData, ExerciseData, SetData } from "@/lib/localStorage";
import { getExerciseById } from "@/lib/exercises";
import { toast } from "@/hooks/use-toast";

interface WorkoutLoggerProps {
  workoutId?: string;
}

export function WorkoutLogger({ workoutId }: WorkoutLoggerProps) {
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseNotes, setExerciseNotes] = useState("");

  useEffect(() => {
    if (workoutId) {
      const workouts = LocalStorageService.getWorkouts();
      const foundWorkout = workouts.find(w => w.id === workoutId);
      if (foundWorkout) {
        setWorkout(foundWorkout);
      }
    } else {
      const activeWorkout = LocalStorageService.getActiveWorkout();
      setWorkout(activeWorkout);
    }
  }, [workoutId]);

  const currentExercise = workout?.exercises[currentExerciseIndex];
  const exerciseDetails = currentExercise ? getExerciseById(currentExercise.exerciseId) : null;

  const addSet = () => {
    if (!workout || !currentExercise) return;

    const newSet: SetData = {
      id: Date.now().toString(),
      setNumber: currentExercise.sets.length + 1,
      weight: undefined,
      reps: undefined,
      rir: undefined,
      setType: 'work',
      isCompleted: false,
    };

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map((ex, index) =>
        index === currentExerciseIndex
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      ),
    };

    setWorkout(updatedWorkout);
    LocalStorageService.saveWorkout(updatedWorkout);
  };

  const updateSet = (setIndex: number, field: keyof SetData, value: any) => {
    if (!workout || !currentExercise) return;

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map((ex, exIndex) =>
        exIndex === currentExerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((set, setIdx) =>
                setIdx === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : ex
      ),
    };

    setWorkout(updatedWorkout);
    LocalStorageService.saveWorkout(updatedWorkout);
  };

  const finishExercise = () => {
    if (!workout || !currentExercise) return;

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map((ex, index) =>
        index === currentExerciseIndex
          ? { ...ex, notes: exerciseNotes }
          : ex
      ),
    };

    setWorkout(updatedWorkout);
    LocalStorageService.saveWorkout(updatedWorkout);

    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setExerciseNotes("");
      toast({
        title: "Exercise Complete!",
        description: `Moving to next exercise: ${workout.exercises[currentExerciseIndex + 1]?.exerciseName}`,
      });
    } else {
      // Workout complete
      const completedWorkout = { ...updatedWorkout, isCompleted: true, endTime: new Date() };
      LocalStorageService.saveWorkout(completedWorkout);
      toast({
        title: "Workout Complete! 🎉",
        description: "Great job finishing your workout!",
      });
    }
  };

  const skipExercise = () => {
    if (!workout) return;

    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setExerciseNotes("");
    } else {
      finishExercise();
    }
  };

  if (!workout || !currentExercise || !exerciseDetails) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No active workout found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border overflow-hidden">
      {/* Exercise Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {exerciseDetails.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {exerciseDetails.category.charAt(0).toUpperCase() + exerciseDetails.category.slice(1)} • {exerciseDetails.equipment}
            </p>
          </div>
          <Button variant="ghost" size="icon" data-testid="button-exercise-info">
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
        </div>
      </CardHeader>

      {/* Exercise Demonstration */}
      <div className="h-48 bg-muted flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          alt={`${exerciseDetails.name} demonstration`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Set Logging */}
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span>SET</span>
          <span>WEIGHT</span>
          <span>REPS</span>
          <span>RIR</span>
          <span>TYPE</span>
        </div>

        {currentExercise.sets.map((set, index) => (
          <div key={set.id} className="flex items-center justify-between space-x-2">
            <span className="w-8 text-center text-foreground font-medium">
              {set.setNumber}
            </span>
            <Input
              type="number"
              placeholder="0"
              value={set.weight || ""}
              onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || undefined)}
              className="w-16 h-12 text-center"
              data-testid={`input-weight-${index}`}
            />
            <Input
              type="number"
              placeholder="0"
              value={set.reps || ""}
              onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || undefined)}
              className="w-16 h-12 text-center"
              data-testid={`input-reps-${index}`}
            />
            <Select
              value={set.rir?.toString() || ""}
              onValueChange={(value) => updateSet(index, 'rir', parseInt(value))}
            >
              <SelectTrigger className="w-16 h-12 text-center" data-testid={`select-rir-${index}`}>
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={set.setType}
              onValueChange={(value) => updateSet(index, 'setType', value)}
            >
              <SelectTrigger className="w-20 h-12 text-xs" data-testid={`select-type-${index}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="drop">Drop</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}

        <Button
          onClick={addSet}
          variant="outline"
          className="w-full h-12 border-2 border-dashed"
          data-testid="button-add-set"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Set
        </Button>

        {/* Notes Section */}
        <div className="pt-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Exercise Notes
          </label>
          <Textarea
            placeholder="Add notes about form, difficulty, etc..."
            value={exerciseNotes}
            onChange={(e) => setExerciseNotes(e.target.value)}
            className="h-20 resize-none"
            data-testid="textarea-exercise-notes"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={finishExercise}
            className="flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90"
            data-testid="button-finish-exercise"
          >
            <Check className="h-4 w-4 mr-2" />
            Finish Exercise
          </Button>
          <Button
            onClick={skipExercise}
            variant="secondary"
            className="px-6 h-12"
            data-testid="button-skip-exercise"
          >
            <SkipForward className="h-4 w-4 mr-2" />
            SkipForward
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
