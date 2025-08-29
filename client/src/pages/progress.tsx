import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trophy, TrendingUp, Camera, Award } from "lucide-react";
import { LocalStorageService, BodyMetricData, WorkoutData } from "@/lib/localStorage";
import { BodyMetricsForm } from "@/components/body-metrics-form";
import { ProgressCharts } from "@/components/progress-charts";
import { useToast } from "@/hooks/use-toast";

export default function Progress() {
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetricData[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutData[]>([]);
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [personalRecords, setPersonalRecords] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const metrics = LocalStorageService.getBodyMetrics();
    setBodyMetrics(metrics);
    
    const workouts = LocalStorageService.getWorkouts().filter(w => w.isCompleted);
    setRecentWorkouts(workouts);
    
    // Calculate PRs (simplified version)
    const prs = calculatePersonalRecords(workouts);
    setPersonalRecords(prs);
  };

  const calculatePersonalRecords = (workouts: WorkoutData[]) => {
    // Simplified PR calculation - in real app would be more sophisticated
    const exercisePRs: { [key: string]: { weight: number; reps: number; date: Date } } = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.weight && set.reps && set.setType === 'work') {
            const key = exercise.exerciseName;
            const current = exercisePRs[key];
            
            if (!current || set.weight > current.weight || 
                (set.weight === current.weight && set.reps > current.reps)) {
              exercisePRs[key] = {
                weight: set.weight,
                reps: set.reps,
                date: workout.startTime
              };
            }
          }
        });
      });
    });

    return Object.entries(exercisePRs).map(([exercise, pr]) => ({
      exercise,
      ...pr
    })).slice(0, 5); // Top 5 PRs
  };

  const latestMetrics = bodyMetrics[0];
  const previousMetrics = bodyMetrics[1];

  const getMetricChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change),
      isPositive: change > 0,
      percentage: Math.abs((change / previous) * 100)
    };
  };

  const handleMetricsSaved = () => {
    loadData();
    setShowMetricsForm(false);
    toast({
      title: "Metrics Saved! 📊",
      description: "Your body metrics have been recorded successfully.",
    });
  };

  if (showMetricsForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Log Body Metrics</h1>
          <Button
            variant="outline"
            onClick={() => setShowMetricsForm(false)}
            data-testid="button-close-metrics-form"
          >
            Cancel
          </Button>
        </div>
        <BodyMetricsForm onSave={handleMetricsSaved} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowMetricsForm(true)}
          data-testid="button-add-metrics"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" data-testid="tab-metrics">Metrics</TabsTrigger>
          <TabsTrigger value="charts" data-testid="tab-charts">Charts</TabsTrigger>
          <TabsTrigger value="records" data-testid="tab-records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {/* Personal Records Alert */}
          {personalRecords.length > 0 && (
            <Card className="gradient-bg text-white">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Recent Personal Record!</h3>
                    <p className="text-sm opacity-90">
                      {personalRecords[0].exercise}: {personalRecords[0].weight} lbs x {personalRecords[0].reps} reps
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Body Metrics Overview */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Body Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {latestMetrics ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {latestMetrics.weight ? `${latestMetrics.weight}` : '--'}
                    </p>
                    <p className="text-xs text-muted-foreground">lbs</p>
                    {(() => {
                      const change = getMetricChange(latestMetrics.weight, previousMetrics?.weight);
                      return change ? (
                        <p className={`text-xs ${change.isPositive ? 'text-destructive' : 'text-accent'}`}>
                          {change.isPositive ? '+' : '-'}{change.value.toFixed(1)} lb
                        </p>
                      ) : null;
                    })()}
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">
                      {latestMetrics.bodyFatPercentage ? `${latestMetrics.bodyFatPercentage}` : '--'}
                    </p>
                    <p className="text-xs text-muted-foreground">% BF</p>
                    {(() => {
                      const change = getMetricChange(latestMetrics.bodyFatPercentage, previousMetrics?.bodyFatPercentage);
                      return change ? (
                        <p className={`text-xs ${change.isPositive ? 'text-destructive' : 'text-accent'}`}>
                          {change.isPositive ? '+' : '-'}{change.value.toFixed(1)}%
                        </p>
                      ) : null;
                    })()}
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">
                      {latestMetrics.muscleMass ? `${latestMetrics.muscleMass}` : '--'}
                    </p>
                    <p className="text-xs text-muted-foreground">lbs lean</p>
                    {(() => {
                      const change = getMetricChange(latestMetrics.muscleMass, previousMetrics?.muscleMass);
                      return change ? (
                        <p className={`text-xs ${change.isPositive ? 'text-accent' : 'text-destructive'}`}>
                          {change.isPositive ? '+' : '-'}{change.value.toFixed(1)} lb
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No body metrics recorded yet</p>
                  <p className="text-sm">Track your progress by logging measurements</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Measurements */}
          {bodyMetrics.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Recent Measurements</h3>
              {bodyMetrics.slice(0, 5).map((metric, index) => (
                <Card key={metric.id} className="bg-card border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {metric.date.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {metric.weight && `${metric.weight} lbs`}
                          {metric.weight && metric.bodyFatPercentage && ' • '}
                          {metric.bodyFatPercentage && `${metric.bodyFatPercentage}% BF`}
                        </p>
                      </div>
                      {index === 0 && (
                        <Badge variant="secondary">Latest</Badge>
                      )}
                    </div>
                    {metric.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{metric.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

          {/* Progress Photos */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Progress Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-4">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No progress photos yet</p>
                <p className="text-sm">Add photos to track visual progress</p>
                <Button variant="outline" className="mt-3" data-testid="button-add-photo">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <ProgressCharts bodyMetrics={bodyMetrics} workouts={recentWorkouts} />
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Personal Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personalRecords.length > 0 ? (
                <div className="space-y-3">
                  {personalRecords.map((pr, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{pr.exercise}</p>
                        <p className="text-sm text-muted-foreground">
                          {pr.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-accent">{pr.weight} lbs</p>
                        <p className="text-sm text-muted-foreground">{pr.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No personal records yet</p>
                  <p className="text-sm">Complete workouts to track PRs</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workout Statistics */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Workout Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{recentWorkouts.length}</p>
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-accent">
                    {recentWorkouts.filter(w => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return w.startTime >= weekAgo;
                    }).length}
                  </p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
