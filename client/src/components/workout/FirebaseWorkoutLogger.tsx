import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Play, Square, Trash2, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  createWorkout, 
  updateWorkout, 
  createWorkoutSet, 
  updateWorkoutSet, 
  deleteWorkoutSet,
  getWorkouts,
  getWorkoutSets,
  type Workout, 
  type WorkoutSet 
} from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";

interface WorkoutData {
  exerciseName: string;
  sets: Array<{ weight: number; reps: number; rir: number }>;
  previousPerformance?: Array<{ weight: number; reps: number; date: string }>;
}

export function FirebaseWorkoutLogger() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  // State
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  
  // Form state for new sets
  const [newSetData, setNewSetData] = useState({
    exerciseName: "",
    weight: "",
    reps: "",
    rir: "",
    setType: "work" as const,
    notes: ""
  });

  // Load active workout on component mount
  useEffect(() => {
    if (userProfile) {
      loadActiveWorkout();
    }
  }, [userProfile]);

  const loadActiveWorkout = async () => {
    if (!userProfile) return;
    
    try {
      const workouts = await getWorkouts(userProfile.uid);
      const activeWorkout = workouts.find(w => !w.isCompleted);
      
      if (activeWorkout) {
        setCurrentWorkout(activeWorkout);
        setWorkoutStartTime(activeWorkout.startTime);
        setIsTimerRunning(true);
        
        // Load sets for this workout
        const sets = await getWorkoutSets(activeWorkout.id);
        setWorkoutSets(sets);
      }
    } catch (error) {
      console.error('Error loading active workout:', error);
      toast({
        title: "Error",
        description: "Failed to load active workout",
        variant: "destructive"
      });
    }
  };

  const startWorkout = async () => {
    if (!userProfile) return;
    
    try {
      const startTime = new Date();
      const workoutId = await createWorkout({
        userId: userProfile.uid,
        name: `Workout - ${startTime.toLocaleDateString()}`,
        startTime,
        isCompleted: false
      });
      
      const newWorkout: Workout = {
        id: workoutId,
        userId: userProfile.uid,
        name: `Workout - ${startTime.toLocaleDateString()}`,
        startTime,
        isCompleted: false,
        createdAt: startTime
      };
      
      setCurrentWorkout(newWorkout);
      setWorkoutStartTime(startTime);
      setIsTimerRunning(true);
      setWorkoutSets([]);
      
      toast({
        title: "Workout Started",
        description: "Your workout session has begun!"
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Error",
        description: "Failed to start workout",
        variant: "destructive"
      });
    }
  };

  const endWorkout = async () => {
    if (!currentWorkout) return;
    
    try {
      const endTime = new Date();
      await updateWorkout(currentWorkout.id, {
        endTime,
        isCompleted: true
      });
      
      setCurrentWorkout(null);
      setWorkoutSets([]);
      setIsTimerRunning(false);
      setWorkoutStartTime(null);
      
      // Get AI analysis if there are sets
      if (workoutSets.length > 0) {
        await getWorkoutAnalysis();
      }
      
      toast({
        title: "Workout Completed",
        description: "Great job! Your workout has been saved."
      });
    } catch (error) {
      console.error('Error ending workout:', error);
      toast({
        title: "Error",
        description: "Failed to end workout",
        variant: "destructive"
      });
    }
  };

  const addSet = async () => {
    if (!currentWorkout || !newSetData.exerciseName) return;
    
    try {
      const setNumber = workoutSets.filter(s => s.exerciseName === newSetData.exerciseName).length + 1;
      
      const setId = await createWorkoutSet({
        workoutId: currentWorkout.id,
        exerciseName: newSetData.exerciseName,
        setNumber,
        weight: newSetData.weight ? parseFloat(newSetData.weight) : undefined,
        reps: newSetData.reps ? parseInt(newSetData.reps) : undefined,
        rir: newSetData.rir ? parseInt(newSetData.rir) : undefined,
        setType: newSetData.setType,
        notes: newSetData.notes || undefined,
        isCompleted: true
      });
      
      const newSet: WorkoutSet = {
        id: setId,
        workoutId: currentWorkout.id,
        exerciseName: newSetData.exerciseName,
        setNumber,
        weight: newSetData.weight ? parseFloat(newSetData.weight) : undefined,
        reps: newSetData.reps ? parseInt(newSetData.reps) : undefined,
        rir: newSetData.rir ? parseInt(newSetData.rir) : undefined,
        setType: newSetData.setType,
        notes: newSetData.notes || undefined,
        isCompleted: true,
        createdAt: new Date()
      };
      
      setWorkoutSets([...workoutSets, newSet]);
      
      // Reset form
      setNewSetData({
        exerciseName: newSetData.exerciseName, // Keep exercise name
        weight: "",
        reps: "",
        rir: "",
        setType: "work",
        notes: ""
      });
      
      toast({
        title: "Set Added",
        description: `${newSetData.exerciseName} set logged successfully`
      });
    } catch (error) {
      console.error('Error adding set:', error);
      toast({
        title: "Error",
        description: "Failed to add set",
        variant: "destructive"
      });
    }
  };

  const deleteSet = async (setId: string) => {
    try {
      await deleteWorkoutSet(setId);
      setWorkoutSets(workoutSets.filter(s => s.id !== setId));
      
      toast({
        title: "Set Deleted",
        description: "Set removed from workout"
      });
    } catch (error) {
      console.error('Error deleting set:', error);
      toast({
        title: "Error",
        description: "Failed to delete set",
        variant: "destructive"
      });
    }
  };

  const getWorkoutAnalysis = async () => {
    if (workoutSets.length === 0) return;
    
    try {
      // Group sets by exercise
      const exerciseGroups = workoutSets.reduce((acc, set) => {
        if (!acc[set.exerciseName]) {
          acc[set.exerciseName] = [];
        }
        acc[set.exerciseName].push({
          weight: set.weight || 0,
          reps: set.reps || 0,
          rir: set.rir || 0
        });
        return acc;
      }, {} as Record<string, Array<{ weight: number; reps: number; rir: number }>>);
      
      // Get analysis for the first exercise (you could loop through all)
      const firstExercise = Object.keys(exerciseGroups)[0];
      if (!firstExercise) return;
      
      const workoutData: WorkoutData = {
        exerciseName: firstExercise,
        sets: exerciseGroups[firstExercise]
      };
      
      // Call Vercel serverless function
      const response = await fetch('/api/generateWorkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workoutData })
      });
      
      if (response.ok) {
        const analysis = await response.json();
        
        toast({
          title: "AI Analysis Ready",
          description: `${analysis.formFeedback.slice(0, 100)}...`,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error getting workout analysis:', error);
    }
  };

  const formatElapsedTime = () => {
    if (!workoutStartTime) return "00:00";
    
    const elapsed = Math.floor((Date.now() - workoutStartTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Group sets by exercise for display
  const exerciseGroups = workoutSets.reduce((acc, set) => {
    if (!acc[set.exerciseName]) {
      acc[set.exerciseName] = [];
    }
    acc[set.exerciseName].push(set);
    return acc;
  }, {} as Record<string, WorkoutSet[]>);

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Workout Logger</span>
            {isTimerRunning && (
              <div className="text-sm font-mono bg-green-100 dark:bg-green-900 px-3 py-1 rounded">
                {formatElapsedTime()}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!currentWorkout ? (
            <Button onClick={startWorkout} className="w-full" data-testid="button-start-workout">
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Started: {workoutStartTime?.toLocaleTimeString()}
              </div>
              <Button onClick={endWorkout} variant="destructive" className="w-full" data-testid="button-end-workout">
                <Square className="w-4 h-4 mr-2" />
                End Workout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Set Form */}
      {currentWorkout && (
        <Card>
          <CardHeader>
            <CardTitle>Add Set</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exercise">Exercise</Label>
                <Input
                  id="exercise"
                  value={newSetData.exerciseName}
                  onChange={(e) => setNewSetData({ ...newSetData, exerciseName: e.target.value })}
                  placeholder="e.g., Bench Press"
                  data-testid="input-exercise-name"
                />
              </div>
              <div>
                <Label htmlFor="setType">Set Type</Label>
                <Select value={newSetData.setType} onValueChange={(value: "work" | "warm" | "drop" | "failure") => setNewSetData({ ...newSetData, setType: value })}>
                  <SelectTrigger data-testid="select-set-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work Set</SelectItem>
                    <SelectItem value="warm">Warm-up</SelectItem>
                    <SelectItem value="drop">Drop Set</SelectItem>
                    <SelectItem value="failure">To Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={newSetData.weight}
                  onChange={(e) => setNewSetData({ ...newSetData, weight: e.target.value })}
                  placeholder="0"
                  data-testid="input-weight"
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={newSetData.reps}
                  onChange={(e) => setNewSetData({ ...newSetData, reps: e.target.value })}
                  placeholder="0"
                  data-testid="input-reps"
                />
              </div>
              <div>
                <Label htmlFor="rir">RIR</Label>
                <Input
                  id="rir"
                  type="number"
                  value={newSetData.rir}
                  onChange={(e) => setNewSetData({ ...newSetData, rir: e.target.value })}
                  placeholder="0"
                  data-testid="input-rir"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={newSetData.notes}
                onChange={(e) => setNewSetData({ ...newSetData, notes: e.target.value })}
                placeholder="Form notes, how it felt, etc."
                data-testid="textarea-notes"
              />
            </div>

            <Button onClick={addSet} className="w-full" data-testid="button-add-set">
              <Plus className="w-4 h-4 mr-2" />
              Add Set
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Workout Sets */}
      {currentWorkout && Object.keys(exerciseGroups).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(exerciseGroups).map(([exerciseName, sets]) => (
                <div key={exerciseName} className="space-y-2">
                  <h4 className="font-semibold text-lg">{exerciseName}</h4>
                  <div className="space-y-2">
                    {sets.map((set, index) => (
                      <div 
                        key={set.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        data-testid={`set-${exerciseName}-${index}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                            Set {set.setNumber}
                          </span>
                          <span className="text-sm">
                            {set.weight}kg × {set.reps} reps
                          </span>
                          {set.rir !== undefined && (
                            <span className="text-sm text-blue-600 dark:text-blue-400">
                              RIR: {set.rir}
                            </span>
                          )}
                          {set.setType !== "work" && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                              {set.setType}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSet(set.id)}
                          data-testid={`button-delete-set-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Button */}
      {currentWorkout && workoutSets.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={getWorkoutAnalysis} className="w-full" variant="outline" data-testid="button-ai-analysis">
              <TrendingUp className="w-4 h-4 mr-2" />
              Get AI Workout Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}