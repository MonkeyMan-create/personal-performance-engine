import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Clock, CheckCircle } from "lucide-react";
import { WorkoutLogger } from "@/components/workout-logger";
import { LocalStorageService, WorkoutData, ExerciseData } from "@/lib/localStorage";
import { DEFAULT_PPL_TEMPLATE } from "@/lib/exercises";
import { toast } from "@/hooks/use-toast";

export default function Workouts() {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutData | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutData[]>([]);
  const [showLogger, setShowLogger] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const active = LocalStorageService.getActiveWorkout();
    setActiveWorkout(active);
    
    const workouts = LocalStorageService.getWorkouts().slice(0, 5);
    setRecentWorkouts(workouts);

    if (active) {
      setShowLogger(true);
    }
  };

  const startWorkout = (type: 'push' | 'pull' | 'legs') => {
    const user = LocalStorageService.getUser();
    const template = DEFAULT_PPL_TEMPLATE[type];
    
    const exercises: ExerciseData[] = template.map((exercise, index) => ({
      id: (Date.now() + index).toString(),
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.name,
      sets: [],
      notes: "",
    }));

    const workout: WorkoutData = {
      id: Date.now().toString(),
      userId: user?.id || 'demo-user',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Day`,
      startTime: new Date(),
      isCompleted: false,
      exercises,
    };

    LocalStorageService.saveWorkout(workout);
    setActiveWorkout(workout);
    setShowLogger(true);
    
    toast({
      title: "Workout Started! 💪",
      description: `${workout.name} workout has begun. Let's crush it!`,
    });
  };

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const duration = endTime.getTime() - start.getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  if (showLogger && activeWorkout) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Active Workout</h1>
          <Button
            variant="outline"
            onClick={() => setShowLogger(false)}
            data-testid="button-close-logger"
          >
            Back to Overview
          </Button>
        </div>
        <WorkoutLogger workoutId={activeWorkout.id} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Workouts</h1>
        <Button variant="outline" size="icon" data-testid="button-custom-workout">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="quick-start" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick-start" data-testid="tab-quick-start">Quick Start</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-start" className="space-y-4">
          {/* Active Workout */}
          {activeWorkout && (
            <Card className="gradient-bg text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{activeWorkout.name}</h3>
                  <Badge className="bg-white/20 text-white border-white/20">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(activeWorkout.startTime)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">
                      {activeWorkout.exercises.length} exercises
                    </p>
                    <p className="text-sm opacity-75">
                      Started {activeWorkout.startTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowLogger(true)}
                    className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-white/90"
                    data-testid="button-continue-active-workout"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PPL Quick Start */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Push/Pull/Legs Program</h3>
            
            <div className="grid gap-4">
              <Card className="bg-card border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center justify-between">
                    Push Day
                    <Badge variant="secondary">Chest, Shoulders, Triceps</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>• Bench Press (4 sets)</p>
                    <p>• Incline Dumbbell Press (3 sets)</p>
                    <p>• Overhead Press (3 sets)</p>
                    <p>• Lateral Raises (4 sets)</p>
                  </div>
                  <Button
                    onClick={() => startWorkout('push')}
                    disabled={!!activeWorkout}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-start-push"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Push Day
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center justify-between">
                    Pull Day
                    <Badge variant="secondary">Back, Biceps</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>• Deadlift (3 sets)</p>
                    <p>• Pull-ups (4 sets)</p>
                    <p>• Bent-Over Rows (4 sets)</p>
                    <p>• Face Pulls (3 sets)</p>
                  </div>
                  <Button
                    onClick={() => startWorkout('pull')}
                    disabled={!!activeWorkout}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-start-pull"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Pull Day
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center justify-between">
                    Leg Day
                    <Badge variant="secondary">Quads, Glutes, Hamstrings</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>• Squats (4 sets)</p>
                    <p>• Romanian Deadlift (3 sets)</p>
                    <p>• Leg Press (3 sets)</p>
                  </div>
                  <Button
                    onClick={() => startWorkout('legs')}
                    disabled={!!activeWorkout}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    data-testid="button-start-legs"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Leg Day
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Workouts</h3>
          
          {recentWorkouts.length === 0 ? (
            <Card className="bg-card border border-border">
              <CardContent className="p-6 text-center">
                <div className="text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No workouts yet</p>
                  <p className="text-sm">Start your first workout to see it here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <Card key={workout.id} className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">{workout.name}</h4>
                          {workout.isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-accent" />
                          ) : (
                            <Badge variant="outline" className="text-xs">In Progress</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {workout.startTime.toLocaleDateString()} • {workout.exercises.length} exercises
                        </p>
                        {workout.isCompleted && workout.endTime && (
                          <p className="text-xs text-muted-foreground">
                            Duration: {formatDuration(workout.startTime, workout.endTime)}
                          </p>
                        )}
                      </div>
                      {!workout.isCompleted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveWorkout(workout);
                            setShowLogger(true);
                          }}
                          data-testid={`button-continue-${workout.id}`}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
